/* eslint-disable no-console */
// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import fs from 'fs';
// ---Other
import { Certs } from './customTypes';

const sslPath: string | null = process.env.SSL_PATH || null;

// -------------------------------------MODULE---------------------------------
function getCerts(): Certs {
  let certs = {};

  try {
    if (sslPath) {
      certs = {
        cert: fs.readFileSync(`${sslPath}/fullchain.pem`),
        key: fs.readFileSync(`${sslPath}/privkey.pem`),
      };
    } else {
      certs = {
        cert: fs.readFileSync('./self-signed-certs/certificate.crt'),
        key: fs.readFileSync('./self-signed-certs/certificate.key'),
      };
    }
    console.log('exito cert: ', certs);
  } catch (error) {
    certs = {};
    console.log('fallo cert: ', error);
  }

  return certs;
}

export default getCerts;
