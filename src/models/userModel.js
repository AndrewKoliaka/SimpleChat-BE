import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        default: 'user'
    },
    avatar: {
        type: String,
        data: Buffer
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    banList: [{
        type: Schema.Types.ObjectId
    }]
});

export default mongoose.model('User', userSchema);
