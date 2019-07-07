import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        default: 'room'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Room', roomSchema);
