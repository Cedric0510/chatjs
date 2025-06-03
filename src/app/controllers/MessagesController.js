import Message from "../models/Message.js";

export default class MessagesController {

    static readOne(req, res) {
        res.json(Message.allMessages[req.params.id]);
    }

    static update(req, res) {
        Message.allMessages[req.params.id].setText(req.body.text);
        res.json(Message.allMessages[req.params.id]);
    }

    static delete(req, res) {
        Message.allMessages[req.params.id] = undefined;
        res.json(true);
    }
}
