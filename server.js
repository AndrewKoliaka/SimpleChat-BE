import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import io from 'socket.io';
import socketIoCookie from 'socket.io-cookie';

import { port } from './src/config/config.json';
import userRouter from './src/routes/userRouter';
import roomRouter from './src/routes/roomRouter';
import messageRouter from './src/routes/messageRouter';
import socketService from './src/services/socketService';
import mongooseService from './src/services/mongooseService';
import socketAuthMiddleware from './src/middlewares/socketAuthMiddleware';

const app = express();
const server = http.createServer(app);
const socketServer = io(server);

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/messages', messageRouter);

socketServer.use(socketIoCookie);
socketServer.use(socketAuthMiddleware);

socketService(socketServer);
mongooseService();

server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on ${port}`);
});
