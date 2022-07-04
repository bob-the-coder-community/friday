import { User } from "@controllers/user";
import { Google } from "@services/google";
import { LambdaEvent } from "@ts-types/utilities/withMiddleware";
import { JWT } from "@utils/jwt";
import { withMiddleWare } from "@utils/withMiddleware";
import { Context } from "aws-lambda";

const Login = async (event: LambdaEvent, context: Context, response: Function) => withMiddleWare(event, context, async (error: Error) => {
    if (error) {
        return Promise.reject({ statusCode: 500, body: 'Internal Server Error' });
    }

    const link: string = await Google.Oauth.GetLink();
    return Promise.resolve({
        statusCode: 301,
        headers: {
            location: link,
        }
    });
});

const Callback = async (event: LambdaEvent, context: Context, response: Function) => withMiddleWare(event, context, async (error: Error) => {
    if (error) {
        return Promise.reject({ statusCode: 500, body: 'Internal Server Error' });
    }

    const { rawQueryString } = event;
    const code: string = (new URLSearchParams(decodeURI(rawQueryString as string || ''))).get('code') || '';

    if (!code || code === '') {
        return Promise.reject({
            statusCode: 500,
            body: 'Internal Server Error'
        });
    }

    const tokens = await Google.Oauth.GetToken(code);
    const profile = await Google.Oauth.GetProfile(tokens);

    const { _id } = await User.Service.CreateOrUpdate({
        name: {
            first: profile.given_name,
            last: profile.family_name,
        },
        email: profile.email,
        domain: profile.hd,
    });

    const token = await JWT.Sign(_id?.toString() as string);

    return Promise.resolve({
        statusCode: 301,
        headers: {
            'set-cookie': `sid=${token}; expires=${ new Date(Math.floor(Date.now() / 1000) + (60 * 60)) }`,
            'location': process.env.STARK_URL,
        }
    });
})

export {
    Login,
    Callback,
}