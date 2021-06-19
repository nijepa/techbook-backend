import Router from "express";
import {
  article_list,
  article_one,
  article_add,
  article_update,
  article_delete,
} from "../controllers/article.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", article_list);
router.get("/:articleId", article_one);
router.post("/", article_add);
router.patch("/:articleId", article_update);
router.delete("/:articleId", article_delete);

export default router;