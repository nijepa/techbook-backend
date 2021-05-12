import routes from "../routes/index.js";

export default (app) => {
  app.use("/api/v1/users", routes.user);
  app.use("/api/v1/techs", routes.tech);
  app.use("/api/v1/langs", routes.lang);
  app.use("/api/v1/articles", routes.article);
}