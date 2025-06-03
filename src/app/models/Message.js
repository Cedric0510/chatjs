class Message {

    static allMessages = []

    constructor(author, text, room) {
        this.text = text;
        this.author = author;
        this.date = new Date();
        this.updated = this.date;
        this.room = room;
    }
    
    setText(text) {
        this.text = text;
        this.updated = new Date();
    }
}

export default Message;
