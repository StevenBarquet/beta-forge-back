// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
// ---Model Data
import {
  ForgeUsers,
  ForgeUsersType,
  ForgeUsersEditType,
  validateForgeUser,
  validateForgeUserWithID
} from '#DataModel/forgeUsers';
// ---Custom
import {
  checkParams,
  responseService,
  joiValidateService
} from '#Config/respondServices';
import { isId } from '#DataModel/otherValidators';
// ---Global Data
import { SALT_ROUNDS } from '#Config/globalData';

// -----------------------------------CONFIG-------------------------------
const router = express.Router();
const debug = require('debug')('app:*');

// -----------------------------------ROUTES-------------------------------
// ---- Create ---------
router.post('/registrar', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const validateBody = validateForgeUser(req.body);
  if (joiValidateService(res, validateBody)) {
    responseService(res, onRegisterUser, req.body);
  }
});
// ---- Update ---------
router.put('/editar', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const validateBody = validateForgeUserWithID(req.body);
  if (joiValidateService(res, validateBody)) {
    responseService(res, onUpdateUser, req.body);
  }
});
// ----- Read One -------
router.get('/:id', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const { id } = req.params;
  if (checkParams(res, id, isId)) {
    responseService(res, onGetOneUser, id);
  }
});
// ----- Delete One -------
router.delete('/:id', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const { id } = req.params;
  if (checkParams(res, id, isId)) {
    responseService(res, onDeleteUser, id);
  }
});

// --------------------------------- QUERYS AND METHODS --------------------------
async function onRegisterUser(data: ForgeUsersType) {
  // Si hay errores al buscar correo
  const userExist = await searchByMail(data);
  if (userExist.internalError) {
    return { internalError: userExist.internalError, result: userExist.result };
  }

  // Verificar correo no registrado
  if (!userExist.internalError && userExist.result.users.length > 0) {
    return {
      internalError: true,
      result: { errorType: 'El usuario ya está registrado', statusError: 400 }
    };
  }

  // Hash pass
  const userWithCryptedPass = await whithCryptedPassword(data);
  if (userWithCryptedPass.internalError) {
    return {
      internalError: userWithCryptedPass.internalError,
      result: userWithCryptedPass.result
    };
  }

  // Registar nuevo usuario ó retornar error al registrar
  const dbResult = await createOneUser(userWithCryptedPass.result.newUser);
  return { internalError: dbResult.internalError, result: dbResult.result };
}
async function onUpdateUser(data: ForgeUsersEditType) {
  const { pass } = data;
  let fixedUser = data;
  if (pass) {
    // Hash pass
    const userWithCryptedPass = await whithCryptedPassword(data as ForgeUsersType);
    if (userWithCryptedPass.internalError) {
      return {
        internalError: userWithCryptedPass.internalError,
        result: userWithCryptedPass.result
      };
    }
    fixedUser = userWithCryptedPass.result.newUser;
  }

  // Do update
  const updatedUser = simpleUserUpdate(fixedUser);
  return updatedUser;
}
async function onGetOneUser(id: string) {
  // Trae un producto de la base de datos
  try {
    const someUser = await ForgeUsers.findById(id);
    debug('------getOneUser-----\nsuccess\n', someUser);
    if (someUser.mail) {
      debug('------getOneUser-----\nsuccess\n', someUser);
      return {
        internalError: false,
        result: { status: 'success', user: someUser }
      };
    }
    debug('------getOneUser-----\nInternal error\n\n', someUser);
    return {
      internalError: true,
      result: { errorType: 'Usuario no existente en DB', statusError: 404 }
    };
  } catch (error) {
    debug('------getOneUser-----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al traer usuario de DB', statusError: 404 }
    };
  }
}
async function onDeleteUser(id: string) {
  // Elimina un producto en la base de datos si existe
  try {
    // Verifica que exista el producto
    await ForgeUsers.findById(id);
    try {
      // Si existe intenta hacer el DELETE
      const result = await ForgeUsers.deleteOne({ _id: id });
      debug('------deleteOneUsers-----\nsuccess\n', result);
      return {
        internalError: false,
        result: { status: 'success' }
      };
    } catch (error) {
      // Retorna error si no pudiste hacer DELETE
      debug('------deleteOneUsers----\nInternal error\n\n', error);
      return {
        internalError: true,
        result: { ...error, errorType: 'Error al borrar usuario en DB', statusError: 401 }
      };
    }
  } catch (error) {
    // Retorna error si no pudiste hacer busqueda del prod por id no encontrado
    debug('------deleteOneUsers-----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al buscar usuario en DB', statusError: 404 }
    };
  }
}
// ----------------------------------------------AUX FUNCTIONS--------------------------------------
async function simpleUserUpdate(data: ForgeUsersEditType) {
  // Actualiza un producto en la base de datos si existe
  try {
    const someUser = await ForgeUsers.findById(data._id);
    someUser.set({
      ...someUser,
      ...data
    });
    const result = await someUser.save();
    debug('------updateOneUser-----\nsuccess\n', result);
    return {
      internalError: false,
      result: { status: 'success' }
    };
  } catch (error) {
    // Retorna error si no pudiste hacer update
    debug('------updateOneUser----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: {
        ...error,
        errorType: 'Error al intentar actualizar usuario en DB',
        statusError: 500
      }
    };
  }
}

async function createOneUser(data: ForgeUsersType) {
  const user = new ForgeUsers(data);
  try {
    const dbResult = await user.save();
    debug('------createOneUser-----\nsuccess\n', dbResult);
    return {
      internalError: false,
      result: { status: 'success', data: dbResult }
    };
  } catch (error) {
    debug('------createOneUser-----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: {
        ...error,
        errorType: 'Error al crear usuario en DB',
        statusError: 401
      }
    };
  }
}

async function searchByMail(data: ForgeUsersType) {
  const { mail } = data;
  const regEx = new RegExp(`.*${mail}.*`, 'iu');
  try {
    const someUsers = await ForgeUsers.find({ mail: regEx });
    debug('------searchByMail-----\nsuccess\n', someUsers);
    return {
      internalError: false,
      result: { status: 'success', users: someUsers }
    };
  } catch (error) {
    debug('------searchByMail-----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: {
        ...error,
        errorType: 'Error al encryptar password',
        statusError: 404
      }
    };
  }
}
async function whithCryptedPassword(user: ForgeUsersType) {
  try {
    const { pass } = user;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(pass, salt);
    debug('------whithCryptedPassword-----\nsuccess\n', hashed);
    return {
      internalError: false,
      result: { status: 'success', newUser: { ...user, pass: hashed } }
    };
  } catch (error) {
    debug('------whithCryptedPassword-----\nInternal error\n\n', error);
    return {
      internalError: true,
      result: {
        ...error,
        errorType: 'Error al encryptar password',
        statusError: 404
      }
    };
  }
}

export default router;
