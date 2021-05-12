import Router from "express";
import {
  user_signup,
  user_login,
  user_profile,
  user_logout,
  user_update,
  users_list,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", users_list);
router.post("/signup", user_signup);
router.post("/login", user_login);
router.get("/me", auth, user_profile);
router.post("/me/logout", auth, user_logout);
router.put("/:userId", auth, user_update);

export default router;
