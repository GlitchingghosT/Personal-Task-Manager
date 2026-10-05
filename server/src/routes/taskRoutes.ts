import { Router } from "express";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/taskController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);
router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;