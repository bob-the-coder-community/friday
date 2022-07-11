import {v4} from "uuid";
import StateModel from "./state.model";
import {IState} from "./state.type";

export const Service = {
    Create: async (redirectUrl: string): Promise<string> => {
        try {
            const uuid: string = v4();
            await StateModel.create({
                uuid,
                redirectUrl,
            });

            return Promise.resolve(uuid);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    Find: async (uuid: string): Promise<IState> => {
        try {
            const document = await StateModel.findOne({uuid});
            return Promise.resolve(document);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
