// --------------------------------------IMPORTS------------------------------------
// Dependencies
import Joi from 'joi';

// --------------------------MODEL DATA JOI VALIDATORS-----------------------
export function isId(data: unknown): Joi.ValidationResult {
  const schema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

  return schema.validate(data);
}

export default null;
