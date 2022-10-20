import mongoose, {Document, Schema} from "mongoose";
import {ICandidate} from "./candidate.type";

const model: Schema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        first: {
            type: String,
            required: true,
        },
        last: {
            type: String,
            required: true,
        },
    },
    bio: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    contact: {
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    skills: [{
        type: String,
        required: true,
    }],
    education: {
        highest: {
            type: String,
            required: true,
        },
        institutions: [{
            name: {
                type: String,
                required: true,
            },
            major: {
                type: String,
                required: true,
            },
            degree: {
                type: String,
                required: true,
            },
            start: {
                type: String,
                required: true,
            },
            end: {
                type: String,
                required: true,
            },
        }],
    },
    experience: {
        current: {
            company: {
                type: String,
                required: true,
            },
            designation: {
                type: String,
                required: true,
            },
        },
        companies: [{
            name: {
                type: String,
                required: true,
            },
            designation: {
                type: String,
                required: true,
            },
            start: {
                type: String,
                required: true,
            },
            end: {
                type: String,
                required: true,
            },
            isPresent: {
                type: Boolean,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        }],
        total: {
            type: Number,
            required: true,
        },
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});


export default (mongoose.models["candidates"] || mongoose.model("candidates", model) as unknown) as unknown as Document<ICandidate>;
