import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './config/chat.db',
  logging: false 
});

export default sequelize;