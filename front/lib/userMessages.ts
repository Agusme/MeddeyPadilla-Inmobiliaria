export class UserMessageError extends Error {}

export function userErrorMessage(error: unknown, fallback: string) {
  return error instanceof UserMessageError ? error.message : fallback;
}

const localizedFields = new WeakSet<Element>();

export function localizeFieldValidation(field: EventTarget) {
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return "";
  const { validity } = field;
  if (validity.customError) return localizedFields.has(field) ? field.validationMessage : "";
  const message = validity.valueMissing ? "Completá este campo."
    : validity.typeMismatch && field instanceof HTMLInputElement && field.type === "email" ? "Ingresá un correo electrónico válido."
      : validity.rangeUnderflow ? `Ingresá un valor igual o mayor a ${field.getAttribute("min") ?? "0"}.`
        : validity.rangeOverflow ? `Ingresá un valor igual o menor a ${field.getAttribute("max")}.`
          : validity.stepMismatch && field.getAttribute("step") === "1" ? "Ingresá un número entero."
            : validity.badInput ? "Ingresá un número válido."
              : "Revisá el valor de este campo.";
  if (!(field instanceof HTMLSelectElement)) {
    field.setCustomValidity(message);
    localizedFields.add(field);
  }
  return message;
}

export function clearLocalizedValidation(field: EventTarget) {
  if (localizedFields.delete(field as Element)
    && (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
    field.setCustomValidity("");
  }
}
