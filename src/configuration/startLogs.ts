// --------------------------------------IMPORTS------------------------------------
// Dependencies
import config from 'config';
import debug from 'debug';

// -----------------------------------CONFIG-------------------------------
debug('app:prod');
// -----------------------------------MODULE-------------------------------
function startLogs(enviroment: string): void {
  debug(`------------ Backend running as:  ${enviroment}------------\n\n`);

  debug(`App name:  ${config.get('name')}`);
}

export default startLogs;
