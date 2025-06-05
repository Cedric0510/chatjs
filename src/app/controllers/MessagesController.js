import Message from '../models/Message.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import EventsController from './EventsController.js'; // NOUVEAU

export default class MessagesController {
    
    static async readAll(req, res) {
        try {
            const messages = await Message.findAll({
                include: [
                    { model: User, as: 'author' },
                    { model: Room, as: 'room' }
                ]
            });
            res.json(messages);
        } catch (error) {
            console.error('Erreur MessagesController.readAll:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async readOne(req, res) {
        try {
            const message = await Message.findByPk(req.params.id, {
                include: [
                    { model: User, as: 'author' },
                    { model: Room, as: 'room' }
                ]
            });
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            res.json(message);
        } catch (error) {
            console.error('Erreur MessagesController.readOne:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { text, userId, roomId } = req.body;
            
            // Créer le message
            const message = await Message.create({ text, userId, roomId });
            
            // Récupérer le message complet avec auteur et salle
            const fullMessage = await Message.findByPk(message.id, {
                include: [
                    { model: User, as: 'author' },
                    { model: Room, as: 'room' }
                ]
            });
            
            console.log('Message créé:', fullMessage.text, 'par', fullMessage.author.name);
            
            // Diffuser via SSE
            EventsController.broadcastMessage({
                id: fullMessage.id,
                text: fullMessage.text,
                date: fullMessage.date,
                author: {
                    id: fullMessage.author.id,
                    name: fullMessage.author.name
                },
                room: {
                    id: fullMessage.room.id,
                    name: fullMessage.room.name
                }
            });
            
            res.json(fullMessage);
            
        } catch (error) {
            console.error('Erreur MessagesController.create:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await Message.destroy({ where: { id: req.params.id } });
            res.json({ message: 'Message deleted' });
        } catch (error) {
            console.error('Erreur MessagesController.delete:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}