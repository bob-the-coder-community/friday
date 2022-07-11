import {User} from "@controllers/user";
import {Google} from "@services/google";
import {JWT} from "@utils/jwt";
import {withMiddleWare} from "@utils/withMiddleware";
import * as functions from "firebase-functions";
import { Service } from '@controllers/authentication/state.service';
import { IState } from "./state.type";

const Login = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    if (error) {
        return response.json({statusCode: 500, body: "Internal Server Error"});
    }

    const { redirectUrl } = request.query;

    const state: string = await Service.Create((redirectUrl || process.env.STARK_URL) as string);
    const link: string = await Google.Oauth.GetLink(state);
    return response.redirect(link);
});

const Callback = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    if (error) {
        return response.json({statusCode: 500, body: "Internal Server Error"});
    }

    const {query} = request;
    const code: string = query.code as string || "";
    const uuid: string = query.state as string || "";

    if (!code || code === "") {
        return response.json({
            statusCode: 500,
            body: "Internal Server Error",
        });
    }

    const tokens = await Google.Oauth.GetToken(code);
    const profile = await Google.Oauth.GetProfile(tokens);

    const {_id} = await User.Service.CreateOrUpdate({
        name: {
            first: profile.given_name,
            last: profile.family_name,
        },
        email: profile.email,
        domain: profile.hd,
    });

    const token = await JWT.Sign(_id?.toString() as string);
    const state: IState = await Service.Find(uuid as string);

    response.setHeader("set-cookie", `sid=${token}; expires=${ new Date(Math.floor(Date.now() / 1000) + (60 * 60)) }`);
    return response.redirect(state.redirectUrl as string);
});

const Profile = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    try {
        if (error) {
            response.status(500);
            return response.json({statusCode: 500, body: "Internal Server Error"});
        }

        const {headers} = request;

        if (!headers.authorization) {
            response.status(401);
            return response.json({statusCode: 401, body: "Token is missing"});
        }

        const payload = await JWT.Verify(headers.authorization);
        response.status(200);
        return response.json({statusCode: 200, body: `${JSON.stringify(payload)}`});
    } catch (err) {
        console.error(err);
        response.status(401);
        return response.json({statusCode: 401, body: "Token is missing"});
    }
});

export const authentication = {
    "login": functions.https.onRequest(Login),
    "callback": functions.https.onRequest(Callback),
    "profile": functions.https.onRequest(Profile),
};
