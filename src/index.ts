// --------------------------------------IMPORTS------------------------------------
// ---Dependencies
import express from 'express';
// ---Middlewares
import helmet from 'helmet';
import cors from 'cors';
import usersAuth from '#Auth/usersAuthMidleware';
// ---Routes
import recActivosAdminRoute from '#Routes/recActivosAdmin';
import forgeUsersAdminRoute from '#Routes/forgeUsers';
import usersAutenticationRoute from '#Auth/usersAuth';
// ---Others
import getCerts from '#Config/getCerts';
import startLogs from '#Config/startLogs';
import mongoConnect from '#Config/mongoConfig';

// -----------------------------------CONFIG-------------------------------
const debugProd = require('debug')('app:prod');

const app = express();
const enviroment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 4000;

startLogs(enviroment); // Just and example of posible use of configs

// -----------------------------------MIDDLEWARES-------------------------------
app.use(express.json()); // Needed to read req.body
app.use(helmet()); // For security
app.use(cors()); // For security

mongoConnect();

// -----------------------------------ROUTES-------------------------------
app.use('/api/admin/recurrentes/', recActivosAdminRoute);
app.use('/api/forgeUsers/', usersAuth, forgeUsersAdminRoute);
app.use('/api/usersAutentication/', usersAutenticationRoute);

// -----------------------------------SSL-------------------------------
const http = require('http');
const https = require('https');

const trySSL = process.env.USE_SSL || false; // Set use of https from enviroment

const server = trySSL ? https : http;
const options = trySSL ? getCerts() : {}; // Get ssl certs if https true

// -----------------------------------SERVER-------------------------------
server
  .createServer(options, app)
  .listen(port, () => {
    debugProd(`https: ${trySSL}, listening to port ${port}...`);
  });
