// --------------------------------------IMPORTS------------------------------------
// Dependencies
import Joi from 'joi';
import mongoose from 'mongoose';

// ----------------------------MODEL DATA BASE---------------------------------
const mongoSchema = new mongoose.Schema({
  // Global
  mail: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  nombre: { type: String, required: true },
  celular: { type: String, required: true }
});

export const ForgeUsers = mongoose.model('ForgeUsers', mongoSchema);

// --------------------------MODEL DATA JOI VALIDATORS-----------------------
export function validateForgeUser(data: unknown): Joi.ValidationResult {
  const schema = Joi.object({
    mail: Joi.string()
      .min(3)
      .email({ tlds: { allow: false } })
      .required(),
    pass: Joi.string().min(6).required(),
    nombre: Joi.string().min(2).required(),
    celular: Joi.number().integer().greater(99999999).less(10000000000)
      .required()
  });
  return schema.validate(data);
}

export function validateForgeUserWithID(data: unknown): Joi.ValidationResult {
  const schema = Joi.object({
    _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    mail: Joi.string()
      .min(3)
      .email({ tlds: { allow: false } }),
    pass: Joi.string().min(6),
    nombre: Joi.string().min(2),
    celular: Joi.number().integer().greater(99999999).less(10000000000)
  });
  return schema.validate(data);
}
// ----------------------------- TS TYPE ---------------------------
export interface ForgeUsersType {
  _id?: string;
  mail: string;
  pass: string;
  nombre: string;
  celular: number;
}

export interface ForgeUsersEditType {
  _id: string;
  mail?: string;
  pass?: string;
  nombre?: string;
  celular?: number;
}

export default null;
