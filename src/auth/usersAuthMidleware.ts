// ---Dependencies
import { Response, Request, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';
// ---Other
import { CallbackResponse } from '#Config/customTypes';
// ---Model Data
import { ForgeUsersType } from '#DataModel/forgeUsers';
// ---Global Data
import {
  TOKEN_NAME,
  TOKEN_RANDOM_STRING,
  REFRESH_TOKEN_EXPIRATION
} from '#Config/globalData';

// -----------------------------------CONFIG-------------------------------
const debug = require('debug')('app:*');

// -----------------------------------MAIN------------------------------
export default function isAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cookie } = req.headers;

  // Si no hay cookies en la petición
  if (!cookie) {
    const resData = {
      internalError: true,
      result: { errorType: 'Peticion sin credenciales', statusError: 400 }
    };
    onReject(res, resData);
    return null;
  }

  // Si no existe el token de autenticación
  const tokenData = searchToken(cookie);
  if (tokenData.internalError) {
    const resData = {
      internalError: true,
      result: { errorType: tokenData.result.errorType, statusError: 400 }
    };
    onReject(res, resData);
    return null;
  }

  // Si el token es inválido
  const { responseData: authToken } = tokenData.result;
  const validToken = isValidToken(authToken!);
  if (validToken.internalError) {
    const resData = {
      internalError: true,
      result: { errorType: validToken.result.errorType, statusError: 400 }
    };
    onReject(res, resData);
    return null;
  }

  // Si el token es válido genera el refresh token y permite la consulta posterior
  setRefreshToken(validToken.result.responseData as ForgeUsersType, res);
  return next();
}

// ----------------------------------- MAIN AUX METHODS------------------------------
function onReject(res: Response, data: CallbackResponse) {
  const { result } = data;
  const { errorType, statusError } = result;
  const genMessage = 'Error de operacion en el servidor';
  res
    .status(statusError || 400)
    .send({ ...result, errorType: errorType || genMessage });
}

function searchToken(cookies: string) {
  const cookiesArray = cookies.split(';');
  for (let index = 0; index < cookiesArray.length; index++) {
    const cookie = cookiesArray[index];
    const cleanCookie = cookie.trim();
    const { authToken, reqTokenName } = getCookieProps(cleanCookie);
    if (isValidTokenName(reqTokenName)) {
      debug('------searchCookie-----\nsuccess: Token localizado\n');
      return {
        internalError: false,
        result: { status: 'success', responseData: authToken }
      };
    }
  }
  debug('------searchCookie-----\nInternal error: Token no localizado');
  return {
    internalError: true,
    result: { badCredentials: true, errorType: 'Token no localizado' }
  };
}

function isValidToken(someToken: string) {
  try {
    const payload = verify(someToken, TOKEN_RANDOM_STRING);
    return {
      internalError: false,
      result: { status: 'success', responseData: payload }
    };
  } catch (err) {
    debug(
      `------searchCookie-----\nInternal error: Error validando el token\n${err}`
    );
    return {
      internalError: true,
      result: { badCredentials: true, errorType: 'Error validando el token' }
    };
  }
}

function setRefreshToken(decodedToken: ForgeUsersType, res: Response) {
  const { _id, nombre, mail } = decodedToken;
  const tokenData = { _id, nombre, mail };
  const refreshToken = sign(tokenData, TOKEN_RANDOM_STRING, {
    expiresIn: REFRESH_TOKEN_EXPIRATION
  });
  res.cookie(TOKEN_NAME, refreshToken);
  debug('Refresh token set');
}
// ----------------------------------- SECONDARY AUX METHODS------------------------------
function getCookieProps(someCookie: string) {
  const { length: lengthName } = TOKEN_NAME;
  const { length } = someCookie;

  const result = {
    authToken: someCookie.substring(lengthName + 1, length),
    reqTokenName: someCookie.substring(0, lengthName)
  };

  return result;
}

function isValidTokenName(tokenName: string) {
  if (tokenName && tokenName === TOKEN_NAME) {
    return true;
  }
  return false;
}
