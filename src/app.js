import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { connectDB } from './config/db.js'
import models from './models/index.js';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
      credentials: true,
      origin: true
  })
);
app.options('*', cors());

app.use(helmet());

app.use(async (req, res, next) => {
  req.context = {
    models,
    //me: await models.User.findByLogin('nijepa'),
  };
  next();
});

app.use('/api/v1/users', routes.user);
app.use('/api/v1/techs', routes.tech);
app.use('/api/v1/langs', routes.lang);
app.use('/api/v1/articles', routes.article);

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }

  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});

app.get('*', function (req, res, next) {
  const error = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );

  error.statusCode = 301;

  next(error);
});

connectDB().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`Techbook app listening on port ${process.env.PORT}!`),
  );
});
