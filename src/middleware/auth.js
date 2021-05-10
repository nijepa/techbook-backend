import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findOne({ _id: data._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res
      .status(401)
      .send({
        err: "Not authorized to access this resource",
        info: error.message,
      });
  }
};

export default auth;
