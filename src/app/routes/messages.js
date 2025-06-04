import { Router } from 'express';
import MessagesController from '../controllers/MessagesController.js';

const router = Router();

router.get("/:id", (req, res) => MessagesController.readOne(req, res));
router.post("/", (req, res) => MessagesController.create(req, res)); 
router.put("/:id", (req, res) => MessagesController.update(req, res));
router.delete("/:id", (req, res) => MessagesController.delete(req, res));


export default router;
