import Room from "../models/Room.js";
import Message from '../models/Message.js';

export default class RoomsController {
    static readAll(req, res) {
        res.json(Object.keys(Room.allRooms));
    }

    static create(req, res) {
        const room = new Room(req.body.name);
        Room.allRooms[req.body.name] = room;
        res.json(room);
    }

    static readOne(req, res) {
        const room = Room.allRooms[req.params.id];
        res.json({
            name: room?.name,
            messages: room?.getMessages()
        });
    }

    static addMessage(req, res) {
        if (Room.allRooms[req.params.id]) {
            const message = new Message(req.body.author, req.body.text, req.params.id);
            const room = Room.allRooms[req.params.id];
            Message.allMessages.push(message);
            room.messages.push(Message.allMessages.length - 1);
            res.json(message);
        }
        else {
            res.json(false);
        }
    }
    
    static delete(req, res) {
        Room.allRooms[req.params.id] = undefined;
        res.json(true);
    }
}
