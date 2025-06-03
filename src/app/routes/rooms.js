import { Router } from 'express';
import RoomsController from '../controllers/RoomsController.js';

const router = Router();

router.get("/", (req, res) => RoomsController.readAll(req, res));
router.get("/:id", (req, res) => RoomsController.readOne(req, res));
router.post("/", (req, res) => RoomsController.create(req, res));
router.post("/:id", (req, res) => RoomsController.addMessage(req, res));
router.delete("/:id", (req, res) => RoomsController.delete(req, res));

export default router;
