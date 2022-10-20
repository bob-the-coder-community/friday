import { ICandidate } from "./candidate.type";
import CandidateModel from "./candidate.model";

export const Service = {
    Insert: {
        Bulk: async (items: ICandidate[]): Promise<string[]> => {
            try {
                await CandidateModel.collection.bulkWrite(items.map((item) => {
                    return {
                        updateOne: {
                            filter: {
                                'uid': item.uid,
                            },
                            update: {
                                $set: {
                                    ...item,
                                }
                            },
                            upsert: true,
                        }
                    }
                }));

                return Promise.resolve([]);
            } catch (err) {
                return Promise.reject(err);
            }
        }
    },
    Update: {}
}