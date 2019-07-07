import { verify } from '../utils/jwt';

export default async function (req, res, next) {
    const { token } = req.cookies;

    try {
        req.tokenData = await verify(token);
        next();
    } catch (error) {
        res.status(401).json({ info: 'Unauthorized' });
    }
};
