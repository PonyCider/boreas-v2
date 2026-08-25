import type {
  MotorDefinition,
  MotorIdentity,
  PatientResult,
  SpecialistSummary,
} from "./types";

export type DomainValidationResult<TInput> =
  | { valid: true; value: TInput }
  | { valid: false; issues: readonly string[] };

export type MotorDomainOutcome = {
  patientResult: PatientResult;
  specialistSummary: SpecialistSummary;
};

export type MotorDomain<TInput> = {
  identity: MotorIdentity;
  validate(input: unknown): DomainValidationResult<TInput>;
  evaluate(input: TInput): MotorDomainOutcome;
};

type RegisteredMotorDomain = MotorDomain<unknown>;

export type MotorDomainRegistry = ReadonlyMap<string, RegisteredMotorDomain>;

export type MotorDomainEvaluation =
  | { valid: true; outcome: MotorDomainOutcome }
  | { valid: false; issues: readonly string[] };

export function motorDefinitionKey(identity: MotorIdentity): string {
  return `${identity.motorId}@${identity.version}`;
}

export function defineMotorDomain<TInput>(
  domain: MotorDomain<TInput>,
): RegisteredMotorDomain {
  return {
    identity: domain.identity,
    validate(input) {
      const validation = domain.validate(input);
      if (!validation.valid) return validation;
      return { valid: true, value: validation.value };
    },
    evaluate(input) {
      return domain.evaluate(input as TInput);
    },
  };
}

export function createMotorDomainRegistry(
  domains: readonly RegisteredMotorDomain[],
): MotorDomainRegistry {
  const registry = new Map<string, RegisteredMotorDomain>();

  for (const domain of domains) {
    const key = motorDefinitionKey(domain.identity);
    if (registry.has(key)) {
      throw new Error(`MotorDomain duplicado: ${key}`);
    }
    registry.set(key, domain);
  }

  return registry;
}

export function evaluateMotorDomain(
  registry: MotorDomainRegistry,
  definition: MotorDefinition,
  input: unknown,
): MotorDomainEvaluation {
  const key = motorDefinitionKey(definition);
  const domain = registry.get(key);

  if (!domain) {
    throw new Error(`No existe dominio registrado para ${key}`);
  }

  const validation = domain.validate(input);
  if (!validation.valid) return validation;

  return { valid: true, outcome: domain.evaluate(validation.value) };
}
