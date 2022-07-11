import mongoose, {Schema} from "mongoose";

const stateSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    redirectUrl: {
        type: String,
        requrired: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models["auth-states"] || mongoose.model("auth-states", stateSchema);
