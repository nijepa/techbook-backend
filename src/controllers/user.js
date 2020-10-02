import User from '../models/user.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js'; 
import mongodb from 'mongodb';


/* import passport from "passport";
import dotenv from "dotenv";
import strategy from "passport-facebook";

import userModel from "../models/user.js";

const FacebookStrategy = strategy.Strategy;

dotenv.config();
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const userData = {
        email,
        firstName: first_name,
        lastName: last_name
      };
      new userModel(userData).save();
      done(null, profile);
    }
  )
); */







// List of friends for selected user
/* const getFriends = async (req, res) => {
  let id = req.params._id;
  let user = await User.aggregate([
    {$match: {"_id": mongodb.ObjectId(id)}},
    {$project: {
        shapes: {$filter: {
            input: '$friends',
            as: 'friend',
            cond: {$eq: ['$$friend.status', 1]}
        }},
        _id: 0, //0 means do not show the field
        "email":1,
        "username":1
      }}
    ])
    res.json({
      user
    });
}; */




/* const getFriends = async (req, res) => {
  try {
    let id = req.params._id;
    console.log(req.params);
    let user = await User.aggregate([
      { "$match": { "_id": mongodb.ObjectId(id) } },
      { "$lookup": {
        "from": User.collection.name,
        "let": { "friends": "$friends" },
        "pipeline": [
          { "$match": {
            "friends.status": 1,
          }},
          { "$project": { 
              "username": 1, 
              "email": 1,
              // "avatar": 1
            }
          }
        ],
        "as": "friends"
      }}, 
    ])

    res.json({
      user
    });
  } catch (error) {
    res.status(400).send(error);
  }
} */

// List of all users
const users_list = async (req, res) => {
  const users = await req.context.models.User.find();
  return res.send(users);
};


// Register new user
const user_signup = async (req, res, next) => {
  try {
    const exists = await User.findOne({email: req.body.email});
    if (exists) {
      return res.status(401).send({error: 'User allready exists'})
    }
    const user = new User(req.body)
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
};

// Login registered user
const user_login = async(req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({error: 'Login failed! Check authentication credentials'})
    }
    
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
};

// View logged in user profile
const user_profile = async(req, res) => {
  res.send(req.user)
};

// Log user out of the application
const user_logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
};

// Log user out of all devices
/* router.post('/me/logoutall', auth, async(req, res) => {
  try {
      req.user.tokens.splice(0, req.user.tokens.length)
      await req.user.save()
      res.send()
  } catch (error) {
      res.status(500).send(error)
  }
}) */

/* router.get('/:userId', auth, async (req, res) => {
  const user = await req.context.models.User.findById(
    req.params.userId,
  );
  return res.send(user);
}); */

/* Update selected user */
const user_update = async (req, res) => {
  try {
    const existsEmail = await User.findOne({_id: { $ne: req.params.userId }, email: req.body.email});
    if (existsEmail) {
      return res.status(401).send({error: 'Email allready exists'})
    }
    const existsUsername = await User.findOne({_id: { $ne: req.params.userId }, username: req.body.username});
    if (existsUsername) {
      return res.status(401).send({error: 'Username allready exists'})
    } 
    const user = await req.context.models.User.findByIdAndUpdate(
      req.params.userId, 
      { username: req.body.username,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_about: req.body.user_about }, 
      function (err, docs) { 
        if (err){ 
          res.status(500).send(err)
        } 
        else{ 
          //console.log("Updated User : ", docs); 
          return res.send(docs);
        } 
    });
  } catch(error) {
    res.status(500).send(error)
  }
}; 

export { 
        users_list,
        user_signup, 
        user_login, 
        user_profile, 
        user_logout, 
        user_update
      };