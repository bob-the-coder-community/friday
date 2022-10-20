import {withMiddleWare} from "@utils/withMiddleware";
import * as functions from "firebase-functions";
import {Service} from "@controllers/candidate/candidate.service";

const List = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    try {
        if (error) {
            return response.json({statusCode: 500, body: "Internal Server Error"});
        }

        const {page, limit} = request.query;

        if (!page || !limit) {
            return response.json({statusCode: 400, body: "Page & Limit is missing"});
        }

        const [
            candidates,
            count,
        ] = await Promise.all([
            Service.Find.List(
                parseInt(page as string),
                parseInt(limit as string),
            ),
            Service.Count(),
        ]);

        return response.json({
            statusCode: 200,
            result: {
                data: candidates,
                count, page, limit,
            },
        });
    } catch (err: any) {
        console.error(err);
        return response.json({statusCode: 500, body: "Internal Server Error"});
    }
});

const Profile = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    try {
        if (error) {
            return response.json({statusCode: 500, body: "Internal Server Error"});
        }

        const {candidateId} = request.query;

        if (!candidateId) {
            return response.json({statusCode: 400, body: "Candidate ID is missing"});
        }

        const profile = await Service.Find.One(candidateId as string);

        if (!profile) {
            return response.json({
                statusCode: 404,
                result: {
                    data: null,
                },
            });
        }

        return response.json({
            statusCode: 200,
            result: {
                data: profile,
            },
        });
    } catch (err) {
        console.error(err);
        return response.json({statusCode: 500, body: "Internal Server Error"});
    }
});

export const candidates = {
    "list": functions.https.onRequest(List),
    "profile": functions.https.onRequest(Profile),
};
