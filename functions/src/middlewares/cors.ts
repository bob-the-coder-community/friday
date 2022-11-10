import * as functions from "firebase-functions";
import {Callback} from "@ts-types/utilities/withMiddleware";

/**
 *
 * @param request Firebase request object
 * @param response Firebase response object
 * @param next Callback to next function
 * @returns Empty
 */
export function cors(
    request: functions.https.Request,
    response: functions.Response,
    next: Callback
) {
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (request.method === "OPTIONS") {
        response.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONSs");
        response.set("Access-Control-Max-Age", "3600");
        response.status(204).send("");
    }

    return next();
}
