import { sign } from 'jsonwebtoken';

export const JWT = {
    Sign: async (userId: string): Promise<string> => {
        try {
            const token = sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: {
                    userId
                }
            }, process.env.JWT_SECRET_KEY);

            return Promise.resolve(token);
        } catch (err) {
            return Promise.reject(err);
        }
    } 
}