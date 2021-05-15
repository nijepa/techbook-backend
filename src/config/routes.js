import routes from "../routes/index.js";
import error from "../middleware/error.js";

const URL_PATH = "/api/v1/";

export default (app) => {
  app.use(URL_PATH + "users", routes.user);
  app.use(URL_PATH + "techs", routes.tech);
  app.use(URL_PATH + "langs", routes.lang);
  app.use(URL_PATH + "articles", routes.article);
  app.get(URL_PATH, (req, res) => {
    res.send("<h3>Techbook API is running ...</h3>");
  });
  app.use(error);
  app.get("*", function (req, res, next) {
    const err = new Error(`${req.ip} tried to access ${req.originalUrl}`);
    error.statusCode = 404;
    return res.status(error.statusCode).json({ error: err.toString() })
    //next(err);
  });
}