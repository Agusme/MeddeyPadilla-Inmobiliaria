import assert from "node:assert/strict";
import test from "node:test";
import { toPublicProperty } from "../components/properties/propertyRepository";
import type { ApiProperty } from "../lib/api";

const property: ApiProperty = {
  _id: "test", slug: "test", title: "Casa", operation: "Venta", propertyType: "Casa",
  price: 100, currency: "USD", status: "published", street: "", city: "Tucumán",
  description: "Casa", images: [], featured: false, createdAt: "2026-01-01",
};

test("public characteristics omit invalid values and keep zero and no in sequence", () => {
  const detail = toPublicProperty({
    ...property, bedrooms: -1, bathrooms: 0, coveredArea: NaN, totalArea: 120,
    parkingSpaces: 0, floors: Infinity, hasExpenses: false,
  });
  assert.deepEqual(detail.features, [
    { label: "Baños", value: 0 },
    { label: "Superficie total", value: "120 m²" },
    { label: "Cochera", value: 0 },
    { label: "Expensas", value: "No" },
  ]);
  assert.deepEqual(detail.details, []);
});

test("public characteristics allow an empty table and retain valid expense information", () => {
  assert.deepEqual(toPublicProperty({ ...property, expenses: NaN }).features, []);
  assert.deepEqual(toPublicProperty({ ...property, hasExpenses: true }).features, [{ label: "Expensas", value: "Sí" }]);
  assert.deepEqual(toPublicProperty({ ...property, expenses: 0 }).features, [
    { label: "Expensas", value: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(0) },
  ]);
});
