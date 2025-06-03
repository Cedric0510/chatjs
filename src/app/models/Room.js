import Message from "./Message.js";

class Room {
  
    static allRooms = {}

    constructor(name) {
        this.messages = [];
        this.name = name;
    }

    getMessages() {
        return this.messages.map(id => Message.allMessages[id]);
    }
}

export default Room;
