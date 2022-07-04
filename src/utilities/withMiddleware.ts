import { Context } from "aws-lambda";
import { Callback, LambdaEvent, Middleware } from "@ts-types/utilities/withMiddleware";
import { connect } from "@services/database/mongodb";

export async function withMiddleWare(event: LambdaEvent, context: Context, ...args: (Middleware | Callback)[]): Promise<void> {
    /** Connect to Database */
    await connect();

    if (args.length === 1) {
        return ((response) => (args[0] as Callback)(response))();
    }

    (args[0])(event, args[args.length - 1], () => {
        args.splice(0, 1);
        return withMiddleWare(event, context, ...args);
    }, context);
}