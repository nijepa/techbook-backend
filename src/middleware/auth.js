import jwt from "jsonwebtoken";
import User from "../models/user.js";
//import bcrypt from "bcrypt";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);

    /*    const bu = await zz(req)
console.log(bu)
let isPasswordMatch
  for(let i = 0; i < bu.length; i++) {
     bu[i].tokens.map(async (el) => { return isPasswordMatch = await chP(el)})
  }

  console.log(isPasswordMatch)
   async function chP(pp) {
    await bcrypt.compare(token, pp)
   } */

    const user = await User.findOne({ _id: data._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({
      err: "Not authorized to access this resource",
      info: error.message,
    });
  }
};

/* const zz = async (r) => { 
  const users = await r.context.models.User.find()
  const zu = users.map((t) => {
    let container = {};
    container = {id: t._id, tokens: t.tokens.map((tok) => tok.token) };
    return container;
  })
  return zu
} */

export default auth;
