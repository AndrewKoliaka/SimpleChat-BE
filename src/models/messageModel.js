import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    roomId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Message', messageSchema);
