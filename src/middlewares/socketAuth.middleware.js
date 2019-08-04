import { verify } from '../utils/jwt';
import { UNAUTHORIZED } from "../constants/infoMessages.constant";
import { ERROR } from "../constants/socketEvents.constant";

export default async function (socket, next) {
    const { token } = socket.request.headers.cookie;

    try {
        socket.tokenData = await verify(token);
        next();
    } catch (error) {
        socket.emit(ERROR, { info: UNAUTHORIZED });
    }
}
