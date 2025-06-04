import Room from '../models/Room.js'; 

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
            const room = await Room.findOne({ where: { name: req.params.id } }); 
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            res.json({
                name: room.name,
                messages: [] 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addMessage(req, res) {
        // plus tard
        res.json({ message: 'Not implemented yet' });
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
