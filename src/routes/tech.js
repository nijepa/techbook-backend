import Router from "express";
import {
  tech_list,
  tech_one,
  tech_add,
  tech_update,
  tech_delete,
} from "../controllers/tech.js";
import auth from "../middleware/auth.js";

const router = Router();

/* List of all tech */
router.get("/", tech_list);
router.get("/:techId", tech_one);
router.post("/", auth, tech_add);
router.patch("/:techId",auth,  tech_update);
router.delete("/:techId", auth, tech_delete);

export default router;
