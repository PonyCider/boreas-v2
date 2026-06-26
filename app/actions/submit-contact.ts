"use server";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    // Mock latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const nombre = String(formData.get("nombre") ?? "").trim();
    const especialidad = String(formData.get("especialidad") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const googleMaps = String(formData.get("google_maps") ?? "").trim();

    if (!nombre || !especialidad || !whatsapp) {
      return { success: false, error: "Por favor, completa los campos requeridos." };
    }

    console.log("Lead captured:", { nombre, especialidad, whatsapp, googleMaps });

    // Ready for Supabase client setup in future by user
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
    return { success: false, error: message };
  }
}
