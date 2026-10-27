import assert from "node:assert/strict";
import test from "node:test";
import { parsePropertyAdditionalData } from "../src/utils/propertyAdditionalData";
import { Property } from "../src/models/Property";
import { formatAmenities, formatExpenses, resolveHasAmenities, resolveHasExpenses } from "../../front/lib/propertyAdditionalData";

test("optional flags preserve unknown and infer only existing legacy data", () => {
  assert.equal(resolveHasExpenses({}), undefined);
  assert.equal(resolveHasExpenses({ expenses: "" }), undefined);
  assert.equal(resolveHasExpenses({ expenses: 1500 }), true);
  assert.equal(resolveHasAmenities({}), undefined);
  assert.equal(resolveHasAmenities({ amenities: "  " }), undefined);
  assert.equal(resolveHasAmenities({ amenities: "SUM, gimnasio" }), true);
  assert.equal(resolveHasExpenses({ hasExpenses: false, expenses: 1500 }), false);
  assert.equal(resolveHasAmenities({ hasAmenities: false, amenities: "SUM" }), false);
});

test("public and admin formatting handles yes, no, unknown and explicit zero", () => {
  assert.equal(formatExpenses({}), undefined);
  assert.equal(formatExpenses({ hasExpenses: false, expenses: 100 }), "No");
  assert.equal(formatExpenses({ hasExpenses: true }), "Sí");
  assert.equal(formatExpenses({ hasExpenses: true, expenses: "" }), "Sí");
  const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  assert.equal(formatExpenses({ expenses: 1500 }), ars.format(1500));
  assert.equal(formatExpenses({ hasExpenses: true, expenses: 0 }), ars.format(0));
  assert.equal(formatAmenities({}), undefined);
  assert.equal(formatAmenities({ hasAmenities: false, amenities: "SUM" }), undefined);
  assert.equal(formatAmenities({ hasAmenities: true }), "Sí");
  assert.equal(formatAmenities({ hasAmenities: true, amenities: "  " }), "Sí");
  assert.equal(formatAmenities({ amenities: " SUM, gimnasio " }), "SUM, gimnasio");
});

test("FormData conversion accepts optional details, clears no, and validates values", () => {
  assert.deepEqual(parsePropertyAdditionalData({}), {});
  assert.deepEqual(parsePropertyAdditionalData({ expenses: "1200", amenities: " SUM " }), { expenses: 1200, amenities: "SUM" });
  assert.deepEqual(parsePropertyAdditionalData({ hasExpenses: "true", expenses: "", hasAmenities: "true", amenities: "" }), {
    hasExpenses: true, expenses: undefined, hasAmenities: true, amenities: undefined,
  });
  assert.deepEqual(parsePropertyAdditionalData({ hasExpenses: "false", hasAmenities: "false", expenses: "1200", amenities: "SUM" }), {
    hasExpenses: false, hasAmenities: false, expenses: undefined, amenities: undefined,
  });
  assert.deepEqual(parsePropertyAdditionalData({ hasExpenses: false, hasAmenities: false }), {
    hasExpenses: false, hasAmenities: false, expenses: undefined, amenities: undefined,
  });
  for (const expenses of ["-1", "NaN", "Infinity"]) assert.throws(() => parsePropertyAdditionalData({ hasExpenses: "true", expenses }));
  for (const field of ["hasExpenses", "hasAmenities"]) assert.throws(() => parsePropertyAdditionalData({ [field]: "invalid" }));
});

test("Mongoose adds no default flags and retains flags through serialization", () => {
  const base = { slug: "test", title: "Test", operation: "Venta", propertyType: "Propiedad", price: 100, currency: "USD", city: "Tucumán", description: "Test" };
  const legacy = new Property({ ...base, expenses: 1200, amenities: "SUM" });
  assert.equal(legacy.validateSync(), undefined);
  assert.equal(legacy.hasExpenses, undefined);
  assert.equal(legacy.hasAmenities, undefined);
  for (const flag of [true, false]) {
    const document = new Property({ ...base, hasExpenses: flag, hasAmenities: flag });
    assert.equal(document.validateSync(), undefined);
    const restored = Property.hydrate(JSON.parse(JSON.stringify(document)));
    assert.equal(restored.hasExpenses, flag);
    assert.equal(restored.hasAmenities, flag);
    assert.equal(restored.expenses, undefined);
    assert.equal(restored.amenities, undefined);
  }
});

test("PATCH removes stale details even when only the no flags are submitted, and preserves omitted data", async (t) => {
  Object.assign(process.env, {
    MONGODB_URI: "mongodb://localhost/additional-data-tests", JWT_SECRET: "additional-data-tests-secret-at-least-32-characters",
    ADMIN_USERNAME: "test", ADMIN_PASSWORD_HASH: "test", CLOUDINARY_CLOUD_NAME: "", CLOUDINARY_API_KEY: "", CLOUDINARY_API_SECRET: "",
  });
  const { adminPropertiesRouter } = await import("../src/routes/properties");
  const handler = adminPropertiesRouter.stack.find((layer) => layer.route?.path === "/:id" && layer.route.methods.patch)!.route.stack.at(-1)!.handle;
  const stored = new Property({ slug: "test", title: "Test", operation: "Venta", propertyType: "Propiedad", price: 100, currency: "USD", city: "Tucumán", description: "Test", hasExpenses: true, expenses: 100, hasAmenities: true, amenities: "SUM" });
  let captured: Record<string, unknown> = {};
  t.mock.method(Property, "findById", () => ({ select: () => ({ lean: async () => ({ images: [] }) }) }));
  t.mock.method(Property, "findByIdAndUpdate", async (_id: string, update: Record<string, unknown>) => { captured = update; return stored; });
  async function patch(fields: object) {
    let status = 200;
    const response = { status(code: number) { status = code; return this; }, json() { return this; } };
    await handler({ params: { id: String(stored._id) }, body: { title: "Test", operation: "Venta", propertyType: "Propiedad", price: "100", currency: "USD", city: "Tucumán", description: "Test", ...fields }, files: [] }, response);
    assert.equal(status, 200);
  }
  await patch({ hasExpenses: "false", hasAmenities: "false" });
  assert.deepEqual(captured.$unset, { expenses: "", amenities: "" });
  assert.equal((captured.$set as Record<string, unknown>).hasExpenses, false);
  assert.equal((captured.$set as Record<string, unknown>).hasAmenities, false);
  await patch({ hasExpenses: "true", expenses: "", hasAmenities: "true", amenities: "" });
  assert.deepEqual(captured.$unset, { expenses: "", amenities: "" });
  assert.equal((captured.$set as Record<string, unknown>).hasExpenses, true);
  await patch({});
  for (const field of ["hasExpenses", "expenses", "hasAmenities", "amenities"]) assert.equal(field in captured, false);
  assert.equal(captured.$unset, undefined);
});
