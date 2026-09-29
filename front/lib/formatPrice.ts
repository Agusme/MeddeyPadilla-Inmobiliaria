export function formatPropertyPrice(price: number | string, currency: string) {
  const amount = Number(price).toLocaleString("es-AR");
  if (currency === "ARS") return `$ ${amount}`;
  if (currency === "USD") return `US$ ${amount}`;
  return `${currency} ${amount}`.trim();
}
