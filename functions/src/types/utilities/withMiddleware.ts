import * as functions from "firebase-functions";

export type Callback = (param?: any) => void;
export type Middleware = (request: functions.https.Request, response: functions.Response, next: () => void) => void
