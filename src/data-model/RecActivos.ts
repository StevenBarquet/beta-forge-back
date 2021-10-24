// --------------------------------------IMPORTS------------------------------------
// Dependencies
import Joi from 'joi';
import mongoose from 'mongoose';

// ----------------------------MODEL DATA BASE---------------------------------
const mongoSchema = new mongoose.Schema({
  // Global
  tipoProducto: { type: String, required: true },
  perteneceA: { type: String, required: true },
  nombreProducto: { type: String, required: true },
  variante: String,
  pagoVencido: { type: Boolean, required: true },
  // Config
  serverIP: { type: String, required: true },
  dominio: String,
  proveedorNube: String,
  renovacionDominio: Date,
  // Pricing
  tarifaHora: Number,
  tarifaDia: Number,
  tarifaMes: Number,
  tarifaSemestre: Number,
  tarifaAnio: Number,
  proximaTarifaHora: Number,
  proximaTarifaDia: Number,
  proximaTarifaMes: Number,
  proximaTarifaSemestre: Number,
  proximaTarifaAnio: Number,
  fechaProximaTarifa: Date,
  fechalimitePago: Date,
  horasContratadas: Number,
  contadorMesesPagados: Number
});

export const RecActivos = mongoose.model('RecActivos', mongoSchema);

// --------------------------MODEL DATA JOI VALIDATORS-----------------------
export function validateProductoR(data: unknown): Joi.ValidationResult {
  const productTypes = ['ecommerce', 'landing', 'cv'];
  const schema = Joi.object({
    // Global
    tipoProducto: Joi.string().valid(...productTypes).required(),
    nombreProducto: Joi.string().min(2).required(),
    perteneceA: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    variante: Joi.string(), // agregar variantes validas
    pagoVencido: Joi.boolean().required(),
    // Config
    serverIP: Joi.string().required(), // agregar regex de ip
    dominio: Joi.string(), // agregar regex de dominio
    proveedorNube: Joi.string(),
    renovacionDominio: Joi.date(),
    // Pricing
    tarifaHora: Joi.number(),
    tarifaDia: Joi.number(),
    tarifaMes: Joi.number(),
    tarifaSemestre: Joi.number(),
    tarifaAnio: Joi.number(),
    proximaTarifaHora: Joi.number(),
    proximaTarifaDia: Joi.number(),
    proximaTarifaMes: Joi.number(),
    proximaTarifaSemestre: Joi.number(),
    proximaTarifaAnio: Joi.number(),
    fechaProximaTarifa: Joi.date(),
    fechalimitePago: Joi.date(),
    horasContratadas: Joi.number(),
    contadorMesesPagados: Joi.number()
  });
  return schema.validate(data);
}

export function validateProductoRWithID(data: unknown): Joi.ValidationResult {
  const productTypes = ['ecommerce', 'landing', 'cv'];
  const schema = Joi.object({
    // Global
    _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    tipoProducto: Joi.string().valid(...productTypes).required(),
    nombreProducto: Joi.string().min(2).required(),
    perteneceA: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    variante: Joi.string(), // agregar variantes validas
    pagoVencido: Joi.boolean().required(),
    // Config
    serverIP: Joi.string().required(), // agregar regex de ip
    dominio: Joi.string(), // agregar regex de dominio
    proveedorNube: Joi.string(),
    renovacionDominio: Joi.date(),
    // Pricing
    tarifaHora: Joi.number(),
    tarifaDia: Joi.number(),
    tarifaMes: Joi.number(),
    tarifaSemestre: Joi.number(),
    tarifaAnio: Joi.number(),
    proximaTarifaHora: Joi.number(),
    proximaTarifaDia: Joi.number(),
    proximaTarifaMes: Joi.number(),
    proximaTarifaSemestre: Joi.number(),
    proximaTarifaAnio: Joi.number(),
    fechaProximaTarifa: Joi.date(),
    fechalimitePago: Joi.date(),
    horasContratadas: Joi.number(),
    contadorMesesPagados: Joi.number()
  });
  return schema.validate(data);
}
// ----------------------------- TS TYPE ---------------------------
export interface RecActivosType {
  // Global
  _id?: string;
  tipoProducto: string;
  perteneceA: string;
  variante?: string;
  pagoVencido: boolean;
  nombreProducto: string;
  // Config
  serverIP: string;
  dominio?: string;
  proveedorNube?: string;
  renovacionDominio?: Date;
  // Pricing
  tarifaHora?: number;
  tarifaDia?: number;
  tarifaMes?: number;
  tarifaSemestre?: number;
  tarifaAnio?: number;
  proximaTarifaHora?: number;
  proximaTarifaDia?: number;
  proximaTarifaMes?: number;
  proximaTarifaSemestre?: number;
  proximaTarifaAnio?: number;
  fechaProximaTarifa?: Date;
  fechalimitePago?: Date;
  horasContratadas?: number;
  contadorMesesPagados?: number;
}

export default null;
