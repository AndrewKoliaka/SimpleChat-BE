import jwtUtils from '../utils/jwt';

export default async function (socket, next) {
    const { token } = socket.request.headers.cookie;

    try {
        socket.tokenData = await jwtUtils.verify(token);
        next();
    } catch (error) {
        socket.emit('error', { info: 'Unauthorized' });
    }
};
