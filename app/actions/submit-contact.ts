"use server";

import { supabase } from "@/lib/supabase";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

async function sendWhatsAppNotification(lead: {
  nombre: string;
  especialidad: string;
  whatsapp: string;
  google_maps?: string;
}): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apikey) {
    console.warn("[boreas] CALLMEBOT_PHONE or CALLMEBOT_APIKEY not set — skipping WhatsApp notification");
    return;
  }

  const text = [
    "🩺 Nuevo lead Boreas",
    `Nombre: ${lead.nombre}`,
    `Especialidad: ${lead.especialidad}`,
    `WhatsApp: ${lead.whatsapp}`,
    lead.google_maps ? `Google Maps: ${lead.google_maps}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apikey);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    console.error("[boreas] CallMeBot notification failed:", res.status, await res.text());
  }
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const nombre = String(formData.get("nombre") ?? "").trim();
    const especialidad = String(formData.get("especialidad") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const google_maps = String(formData.get("google_maps") ?? "").trim() || null;

    if (!nombre || !especialidad || !whatsapp) {
      return { success: false, error: "Por favor, completa los campos requeridos." };
    }

    const { error } = await supabase
      .from("leads")
      .insert({ nombre, especialidad, whatsapp, google_maps });

    if (error) {
      console.error("[boreas] Supabase insert error:", error);
      return { success: false, error: "Ocurrió un error al guardar tus datos. Intenta de nuevo." };
    }

    // Fire-and-forget — don't block the response on the notification
    sendWhatsAppNotification({ nombre, especialidad, whatsapp, google_maps: google_maps ?? undefined }).catch(
      (err) => console.error("[boreas] WhatsApp notification error:", err),
    );

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
    console.error("[boreas] submitContact error:", message);
    return { success: false, error: "Ocurrió un error inesperado. Intenta de nuevo." };
  }
}
