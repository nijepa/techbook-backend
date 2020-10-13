import 'dotenv/config.js';
import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db.js'
import models from './models/index.js';
import routes from './routes/index.js';
import history from 'connect-history-api-fallback';

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
//app.use(cors());

app.use(async (req, res, next) => {
  req.context = {
    models,
    //me: await models.User.findByLogin('nijepa'),
  };
  next();
});

app.use('/users', routes.user);
app.use('/posts', routes.post);

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

// Middleware for serving '/dist' directory
//const staticFileMiddleware = express.static('dist');

// 1st call for unredirected requests 
//app.use(staticFileMiddleware);

// Support history api 
app.use(history({
  index: '/dist/index.html'
}));

// 2nd call for redirected requests
//app.use(staticFileMiddleware);

connectDB().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`Odinbook app listening on port ${process.env.PORT}!`),
  );
});