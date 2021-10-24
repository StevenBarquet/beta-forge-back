// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import { Response } from 'express';
import Joi from 'joi';
// ---Other
import { Callback, CallbackResponse, Validator } from '#Config/customTypes';

// -----------------------------------CONFIG-------------------------------
const debug = require('debug')('app:*');
// -----------------------------------METHODS------------------------------
export async function responseService(
  res: Response,
  callBack: Callback,
  cbParams: unknown
): Promise<void> {
  // Do a query operation and respond
  let getSomething: CallbackResponse = { internalError: false, result: {} };
  if (cbParams) {
    getSomething = await callBack(cbParams);
  } else {
    getSomething = await callBack();
  }

  const { internalError, result } = getSomething;
  if (internalError) {
    const { statusError } = result;
    const { errorType } = result;
    const genMessage = 'Error de operacion en el servidor';
    res.status(statusError || 400).send({ ...result, errorType: errorType || genMessage });
  } else {
    res.send(result);
  }
}

export function checkParams(res: Response, param: unknown, validator: Validator) {
  if (!param) {
    const result = { errorType: 'Faltan parametros en url' };
    res.status(400).send(result);
    return false;
  } if (validator) {
    const { error } = validator(param);
    if (error) {
      const { details } = error;
      const result = { errorType: `Parametro erroneo: ${details[0].message}`, joiErrors: details };
      res.status(400).send(result);
      return false;
    }
  }
  return true;
}

export function joiValidateService(res: Response, validation: Joi.ValidationResult): boolean {
  const { error } = validation;
  if (error) {
    const { details } = error;
    debug(`------joiValidateService-----\nJoi error: \n${details}`);
    const errorType = `Datos erroneos: ${details[0].message}`;
    const result = { errorType, joiErrors: details };
    res.status(400).send(result);
    return false;
  }
  return true;
}

export default null;

/*
@responseService:  Expect a function that returns an object as the example

const example = {
    result: { data: 'payload'},
    internalError: false
}

Optionally it also expect params to send to the callback function

At the end with the express metod "res", sends the payload to the client
*/
