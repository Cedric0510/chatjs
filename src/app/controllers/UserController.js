import User from '../models/User.js';
import Room from '../models/Room.js';

export default class UserController {
    
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const user = await User.findByPk(req.params.id); 
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // static async create(req, res) {
    //     try {
    //         const { name } = req.body;
    //         const user = await User.create({ name });
    //         console.log(` Nouvel utilisateur: ${name}`);
    //         res.json(user);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }

    static async delete(req, res) {
        try {
            await User.destroy({ where: { id: req.params.id } });
            res.json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async loginOrCreate(req, res) {
        try {
            const { name } = req.body;
            console.log('DEBUG - Tentative login/create pour:', name);
            
            let user = await User.findOne({ where: { name } });
            
            if (user) {
                console.log('LOGIN - Utilisateur trouvé:', user.name);
                res.json(user);
            } else {
                user = await User.create({ name });
                console.log('CREATE - Nouvel utilisateur:', user.name);
                res.json(user);
            }
            
        } catch (error) {
            console.error('ERROR UserController.loginOrCreate:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async getMyRooms(req, res) {
        try {
            const userId = req.params.id;
            
            const user = await User.findByPk(userId, {
                include: [{
                    model: Room,
                    as: 'joinedRooms'
                }]
            });
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const roomNames = user.joinedRooms.map(room => room.name);
            console.log('Salles de', user.name, ':', roomNames);
            res.json(roomNames);
            
        } catch (error) {
            console.error('ERROR UserController.getMyRooms:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}