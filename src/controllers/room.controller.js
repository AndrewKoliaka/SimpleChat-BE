import { Types } from 'mongoose';
import Room from '../models/room.model';
import Message from '../models/message.model';

const ObjectId = Types.ObjectId;

export async function getRoomsList (req, res) {
    const { id } = req.tokenData;

    try {
        const userRooms = await Room.find({ participants: id });

        res.status(200).json({ data: userRooms });
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getRoom (req, res) {
    const { id } = req.params;

    try {
        const roomData = await Room.findOne({ _id: id })
            .populate('participants', ['name', 'email']);

        res.status(200).json({ data: roomData });
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createRoom (req, res) {
    const { name, participants } = req.body;
    const { id } = req.tokenData;

    try {
        const roomData = {
            name,
            participants: participants.map(id => ObjectId(id)),
            adminId: id
        };
        const createdRoom = await Room.create(roomData);

        res.status(200).json({ data: createdRoom });
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function updateRoom (req, res) {
    const { name, participants } = req.body;
    const { id } = req.params;

    try {
        await Room.updateOne({ _id: id }, { name, participants });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteRoom (req, res) {
    const { id } = req.params;

    try {
        await Room.deleteOne({ _id: id });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getHistory (req, res) {
    const { id } = req.params;

    try {
        const messages = await Message.find({ roomId: id })
            .populate('userId', ['name']);

        const data = messages.map(msgItem => ({
            _id: msgItem._id,
            roomId: msgItem.roomId,
            text: msgItem.text,
            timestamp: msgItem.timestamp,
            user: msgItem.userId
        }));

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function addParticipant (req, res) {
    const roomId = req.params.id;
    const participantId = req.body.id;

    try {
        await Room.updateOne({ _id: roomId }, { $push: { participants: ObjectId(participantId) } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function leaveRoom (req, res) {
    const roomId = req.params.id;
    const participantId = req.tokenData.id;

    try {
        await Room.updateOne({ _id: roomId }, { $pull: { participants: ObjectId(participantId) } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error);
    }
}
