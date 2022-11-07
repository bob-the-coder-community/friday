import mongoose, {Document, Schema} from "mongoose";
import {IRunner} from "./runner.type";

const model: Schema = new Schema({
    job_id: {
        type: String,
        required: true,
    },
    timestamps: {
        start: {
            type: Date,
            required: true,
            default: new Date(),
        },
        end: {
            type: Date,
            required: Date,
            default: new Date(),
        },
    },
    totalCandidates: {
        type: Number,
        required: true,
        default: 0,
    },
});

export default (mongoose.models["runners"] || mongoose.model("runners", model) as unknown) as unknown as Document<IRunner>;
