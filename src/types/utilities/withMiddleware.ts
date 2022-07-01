import { Context } from "aws-lambda";

export type Callback = (param?: any) => void;
export type Middleware = (event: LambdaEvent, response: any, next: any, context: Context) => void
export type HttpVerbs = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type LambdaEvent<TBody = {}> = {
    headers: {
        [key: string]: string;
    };
    body: TBody;
    requestContext: {
        http: {
            method: HttpVerbs;
        };
    };
    pathParameters?: {
        [key: string]: string;
    }
};