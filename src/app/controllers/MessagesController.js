import Message from '../models/Message.js';
import User from '../models/User.js';
import Room from '../models/Room.js';

export default class MessagesController {
    
    static async readOne(req, res) {
        try {
            const message = await Message.findByPk(req.params.id, {
                include: [
                    { model: User, as: 'author' }, // Inclut auteur
                    { model: Room, as: 'room' }    // Inclut salle
                ]
            });
            
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            
            res.json(message);
        } catch (error) {
            console.error(' MessagesController.readOne:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { text, userId, roomId } = req.body;
             console.log('Tentative création message:', { text, userId, roomId });
            
            const message = await Message.create({
                text,
                userId,
                roomId
            });
            
            console.log(`Nouveau message dans room ${roomId}`);
            res.json(message);
        } catch (error) {
            console.error('MessagesController.create ERROR:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { text } = req.body;
            
            await Message.update(
                { text },
                { where: { id: req.params.id } }
            );
            
            res.json({ message: 'Message updated' });
        } catch (error) {
            console.error('MessagesController.update:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await Message.destroy({ where: { id: req.params.id } });
            res.json({ message: 'Message deleted' });
        } catch (error) {
             console.error('MessagesController.delete:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}