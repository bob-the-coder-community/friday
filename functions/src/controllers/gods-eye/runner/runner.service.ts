import {ObjectId} from "mongoose";
import RunnerModel from "./runner.model";
import {IRunner} from "./runner.type";

export const Runner = {
    Init: async (jobId: string): Promise<ObjectId> => {
        try {
            const document: IRunner = {
                job_id: jobId,
                timestamps: {
                    start: new Date(),
                    end: new Date(),
                },
                totalCandidates: 0,
            };

            const object = await RunnerModel.collection.insertOne(document);
            return Promise.resolve(object.insertedId as unknown as ObjectId);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    Finish: async (_id: ObjectId, totalCandidates: number): Promise<boolean> => {
        try {
            const updatedDocument = {
                $set: {
                    "timestamps.end": new Date(),
                    totalCandidates,
                },
            };

            await RunnerModel.collection.updateOne({_id}, {...updatedDocument});
            return Promise.resolve(true);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    List: async (): Promise<IRunner[]> => {
        try {
            const list = (
                await RunnerModel.collection.find({}).toArray()
            ) as unknown as IRunner[];

            return Promise.resolve(list);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};
