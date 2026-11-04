import assert from "node:assert/strict";
import test from "node:test";
import { optionalNumber } from "../src/utils/property";
import { Property } from "../src/models/Property";

test("optional quantities distinguish empty from zero", () => {
  for (const empty of ["", undefined, null]) assert.equal(optionalNumber(empty), undefined);
  assert.equal(optionalNumber("0"), 0);
  assert.equal(optionalNumber(0), 0);
  const base = { slug: "quantity-test", title: "Test", operation: "Venta", propertyType: "Casa", price: 100, currency: "USD", city: "Test", description: "Test" };
  assert.equal(new Property(base).validateSync(), undefined);
  const zero = new Property({ ...base, bedrooms: 0, bathrooms: 0, parkingSpaces: 0, floors: 0 });
  assert.equal(zero.validateSync(), undefined);
  assert.equal(zero.bedrooms, 0);
  assert.ok(new Property({ ...base, floors: -1 }).validateSync());
  assert.ok(new Property({ ...base, floors: 1.5 }).validateSync());
});

test("PATCH clears submitted empty quantities, preserves omitted quantities and stores zero", async (t) => {
  Object.assign(process.env, { MONGODB_URI: "mongodb://localhost/quantity-tests", JWT_SECRET: "quantity-tests-secret-at-least-32-characters", ADMIN_USERNAME: "test", ADMIN_PASSWORD_HASH: "test", CLOUDINARY_CLOUD_NAME: "", CLOUDINARY_API_KEY: "", CLOUDINARY_API_SECRET: "" });
  const { adminPropertiesRouter } = await import("../src/routes/properties");
  const handler = adminPropertiesRouter.stack.find(layer => layer.route?.path === "/:id" && layer.route.methods.patch)!.route.stack.at(-1)!.handle;
  let captured: Record<string, unknown> = {};
  t.mock.method(Property, "findById", () => ({ select: () => ({ lean: async () => ({ images: [] }) }) }));
  t.mock.method(Property, "findByIdAndUpdate", async (_id: string, update: Record<string, unknown>) => { captured = update; return { propertyType: "Casa" }; });
  const base = { title: "Test", operation: "Venta", propertyType: "Casa", price: "100", currency: "USD", city: "Test", description: "Test" };
  async function patch(fields: object, expectedStatus = 200) {
    let status = 200;
    const response = { status(code: number) { status = code; return this; }, json() { return this; } };
    await handler({ params: { id: "test" }, body: { ...base, ...fields }, files: [] }, response);
    assert.equal(status, expectedStatus);
  }
  await patch({ bedrooms: "", bathrooms: "", parkingSpaces: "", floors: "" });
  assert.deepEqual(captured.$unset, { bedrooms: "", bathrooms: "", parkingSpaces: "", floors: "" });
  await patch({ bedrooms: "0", bathrooms: "0", parkingSpaces: "0", floors: "0" });
  for (const field of ["bedrooms", "bathrooms", "parkingSpaces"]) assert.equal(captured[field], 0);
  assert.equal(captured.floors, 0);
  assert.equal(captured.$unset, undefined);
  await patch({});
  for (const field of ["bedrooms", "bathrooms", "parkingSpaces", "floors"]) assert.equal(field in captured, false);
  assert.equal(captured.$unset, undefined);
  await patch({ floors: "-1" }, 400);
  await patch({ floors: "1.5" }, 400);
});
