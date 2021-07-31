import winston from "winston";
import "winston-mongodb";
import "express-async-errors";

export default () => {
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleRejections: true,
      handleExceptions: true,
    })
  );

  winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      options: {
        useUnifiedTopology: true,
      },
      level: "error",
    })
  );
};
