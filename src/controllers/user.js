import User from "../models/user.js";
import auth from "../middleware/auth.js";
import Router from "express";

const router = Router();

// List of all users
const users_list = async (req, res) => {
  const users = await req.context.models.User.find().select({
    name: 1,
    _id: 1,
    username: 1,
    email: 1,
    first_name: 1,
    last_name: 1,
    picture: 1,
    isSocial: 1,
    friends: 1,
    likes: 1,
    createdAt: 1,
    user_about: 1,
  });

  return res.send(users);
};

// Register new user
const user_signup = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) {
      return res.status(401).send({ error: "User allready exists" });
    }
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Login registered user
const user_login = async (req, res) => {
  const existsEmail = await User.findOne({ email: req.body.email });
  if (!existsEmail) {
    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      return res.status(201).send({ user, token });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  try {
    if (existsEmail.isSocial === true) {
      const user = existsEmail;
      const token = await user.generateAuthToken();
      return res.send({ user, token });
    }
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// View logged in user profile
const user_profile = async (req, res) => {
  res.send(req.user);
};

// Log user out of the application
const user_logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

// Log user out of all devices
router.post("/me/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

/* router.get('/:userId', auth, async (req, res) => {
  const user = await req.context.models.User.findById(
    req.params.userId,
  );
  return res.send(user);
}); */

/* Update selected user */
const user_update = async (req, res) => {
  try {
    const existsEmail = await User.findOne({
      _id: { $ne: req.params.userId },
      email: req.body.email,
    });
    if (existsEmail) {
      return res.status(401).send({ error: "Email allready exists" });
    }
    const existsUsername = await User.findOne({
      _id: { $ne: req.params.userId },
      username: req.body.username,
    });
    if (existsUsername) {
      return res.status(401).send({ error: "Username allready exists" });
    }
    const user = await req.context.models.User.findByIdAndUpdate(
      req.params.userId,
      {
        username: req.body.username,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_about: req.body.user_about,
        picture: req.body.picture,
      },
      function (err, docs) {
        if (err) {
          res.status(500).send(err);
        } else {
          return res.send(docs);
        }
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

export {
  users_list,
  user_signup,
  user_login,
  user_profile,
  user_logout,
  user_update,
};
