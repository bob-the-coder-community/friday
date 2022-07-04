import mongoose, { Schema } from 'mongoose';

const user_schema = new Schema({
    name: {
        first: {
            type: String,
            required: true,
            trim: true,
        },
        last: {
            type: String,
            require: true,
            trim: true,
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    domain: {
        type: String,
        required: true,
        default: 'bobthecoder.org',
        trim: true
    }
}, {
    timestamps: true,
});

export default mongoose.models['users'] || mongoose.model('users', user_schema);