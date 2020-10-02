import User from '../models/user.js';
import mongodb from 'mongodb';

// List of friends for selected user
const getFriends = async (req, res) => {
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
    }},
    { $lookup: {from: 'users', localField: 'shapes.user', foreignField: '_id', as: 'friends'} }
  ])
  res.json({
    user
  });
};

// List of NOT friends for selected user 
const notFriends = async(req, res) => {
  try {
    let id = req.params._id;
    let users = await User.find({
      "_id": {"$ne": id},
      "friends.user": { "$nin": id } }
    )  
    res.json({
      users
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

// List of friend requests
const getFriendRequests = async (req, res) => {
  let id = req.params._id;
  let user = await User.aggregate([
    {$match: {"_id": mongodb.ObjectId(id)}},
    {$project: {
      shapes: {$filter: {
        input: '$friends',
        as: 'friend',
        cond: {$eq: ['$$friend.status', 0]}
      }},
        _id: 0, //0 means do not show the field
    }},
    { $lookup: {from: 'users', localField: 'shapes.user', foreignField: '_id', as: 'friends'} }
  ])
  res.json({
    user
  });
}

// Listt of friend invitations
const getFriendInvitations = async (req, res) => {
  let id = req.params._id;
  let user = await User.aggregate([
    {$match: {"_id": mongodb.ObjectId(id)}},
    {$project: {
      shapes: {$filter: {
        input: '$friends',
        as: 'friend',
        cond: {$eq: ['$$friend.status', 2]}
      }},
        _id: 0, //0 means do not show the field
    }},
    { $lookup: {from: 'users', localField: 'shapes.user', foreignField: '_id', as: 'friends'} }
  ])
  res.json({
    user
  });
}

// Request friend
const requestFriend = async (req, res) => {
  try {
    let friend = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $push: { 'friends': {'user': req.body.friend_id, 'status': 0 } }});
    let newFriend = await User.findOneAndUpdate(
      { _id: req.body.friend_id },
      { $push: { 'friends': {'user': req.params._id, 'status': 2 } }})
    return res.send(newFriend);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Abort Request friend
const abortRequestFriend = async (req, res) => {
  try {
    let friend = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $pull: { 'friends': {'user': req.body.friend_id } }});
    let newFriend = await User.findOneAndUpdate(
      { _id: req.body.friend_id },
      { $pull: { 'friends': {'user': req.params._id } }})
    return res.send(newFriend);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Accept friend invitation
const acceptFriendInvitation = async (req, res) => {
  try {
    let friend = await User.findOneAndUpdate(
      { _id: req.params._id, friends: {$elemMatch: {user: req.body.friend_id}} },
      { "$set": { "friends.$.status": 1 } })
    let newFriend = await User.findOneAndUpdate(
      { _id: req.body.friend_id, friends: {$elemMatch: {user:req.params._id }}},
      { "$set": { "friends.$.status": 1 } })
    return res.send(newFriend);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Un-friend
const unFriend = async (req, res) => {
  try {
    let friend = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $pull: { 'friends': {'user': req.body.friend_id } }});
    let newFriend = await User.findOneAndUpdate(
      { _id: req.body.friend_id },
      { $pull: { 'friends': {'user': req.params._id } }})
    return res.send(newFriend);
  } catch (error) {
    res.status(400).send(error);
  }
}

export { 
  getFriends,
  notFriends,
  getFriendRequests,
  getFriendInvitations,
  requestFriend,
  abortRequestFriend,
  acceptFriendInvitation,
  unFriend
};