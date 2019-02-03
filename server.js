import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import io from 'socket.io';
import socketIoCookie from 'socket.io-cookie';

import { port } from './src/config/config.json';
import routes from './src/routes';
import services from './src/services';
import socketAuthMiddleware from './src/middlewares/socketAuthMiddleware';

const app = express();
const server = http.createServer(app);
const socketServer = io(server);

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/users', routes.userRouter);
app.use('/api/rooms', routes.roomRouter);
app.use('/api/messages', routes.messageRouter);

socketServer.use(socketIoCookie);
socketServer.use(socketAuthMiddleware);

services.socketService(socketServer);
services.mongooseService();

server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on ${port}`);
});
