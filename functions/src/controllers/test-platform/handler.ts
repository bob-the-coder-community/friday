import * as functions from "firebase-functions";
import { withMiddleWare } from "@utils/withMiddleware";
import { AWS } from '@services/aws-ses';
import { Template } from "@services/template";

const Invite = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    if (error) {
        return response.status(500).json({ message: 'Internal Server Error' });
    }

    const { candidate_email } = request.body;
    const template = await Template.Render({}, 'email/test-invitation.ejs');

    await AWS.SES.Send(
        process.env.FROM_ADDRESS as string,
        candidate_email,
        'Invitation to attempt Test - Template',
        template,
    );

    return response.status(200).json({ message: template });
});

export const test_platform = {
    'invite': functions.https.onRequest(Invite),
}