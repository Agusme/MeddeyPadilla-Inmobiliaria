// Keep absent flags absent so older records retain their unknown state.
export function parsePropertyAdditionalData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const field of ["hasExpenses", "hasAmenities"] as const) {
    if (!(field in body)) continue;
    const value = body[field];
    if (value === "" || value === undefined || value === null) data[field] = undefined;
    else if (value === true || value === "true") data[field] = true;
    else if (value === false || value === "false") data[field] = false;
    else throw new Error(`El valor de ${field} no es válido.`);
  }
  if (data.hasExpenses === false) data.expenses = undefined;
  else if ("expenses" in body) {
    const raw = body.expenses;
    if (raw === "" || raw === null || raw === undefined) data.expenses = undefined;
    else {
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount < 0) throw new Error("Las expensas deben ser un número igual o mayor a 0.");
      data.expenses = amount;
    }
  }
  if (data.hasAmenities === false) data.amenities = undefined;
  else if ("amenities" in body) data.amenities = String(body.amenities ?? "").trim() || undefined;
  return data;
}
