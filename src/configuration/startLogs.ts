// --------------------------------------IMPORTS------------------------------------
// Dependencies
import config from 'config';

// -----------------------------------CONFIG-------------------------------
const debugProd = require('debug')('app:prod');
// -----------------------------------MODULE-------------------------------
function startLogs(enviroment: string): void {
  debugProd(`------------ Backend running as:  ${enviroment}------------\n\n`);

  debugProd(`App name:  ${config.get('name')}`);
}

export default startLogs;
