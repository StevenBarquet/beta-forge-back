// --------------------------------------IMPORTS------------------------------------
// Dependencies
import config from 'config';
import mongoose from 'mongoose';

// -----------------------------------CONFIG-------------------------------
const debugProd = require('debug')('app:prod');

// -------------------------------------MODULE---------------------------------
async function mongoConnect(): Promise<void> {
  // Mongo conect to base
  try {
    await mongoose.connect(config.get('mongoDB'), { connectTimeoutMS: 10000 }); // Return a promise
    debugProd(`Conected to ${config.get('mongoDB')}...`);
  } catch (err) {
    debugProd(`Couldnt connect because:\n${err}`);
  } finally {
    debugProd('MongoDB Promise finished...');
  }
}

export default mongoConnect;
