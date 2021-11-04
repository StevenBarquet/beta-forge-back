// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
// ---Model Data
import {
  ForgeUsers,
  ForgeUsersType,
  validateLogin
} from '#DataModel/forgeUsers';
// ---Custom
import { joiValidateService } from '#Config/respondServices';
import { withCredentialsService, takeOffCredentials } from '#Auth/secureRespondServices';
// -----------------------------------CONFIG-------------------------------
const router = express.Router();
const debug = require('debug')('app:*');

// -----------------------------------ROUTES-------------------------------
// ---- Create ---------
router.post('/login', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  const validateBody = validateLogin(req.body);
  if (joiValidateService(res, validateBody)) {
    withCredentialsService(res, onLogin, req.body);
  }
});

router.get('/logout', (req: Request, res: Response) => {
  debug(`request for: ${req.originalUrl}`);

  takeOffCredentials(res, onLogout);
});
// --------------------------------- QUERYS AND METHODS --------------------------
function onLogout() {
  debug('------onLogout-----\nsuccess\n');
  const result = {
    internalError: false,
    result: { responseData: 'success' }
  };

  return result;
}
async function onLogin(data: ForgeUsersType) {
  // Si hay errores al buscar correo
  const userExist = await searchByMail(data);
  if (userExist.internalError) {
    return { internalError: userExist.internalError, result: userExist.result };
  }

  // Buscar el correo
  if (!userExist.internalError && userExist.result.users.length !== 1) {
    return { internalError: true, result: { errorType: 'Usuario o contraseña incorrectos', statusError: 400 } };
  }

  // Validar password
  const validAccount = userExist.result.users[0];
  const credentials = await isValidPass(data, validAccount);
  if (credentials.internalError) {
    return { internalError: credentials.internalError, result: credentials.result };
  }

  // Instalar access token y notificar success
  debug('------onLogin-----\nsuccess\n', credentials.result);
  return { internalError: false, result: credentials.result };
}

// ----------------------------------------------AUX FUNCTIONS--------------------------------------
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
async function isValidPass(reqUser: ForgeUsersType, dbUser: ForgeUsersType) {
  try {
    const { pass: reqPass } = reqUser;
    const {
      pass: dbPass, _id, nombre, mail
    } = dbUser;

    const passMatch = await bcrypt.compare(reqPass, dbPass);
    if (!passMatch) {
      debug('------isValidPass-----\nInternal error: Password no coincide\n', passMatch);
      return {
        internalError: true,
        result: { errorType: 'Usuario o contraseña incorrectos', statusError: 400 }
      };
    }
    debug('------isValidPass-----\nsuccess\n', passMatch);
    return {
      internalError: false,
      result: {
        status: 'success',
        tokenData: {
          _id, nombre, mail
        }
      }
    };
  } catch (error) {
    debug('------isValidPass-----\nInternal error\n', error);
    return {
      internalError: true,
      result: { ...error, errorType: 'Error al encryptar password', statusError: 404 }
    };
  }
}

export default router;
