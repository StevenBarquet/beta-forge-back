// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
// ---Other
import { Callback, CallbackResponse } from '#Config/customTypes';
// ---Global Data
import { TOKEN_NAME, TOKEN_RANDOM_STRING } from '#Config/globalData';

// -----------------------------------METHODS------------------------------
export async function withCredentialsService(
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
    res.cookie(TOKEN_NAME, '');
    res.status(statusError || 400).send({ ...result, errorType: errorType || genMessage });
  } else {
    const { tokenData } = result;
    const accessToken = sign(tokenData!, TOKEN_RANDOM_STRING, { expiresIn: '2h' });
    res.cookie(TOKEN_NAME, accessToken);
    res.send(result);
  }
}
export async function takeOffCredentials(
  res: Response,
  callBack: (() => CallbackResponse)
): Promise<void> {
  const getSomething: CallbackResponse = callBack();

  const { internalError, result } = getSomething;
  if (internalError) {
    const { statusError } = result;
    const { errorType } = result;
    const genMessage = 'Error de operacion en el servidor';
    res.status(statusError || 400).send({ ...result, errorType: errorType || genMessage });
  } else {
    res.cookie(TOKEN_NAME, '');
    res.send(result);
  }
}

export default null;
