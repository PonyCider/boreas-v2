import { AgendaCalMotor } from "@/components/landing/motors/agenda-cal";
import { CalculadoraMetabolicaMotor } from "@/components/landing/motors/calculadora-metabolica";
import { CotizadorDentalMotor } from "@/components/landing/motors/cotizador-dental";
import { EvaluadorDolorMotor } from "@/components/landing/motors/evaluador-dolor";
import { PreTriageMotor } from "@/components/landing/motors/pre-triage";
import { SimuladorSonrisaMotor } from "@/components/landing/motors/simulador-sonrisa";
import { TamizajeGad7Motor } from "@/components/landing/motors/tamizaje-gad7";

/**
 * Ruta de trabajo: los seis motores montados a la vez, sin la rueda de por medio, para
 * iterar uno sin pelear con el selector. No se enlaza desde ningún lado.
 */
export default function MotoresPreview() {
  return (
    <main data-theme="dark" className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-16">
        <TamizajeGad7Motor />
        <CalculadoraMetabolicaMotor />
        <EvaluadorDolorMotor />
        <PreTriageMotor />
        <CotizadorDentalMotor />
        <AgendaCalMotor />

        {/* Ya no es el motor estelar de dental (pasó a ortodoncia en el catálogo), pero se
            queda montado aquí para poder seguirlo puliendo. */}
        <SimuladorSonrisaMotor />
      </div>
    </main>
  );
}
