import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
let isConnected: boolean = false;

const connect = async () => {
    try {
        if (isConnected) {
            return Promise.resolve();
        }

        await mongoose.connect(process.env.MONGO_URI as string);
        return Promise.resolve();      
    } catch (err) {
        return Promise.reject(err);
    }
}

export {
    connect,
}