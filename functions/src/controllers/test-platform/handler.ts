import * as functions from "firebase-functions";
import {withMiddleWare} from "@utils/withMiddleware";
import {AWS} from "@services/aws-ses";
import {Template} from "@services/template";
import {Sanity} from "@services/sanity-client";

const Invite = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    if (error) {
        return response.status(500).json({message: "Internal Server Error"});
    }

    const {
        _id,
        position,
        candidate_email: candidateEmail,
        candidate_name: candidateName,
    } = request.body;

    const Position = (await Sanity.Query(`*[_type == "position" && _id == "${position[0]._ref}"]`))[0];
    const options = {
        tid: _id,
        name: candidateName,
        position: {
            title: Position.title,
            company: Position.company,
            website: Position.website,
        },
    };

    const template = await Template.Render(options, "email/test-invitation.ejs");
    await AWS.SES.Send(
        process.env.FROM_ADDRESS as string,
        candidateEmail,
        `Invitation: ${ options.position.title } at ${ options.position.company }`,
        template,
    );

    return response.status(200).json({message: "success"});
});

export const testPlatform = {
    "invite": functions.https.onRequest(Invite),
};