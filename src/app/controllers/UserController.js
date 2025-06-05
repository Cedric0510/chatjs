import User from '../models/User.js';
import Room from '../models/Room.js';
import { hashPassword, verifyPassword } from '../utils/auth.js';

export default class UserController {
    
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('Erreur UserController.getAll:', error.message);
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
            console.error('Erreur UserController.getById:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async register(req, res) {
        try {
            const { name, password } = req.body;
            
            const existingUser = await User.findOne({ where: { name } });
            if (existingUser) {
                return res.status(400).json({ error: 'Utilisateur déjà existant' });
            }
            
            const hashedPassword = await hashPassword(password);
            
            const user = await User.create({ 
                name, 
                password: hashedPassword 
            });
            
            console.log('Nouvel utilisateur créé:', user.name);
            res.json({ id: user.id, name: user.name });
            
        } catch (error) {
            console.error('Erreur UserController.register:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { name, password } = req.body;
            
            const user = await User.findOne({ where: { name } });
            if (!user) {
                return res.status(404).json({ error: 'Compte inexistant, inscrivez-vous' });
            }
            
            const isValid = await verifyPassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Mauvais mot de passe' });
            }
            
            console.log('Utilisateur connecté:', user.name);
            res.json({ id: user.id, name: user.name });
            
        } catch (error) {
            console.error('Erreur UserController.login:', error.message);
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
            console.error('Erreur UserController.getMyRooms:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await User.destroy({ where: { id: req.params.id } });
            res.json({ message: 'User deleted' });
        } catch (error) {
            console.error('Erreur UserController.delete:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}