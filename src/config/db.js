import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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
//const conn = process.env.MONGODB_URI_TEST;

const connectDB = async () => {
  try {
    await mongoose
      .connect(conn, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
    return console.log(`Connected to ${conn} ...`);
  } catch (err) {
    return console.error(`Could not connect to ${conn} , error: ${err}`);
  }
};
// Expose the connection
export { connectDB };
