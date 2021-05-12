import winston from "winston";

export default (error, req, res, next) => {
  winston.error(error.message);

  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 404) {
    return res.status(404).redirect("/not-found");
  }

  return res.status(error.statusCode).json({ error: error.toString() });
};
