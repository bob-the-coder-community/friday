import { Google } from "@services/google";
import { LambdaEvent } from "@ts-types/utilities/withMiddleware";
import { withMiddleWare } from "@utils/withMiddleware";
import { Context } from "aws-lambda";

const Login = (event: LambdaEvent, context: Context, response: Function) => withMiddleWare(event, context, async (error: Error) => {
    if (error) {
        return response({ statusCode: 500, body: 'Internal Server Error' });
    }

    const link: string = await Google.Oauth.GetLink();
    return response(null, {
        statusCode: 301,
        headers: {
            location: link,
        }
    });
});

const Callback = (event: LambdaEvent, context: Context, response: Function) => withMiddleWare(event, context, async (error: Error) => {
    if (error) {
        return response({ statusCode: 500, body: 'Internal Server Error' });
    }

    const { rawQueryString } = event;
    const code: string = (new URLSearchParams(decodeURI(rawQueryString as string || ''))).get('code') || '';

    if (!code || code === '') {
        return response({
            statusCode: 500,
            body: 'Internal Server Error'
        });
    }

    const tokens = await Google.Oauth.GetToken(code);
    const profile = await Google.Oauth.GetProfile(tokens);

    return response(null, {
        statusCode: 200,
        body: JSON.stringify(profile),
    });
})

export {
    Login,
    Callback,
}