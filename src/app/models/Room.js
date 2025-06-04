import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const Room = sequelize.define('Room', { //création de la table
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

export default Room;