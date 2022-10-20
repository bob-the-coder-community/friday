import {ICandidate} from "./candidate.type";
import CandidateModel from "./candidate.model";
import {Types} from "mongoose";

export const Service = {
    Insert: {
        Bulk: async (items: ICandidate[]): Promise<string[]> => {
            try {
                await CandidateModel.collection.bulkWrite(items.map((item) => {
                    return {
                        updateOne: {
                            filter: {
                                "uid": item.uid,
                            },
                            update: {
                                $set: {
                                    ...item,
                                },
                            },
                            upsert: true,
                        },
                    };
                }));

                return Promise.resolve([]);
            } catch (err) {
                return Promise.reject(err);
            }
        },
    },
    Update: {},
    Find: {
        List: async (page = 1, limit = 10): Promise<ICandidate[]> => {
            try {
                const list =
                (
                    await CandidateModel.collection
                        .find({})
                        .sort("updated_at", -1)
                        .limit(limit)
                        .skip((page - 1) * limit)
                        .toArray()
                ) as unknown as ICandidate[];

                return Promise.resolve(list);
            } catch (err) {
                return Promise.reject(err);
            }
        },
        One: async (candidateId: string): Promise<ICandidate> => {
            try {
                const profile = (await CandidateModel.collection.findOne({_id: new Types.ObjectId(candidateId)})) as unknown as ICandidate;
                return Promise.resolve(profile);
            } catch (err) {
                return Promise.reject(err);
            }
        },
    },
    Count: async (): Promise<number> => {
        try {
            const count = (await CandidateModel.collection.estimatedDocumentCount());
            return Promise.resolve(count);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
