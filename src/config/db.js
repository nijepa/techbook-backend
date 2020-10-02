import mongoose from 'mongoose';
import 'dotenv/config.js';
// require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const conn = process.env.MONGODB_URI;

const connectDB = () => { 
  return mongoose.connect(conn, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
};
// Expose the connection
export { connectDB };