import { Schema, model } from "mongoose";

const imageSchema = new Schema(
  { url: { type: String, required: true }, publicId: { type: String }, position: { type: Number, required: true } },
  { _id: false },
);

const propertySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    operation: { type: String, required: true, enum: ["Venta", "Alquiler"] },
    propertyType: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ["USD", "ARS"] },
    status: { type: String, required: true, enum: ["draft", "published"], default: "draft" },
    street: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    totalArea: { type: Number, min: 0 },
    coveredArea: { type: Number, min: 0 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    parkingSpaces: { type: Number, min: 0 },
    description: { type: String, required: true, trim: true },
    amenities: { type: String, trim: true },
    images: { type: [imageSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

propertySchema.index({ status: 1, featured: -1, createdAt: -1 });

export const Property = model("Property", propertySchema);
