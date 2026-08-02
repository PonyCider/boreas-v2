/**
 * Calculadora metabólica (nutrición). Mifflin-St Jeor, la ecuación de referencia para
 * estimar gasto energético en reposo en población adulta sana.
 *
 * Fuente: Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. "A new
 * predictive equation for resting energy expenditure in healthy individuals".
 * Am J Clin Nutr. 1990;51(2):241-7.
 *
 * Es una estimación poblacional: no considera composición corporal, medicación,
 * embarazo ni patología. Los rangos de entrada existen para que un dedo resbalado no
 * produzca un número absurdo presentado con cara de dato clínico.
 */

export const METABOLICA_SOURCE =
  "Ecuación de Mifflin-St Jeor · Mifflin et al. (1990), Am J Clin Nutr 51(2):241-7";

export const METABOLICA_POBLACION =
  "Estimación para personas adultas sanas. No aplica en embarazo, lactancia ni enfermedad metabólica.";

export type Sexo = "mujer" | "hombre";

export type NivelActividad = {
  id: string;
  label: string;
  factor: number;
};

export const NIVELES_ACTIVIDAD: NivelActividad[] = [
  { id: "sedentario", label: "Sedentario: trabajo de escritorio, poco movimiento", factor: 1.2 },
  { id: "ligero", label: "Ligero: camino o me muevo 1-3 días por semana", factor: 1.375 },
  { id: "moderado", label: "Moderado: ejercicio 3-5 días por semana", factor: 1.55 },
  { id: "alto", label: "Alto: ejercicio intenso 6-7 días por semana", factor: 1.725 },
  { id: "muy-alto", label: "Muy alto: trabajo físico o doble sesión diaria", factor: 1.9 },
];

export const CAMPOS = {
  edad: { min: 18, max: 90, label: "Edad", unidad: "años" },
  peso: { min: 35, max: 250, label: "Peso", unidad: "kg" },
  estatura: { min: 130, max: 220, label: "Estatura", unidad: "cm" },
} as const;

export type CampoId = keyof typeof CAMPOS;

export type EntradaMetabolica = {
  sexo: Sexo;
  edad: number;
  peso: number;
  estatura: number;
  actividad: string;
};

export type ResultadoMetabolico = {
  /** Gasto en reposo, sin actividad. */
  basal: number;
  /** Gasto total estimado con el factor de actividad, redondeado a la decena. */
  mantenimiento: number;
};

export function validarCampo(campo: CampoId, valor: number): string | null {
  const { min, max, label, unidad } = CAMPOS[campo];
  if (!Number.isFinite(valor)) return `${label}: escribe un número.`;
  if (valor < min || valor > max) return `${label}: debe estar entre ${min} y ${max} ${unidad}.`;
  return null;
}

export function calcularMetabolica(entrada: EntradaMetabolica): ResultadoMetabolico {
  const { sexo, edad, peso, estatura, actividad } = entrada;
  const nivel = NIVELES_ACTIVIDAD.find((n) => n.id === actividad) ?? NIVELES_ACTIVIDAD[0];

  // Mifflin-St Jeor: 10*peso + 6.25*estatura - 5*edad + (hombre ? 5 : -161)
  const basal = Math.round(10 * peso + 6.25 * estatura - 5 * edad + (sexo === "hombre" ? 5 : -161));
  const mantenimiento = Math.round((basal * nivel.factor) / 10) * 10;

  return { basal, mantenimiento };
}

export function metabolicaLead(resultado: ResultadoMetabolico, actividad: string) {
  const nivel = NIVELES_ACTIVIDAD.find((n) => n.id === actividad) ?? NIVELES_ACTIVIDAD[0];
  return {
    titulo: `Estimación calculada — ${resultado.mantenimiento} kcal al día`,
    senales: [
      `Gasto en reposo: ${resultado.basal} kcal`,
      `Nivel de actividad declarado: ${nivel.label.split(":")[0]}`,
      "Estimación poblacional, no valoración nutricional",
    ],
    siguientePaso: "Llega con un punto de partida en vez de con una hoja en blanco.",
  };
}
