import Router from "express";
import {
  user_signup,
  user_login,
  user_profile,
  user_logout,
  user_update,
  users_list,
} from "../controllers/user.js";
import {
  getFriends,
  notFriends,
  getFriendRequests,
  getFriendInvitations,
  requestFriend,
  abortRequestFriend,
  acceptFriendInvitation,
  unFriend,
} from "../controllers/friends.js";
import auth from "../middleware/auth.js";

const router = Router();

// User
router.get("/", users_list);
router.post("/signup", user_signup);
router.post("/login", user_login);
router.get("/me", auth, user_profile);
router.post("/me/logout", auth, user_logout);
router.put("/:userId", auth, user_update);

// Friends
router.get("/friends/:_id", getFriends);
router.get("/notfriends/:_id", notFriends);
router.get("/getrequestfriend/:_id", getFriendRequests);
router.get("/getfriendinvitation/:_id", getFriendInvitations);
router.post("/requestfriend/:_id", auth, requestFriend);
router.post("/acceptfriend/:_id", auth, acceptFriendInvitation);
router.post("/unfriend/:_id", auth, unFriend);
router.post("/abortfriend/:_id", auth, abortRequestFriend);

export default router;
