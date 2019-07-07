import Message from '../models/message.model';
import {
    CONNECT,
    DISCONNECT,
    MESSAGE_IS_TYPING,
    MESSAGE
} from '../constants/socketEvents';

const liveClients = [];

async function onMessage (data, cb) {
    const { roomId, text } = data;
    const { name } = this.tokenData;
    const userId = this.tokenData.id;

    try {
        const createdMessage = await Message.create({ roomId, userId, text });
        const eventData = {
            _id: createdMessage._id,
            user: {
                _id: userId,
                name
            },
            roomId,
            text
        };

        liveClients.forEach(client => client.emit(MESSAGE, eventData));
        if (typeof cb === 'function') cb();
    } catch (error) {
        throw new Error(error);
    }
}

async function onDisconnect (socket) {
    const disconnectedClientIndex = liveClients.indexOf(socket);

    liveClients.splice(disconnectedClientIndex, 1);
}

function onConnect (socket) {
    liveClients.push(socket);

    socket.on(DISCONNECT, onDisconnect);
    socket.on(MESSAGE, onMessage);
    socket.on(MESSAGE_IS_TYPING, onTypeMessage);
}

function onTypeMessage (data, cb) {
    const { name } = this.tokenData;

    this.broadcast.emit(MESSAGE_IS_TYPING, { message: data, name });

    if (typeof cb === 'function') cb();
}

export default function (server) {
    server.on(CONNECT, onConnect);
}
