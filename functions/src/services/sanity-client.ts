import * as sanityClient from "@sanity/client";
import * as dayjs from "dayjs";
import { v4 } from "uuid";

// @ts-ignore
const client = new sanityClient({
    projectId: "qutmmqvp",
    dataset: "production",
    apiVersion: dayjs().format("YYYY-MM-DD"),
    token: process.env.SANITY_API_KEY,
    useCdn: false,
});

const Sanity = {
    Query: async (query: string): Promise<any[]> => {
        try {
            const result = await client.fetch(query, {});
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    Patch: async (id: string, value: any) => {
        try {
            const result = await client.patch(id).set({...value}).commit();
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    Create: async (data: any): Promise<string> => {
        try {
            const document = await client.create({
                _id: v4(),
                ...data
            });
            return Promise.resolve(document);
        } catch (err) {
            return Promise.reject(err);
        }
    }
};

export {
    Sanity,
};
