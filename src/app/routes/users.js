import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

router.get("/", (req, res) => UserController.getAll(req, res));
router.get("/:id", (req, res) => UserController.getById(req, res));
router.post("/", (req, res) => UserController.create(req, res));
router.delete("/:id", (req, res) => UserController.delete(req, res));
router.get("/:id/rooms", (req, res) => UserController.getMyRooms(req, res));

export default router;