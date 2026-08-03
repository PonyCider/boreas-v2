import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { agendaMotor } from "@/content/motors";

export const metadata: Metadata = {
  title: "Aviso de privacidad | Boreas",
  description:
    "Cómo Boreas trata los datos personales que recibe a través de este sitio, conforme a la LFPDPPP.",
};

// Decisión del titular (2026-08-01): se publica ciudad y estado en vez del domicilio
// completo, y el correo queda como canal de contacto. La LFPDPPP art. 16 fr. I pide
// domicilio; el hueco es deliberado y está anotado en el spec de Epic 3. Se cierra
// cuando haya buzón u oficina virtual.
const responsable = {
  nombre: "Carlos Jafet de la Cruz Ramos",
  ubicacion: "Mérida, Yucatán, México",
  correo: "hola@boreas.one",
};

const ULTIMA_ACTUALIZACION = "1 de agosto de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-snug text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-36 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">Aviso de privacidad</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.12] tracking-[-0.01em] text-foreground">
          Qué hacemos con tus datos
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
          Aviso de privacidad integral conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento. Última
          actualización: {ULTIMA_ACTUALIZACION}.
        </p>

        <Section title="Quién es responsable de tus datos">
          <p>
            {responsable.nombre}, persona física con actividad empresarial que opera bajo la marca
            Boreas, con domicilio en {responsable.ubicacion}, es responsable del tratamiento de los
            datos personales que recibe a través de este sitio. Puedes contactarnos en{" "}
            <a
              href={`mailto:${responsable.correo}`}
              className="text-accent underline underline-offset-4"
            >
              {responsable.correo}
            </a>
            .
          </p>
        </Section>

        <Section title="Qué datos recabamos y por qué">
          <p>
            <strong className="font-medium text-foreground">Al agendar una llamada.</strong> El
            calendario de este sitio lo opera Cal.com. Cuando reservas, ese servicio recaba tu
            nombre, correo electrónico, zona horaria y lo que escribas en el campo de notas, con la
            única finalidad de apartar la llamada y enviarte confirmación y recordatorio.
          </p>
          <p>
            <strong className="font-medium text-foreground">Al escribirnos por el formulario.</strong>{" "}
            Recabamos nombre, correo, teléfono opcional y el mensaje que redactes, para responder tu
            solicitud y cotizar el servicio.
          </p>
          <p>
            <strong className="font-medium text-foreground">
              Al usar los motores de demostración.
            </strong>{" "}
            No recabamos nada. Los motores de especialidad corren completos en tu navegador: lo que
            escribas en ellos no viaja a ningún servidor, no se guarda y no lo vemos.
          </p>
          <p>
            No recabamos datos personales sensibles a través de este sitio, ni tomamos decisiones
            automatizadas sobre ti.
          </p>
        </Section>

        <Section title="Transferencias">
          <p>
            Para operar el calendario transferimos los datos de tu reserva a Cal.com, Inc., con
            servidores fuera de México. Consulta{" "}
            <a
              href={agendaMotor.calPrivacyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4"
            >
              su aviso de privacidad
            </a>
            . No vendemos, cedemos ni compartimos tus datos con nadie más, salvo requerimiento de
            autoridad competente.
          </p>
        </Section>

        <Section title="Cuánto tiempo los conservamos">
          <p>
            Los datos de una reserva se conservan mientras la llamada siga en el calendario y hasta
            24 meses después, para dar seguimiento comercial. Los mensajes del formulario se
            conservan 24 meses. Después se eliminan.
          </p>
        </Section>

        <Section title="Tus derechos ARCO">
          <p>
            Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus
            datos, así como revocar tu consentimiento, escribiendo a{" "}
            <a
              href={`mailto:${responsable.correo}`}
              className="text-accent underline underline-offset-4"
            >
              {responsable.correo}
            </a>
            . Indica tu nombre, un medio para responderte y qué derecho quieres ejercer.
            Respondemos en un máximo de 20 días hábiles.
          </p>
          <p>
            Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir ante
            la autoridad garante en materia de protección de datos personales.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Este sitio no usa cookies de publicidad ni de rastreo. El calendario embebido puede
            instalar cookies propias de Cal.com necesarias para su funcionamiento; puedes
            bloquearlas desde tu navegador, aunque entonces el calendario no cargará y tendrás que
            abrirlo en una pestaña aparte.
          </p>
        </Section>

        <Section title="Cambios a este aviso">
          <p>
            Cualquier modificación se publica en esta misma página con su fecha de actualización.
          </p>
        </Section>

        <p className="mt-12">
          <Link href="/" className="text-accent underline underline-offset-4">
            Volver al inicio
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
