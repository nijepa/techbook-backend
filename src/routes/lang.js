import Router from "express";
import {
  lang_list,
  lang_one,
  lang_add,
  lang_update,
  lang_delete,
} from "../controllers/lang.js";
import auth from "../middleware/auth.js";

const router = Router();

/* List of all lang */
router.get("/", lang_list);
router.get("/:langId", lang_one);
router.post("/", auth, lang_add);
router.patch("/:langId", auth, lang_update);
router.delete("/:langId", auth, lang_delete);

export default router;