import Room from '../models/Room.js'; 
import Message from '../models/Message.js';
import User from '../models/User.js';

export default class RoomsController {
    
    static async readAll(req, res) {
        try {
            const rooms = await Room.findAll(); 
            const roomNames = rooms.map(room => room.name); 
            res.json(roomNames);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const room = await Room.create({ name: req.body.name }); 
            res.json(room);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async readOne(req, res) {
        try {
            const room = await Room.findOne({ 
                where: { name: req.params.id },
                include: [{
                    model: Message,
                    as: 'messages',
                    include: [{ model: User, as: 'author' }] // avec auteurs
                }]
            });
            
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            
            res.json({
                id: room.id, 
                name: room.name,
                messages: room.messages || []
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addMessage(req, res) {
        // plus tard
        res.json({ message: 'Not implemented yet' });
    }
    
    static async joinRoom(req, res) {
        try {
            const { userId } = req.body;
            const roomName = req.params.id;
            
            console.log(`${userId} tente de rejoindre ${roomName}`);
            
            const room = await Room.findOne({ where: { name: roomName } });
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            await user.addJoinedRooms(room); // Sequelize
            
            console.log(`${user.name} a rejoint ${room.name}`);
            res.json({ message: 'Room joined successfully' });
            
        } catch (error) {
            console.error('RoomsController.joinRoom:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await Room.destroy({ where: { name: req.params.id } }); 
            res.json(true);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
