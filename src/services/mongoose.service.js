import mongoose from 'mongoose';
import { db } from '../config/config.json';

export default function () {
    const options = { useNewUrlParser: true };

    mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`, options);
}
