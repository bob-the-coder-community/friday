import UserModel from "./user.model";
import { Document } from "mongoose";
import { IUser } from "./user.type";

export const Service = {
    CreateOrUpdate: async (user: IUser): Promise<Document<IUser>> => {
        try {
            const new_user = await UserModel.findOneAndUpdate(
                { email: user.email }, 
                { ...user }, 
                { upsert: true, new: true }
            );
            
            return Promise.resolve(new_user);
        } catch (err) {
            return Promise.reject(err);
        }
    },
}