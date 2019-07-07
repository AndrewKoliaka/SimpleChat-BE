import jwt from 'jsonwebtoken';
import { jwtKey } from '../config/config.json';

export async function sign (data, expiration = '1d') {
    try {
        return await jwt.sign(data, jwtKey, { expiresIn: expiration });
    } catch (error) {
        throw new Error(error);
    }
};

export async function verify (token) {
    try {
        return await jwt.verify(token, jwtKey);
    } catch (error) {
        throw new Error(error);
    }
};

export function decode (token) {
    return jwt.decode(token, { complete: true });
};
