import {sign, verify} from "jsonwebtoken";

export const JWT = {
    Sign: async (userId: string): Promise<string> => {
        try {
            const token = sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: {
                    userId,
                },
            }, process.env.JWT_SECRET_KEY as string);

            return Promise.resolve(token);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    Verify: async (token: string): Promise<string> => new Promise((resolve, reject) => {
        verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
            if (err) {
                return reject(err);
            }

            if (!decoded) {
                return reject(new Error("Unable to decoded"));
            }

            return resolve(decoded as string);
        });
    }),
};
