import * as functions from 'firebase-functions';
import { Callback, Middleware } from "@ts-types/utilities/withMiddleware";
import { connect } from "@services/database/mongodb";

export async function withMiddleWare(request: functions.https.Request, response: functions.Response, ...args: (Middleware | Callback)[]): Promise<void> {
    /** Connect to Database */
    await connect();

    if (args.length === 1) {
        return ((response) => (args[0] as Callback)(response))();
    }

    (args[0])(request, response, () => {
        args.splice(0, 1);
        return withMiddleWare(request, response, ...args);
    });
}