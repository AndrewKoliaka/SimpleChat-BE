import Message from '../models/message.model';

export async function updateMessage (req, res) {
    const { roomId, text, timestamp = Date.now() } = req.body;
    const { id } = req.params;
    const userId = req.tokenData.id;

    try {
        await Message.updateOne({ _id: id }, { userId, roomId, text, timestamp });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteMessage (req, res) {
    const { id } = req.params;

    try {
        await Message.deleteOne({ _id: id });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error);
    }
}
