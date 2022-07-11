import * as functions from "firebase-functions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback = (param?: any) => void;
export type Middleware = (request: functions.https.Request, response: functions.Response, next: () => void) => void
