import User from './User.js';
import Room from './Room.js';
import Message from './Message.js';

export function setupAssociations() {
  
  // 1. User → Messages (1:N)
  User.hasMany(Message, {
    foreignKey: 'userId', 
    as: 'messages' 
  });
  Message.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author' 
  });

  // 2. Room → Messages (1:N)
  Room.hasMany(Message, {
    foreignKey: 'roomId',
    as: 'messages'
  });
  Message.belongsTo(Room, {
    foreignKey: 'roomId',
    as: 'room'
  });

  // 3. User ↔ Room (N:N) - Table automatique
  User.belongsToMany(Room, {
    through: 'UserRooms',
    as: 'joinedRooms',
  });
  Room.belongsToMany(User, {
    through: 'UserRooms',
    as: 'members',
  });
}