import { answerObject } from '../Helpers/utils.js';
import Messages from '../Models/Messages.js'
import Users from '../Models/Users.js';

const findSenderById = async (req, res, next, id) => {
    try {
        const sender = await Users.findById({ _id: id });
        if (!sender) {
            return res.status(400).json(answerObject('error', 'Sender not found'));
        }
        req.sender = sender;
        next();
    }catch(err){
        return res.status(500).json(answerObject('error', 'Internal server error'));
    }
}
const findReceiverById = async (req, res, next, id) => {
    try {
        const receiver = await Users.findById({ _id: id });
        if (!receiver) {
            return res.status(400).json(answerObject('error', 'reciever not found'));
        }
        req.receiver = receiver;
        next();
    }catch(err){
        return res.status(500).json(answerObject('error', 'Internal server error'));
    }
}

const getMessages = async (req, res) => {
    try {
        console.log(req.sender._id, req.receiver._id);
        const { sender, receiver } = req;
        const messages = await Messages.find({ $or: [{ sender, receiver }, { sender: receiver, receiver: sender }] }).populate('sender').populate('receiver');
        return res.status(200).json(answerObject('success', 'Messages fetched successfully', messages));
    }catch(err){
        return res.status(500).json(answerObject('error', 'Internal server error'));
    }
}

const create = async (req, res) => {
    try {
        const { sender, receiver } = req;
        let message = await Messages.create(req.body)
        message = await Messages.findOne({ _id: message._id }).populate('sender').populate('receiver')
        return res.status(200).json(answerObject('success', 'Message created successfully', message));
    }catch(err){
        console.log(err.message)
        return res.status(500).json(answerObject('error', 'Internal server error '+err.message));
    }
}

export { findSenderById, findReceiverById, getMessages, create }