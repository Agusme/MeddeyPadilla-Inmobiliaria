import { Schema, model } from "mongoose";

const schema = new Schema({
  _id: { type: String, required: true },
  owner: { type: String, required: true },
  propertyId: { type: String, default: null },
  revision: { type: String, default: null },
  expiresAt: { type: Date, required: true },
  cleanupAt: { type: Date },
  publicIds: { type: [String], default: [] },
  retiredIds: { type: [String], default: [] },
  requestHash: { type: String },
  resultId: { type: String },
}, { versionKey: false });

schema.index({ cleanupAt: 1 });

export const PropertyUploadSession = model("PropertyUploadSession", schema);
