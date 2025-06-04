import User from '../models/User.js';

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

    static async create(req, res) {
        try {
            const { name } = req.body;
            const user = await User.create({ name });
            console.log(`👤 Nouvel utilisateur: ${name}`);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            await User.destroy({ where: { id: req.params.id } });
            res.json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}