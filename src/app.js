import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import winston from "winston";
import "winston-mongodb";
import express from "express";
import { connectDB } from "./config/db.js";
import error from "./middleware/error.js";
import models from "./models/index.js";
import routes from "./routes/index.js";

const app = express();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors());

app.use(helmet());

app.use(async (req, res, next) => {
  req.context = {
    models,
    //me: await models.User.findByLogin('nijepa'),
  };
  next();
});

app.use("/api/v1/users", routes.user);
app.use("/api/v1/techs", routes.tech);
app.use("/api/v1/langs", routes.lang);
app.use("/api/v1/articles", routes.article);

app.get("*", function (req, res, next) {
  const err = new Error(`${req.ip} tried to access ${req.originalUrl}`);

  error.statusCode = 404;

  next(err);
});

app.use(error);

connectDB().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`Techbook app listening on port ${process.env.PORT}!`)
  );
});
