import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false 
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW 
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false 
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false 
  }
});

export default Message;