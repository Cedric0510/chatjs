import express from 'express';
import routes from './app/routes/index.js';
import sequelize from '../config/database.js';
import User from './app/models/User.js';
import Room from './app/models/Room.js';
import Message from './app/models/Message.js';
import { setupAssociations } from './app/models/associations.js';

const app = express();

const roomPresence = {};

function addUserToRoom(userName, roomName) {
  if (!roomPresence[roomName]) {
    roomPresence[roomName] = [];
  }
  
  removeUserFromAllRooms(userName);
  
  if (!roomPresence[roomName].includes(userName)) {
    roomPresence[roomName].push(userName);
    console.log(`${userName} est maintenant dans ${roomName}`);
    console.log('Présence actuelle:', roomPresence);
  }
}

function removeUserFromAllRooms(userName) {
  for (const roomName in roomPresence) {
    const index = roomPresence[roomName].indexOf(userName);
    if (index > -1) {
      roomPresence[roomName].splice(index, 1);
      console.log(`${userName} a quitté ${roomName}`);
    }
  }
}

function getUsersInRoom(roomName) {
  return roomPresence[roomName] || [];
}

global.roomPresence = {
  addUserToRoom,
  removeUserFromAllRooms,
  getUsersInRoom
};

app.use(express.json());
app.use(express.static('public'));
app.use('/api', routes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('BDD connectée');
    
    setupAssociations();
    
    await sequelize.sync();
    console.log('Tables créées');
    
    app.listen(port, () => {
      console.log("Listening on port : " + port);
    });
  } catch (error) {
    console.error('Erreur BDD:', error);
  }
}

startServer();
