// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import express, { Request, Response } from 'express';
// ---Model Data
import {
  RecActivos, RecActivosType, validateProductoR, validateProductoRWithID
} from '#DataModel/RecActivos';
// ---Custom
import { checkParams, responseService, joiValidateService } from '#Config/respondServices';
import { isId } from '#DataModel/otherValidators';

// -----------------------------------CONFIG-------------------------------
const router = express.Router();
const debug = require('debug')('app:*');

// -----------------------------------ROUTES-------------------------------
// ---- Create ---------
router.post('/registrar', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const validateBody = validateProductoR(req.body);
  if (joiValidateService(res, validateBody)) {
    responseService(res, registerProduct, req.body);
  }
});
// ---- Update ---------
router.put('/editar', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const validateBody = validateProductoRWithID(req.body);
  if (joiValidateService(res, validateBody)) {
    responseService(res, updateOneProduct, req.body);
  }
});
// ----- Read One -------
router.get('/:id', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const { id } = req.params;
  if (checkParams(res, id, isId)) {
    responseService(res, getOneProduct, id);
  }
});
// ----- Delete One -------
router.delete('/:id', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const { id } = req.params;
  if (checkParams(res, id, isId)) {
    responseService(res, deleteOneProduct, id);
  }
});
// --------------------------------- QUERYS AND METHODS --------------------------
async function getOneProduct(id: string) {
  // Trae un producto de la base de datos
  try {
    const someProduct = await RecActivos.findById(id);
    debug(`------getOneProduct-----\nsuccess\n${someProduct}`);
    return {
      internalError: false,
      result: someProduct
    };
  } catch (error) {
    debug(`------getOneProduct-----\nInternal error\n\n${error}`);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al traer el producto de DB', statusError: 404 }
    };
  }
}
async function deleteOneProduct(id: string) {
  // Trae un producto de la base de datos
  try {
    const someProduct = await RecActivos.deleteOne({ _id: id });
    debug(`------deleteOneProduct-----\nsuccess\n${someProduct}`);
    return {
      internalError: false,
      result: someProduct
    };
  } catch (error) {
    debug(`------deleteOneProduct-----\nInternal error\n\n${error}`);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al traer o borrar el producto de DB', statusError: 404 }
    };
  }
}
async function registerProduct(data: RecActivosType) {
  // Crea un nuevo producto en la base de datos
  const newProd = new RecActivos({ ...data });
  try {
    const query = await newProd.save();
    debug('------createOneProduct-----\nsuccess\n', query);
    return {
      internalError: false,
      result: { status: 'success', data: query }
    };
  } catch (error) {
    debug('------createOneProduct-----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al crear producto en DB', statusError: 401 }
    };
  }
}
async function updateOneProduct(data: RecActivosType) {
  // Editar un producto de la base de datos
  const { _id } = data;
  try {
    const someProduct = await RecActivos.findById(_id);
    someProduct.set(data);
    const queryDone = await someProduct.save();
    debug(`------getOneProduct-----\nsuccess\n${queryDone}`);
    return {
      internalError: false,
      result: queryDone
    };
  } catch (error) {
    debug(`------getOneProduct-----\nInternal error\n\n${error}`);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al traer el producto de DB', statusError: 404 }
    };
  }
}

export default router;
