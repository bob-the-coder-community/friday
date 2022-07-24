import * as functions from "firebase-functions";
import * as dayjs from "dayjs";
import * as htmlPdf from "html-pdf";
import {withMiddleWare} from "@utils/withMiddleware";
import {AWS} from "@services/aws-ses";
import {Template} from "@services/template";
import {Sanity} from "@services/sanity-client";
import {markdown} from "@services/markdown";

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

const Jira = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    try {
        if (error) {
            return response.status(500).json({message: "Internal Server Error"});
        }

        const {
            fields: {
                customfield_10032: candidateName,
                customfield_10033: candidateEmail,
                customfield_10041: jobId,
            },
        } = request.body;

        const Position = (await Sanity.Query(`*[_type == "position" && jira_job_id == "${jobId}"]`))[0];

        if (!Position) {
            return response.status(400).json({message: "Position Not Found"});
        }

        const document = {
            _type: "invitation",
            candidate_name: candidateName,
            candidate_email: candidateEmail,
            state: "invitation-pending",
            position: [{
                _ref: Position._id,
                _type: "reference",
            }],
            meta: "{}",
        };

        await Sanity.Create(document);
        return response.status(200).json({message: "Success"});
    } catch (err) {
        console.error(err);
        return response.status(200).json({err});
    }
});

const GenerateReport = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    if (error) {
        return response.status(500).json({message: "Internal Server Error"});
    }

    const {testId} = request.body;

    const testInformation = (await Sanity.Query(`*[_type == "invitation" && _id == "${testId}"]`))[0];
    const positionInformation = (await Sanity.Query(`*[_type == "position" && _id == "${testInformation.position[0]._ref}"]`))[0];
    const problems = (await Sanity.Query(`*[_type == "problem" && (${
        positionInformation.problems.map((problem: { _ref: any; }) => `_id == "${problem._ref}"`).join("||")
    })]`));

    const meta: any = JSON.parse(testInformation.meta);

    const data = {
        candidate: {
            name: testInformation.candidate_name,
            email: testInformation.candidate_email,
        },
        position: {
            title: positionInformation.title,
            company: positionInformation.company,
            jiraLink: `https://bobthecompany.atlassian.net/browse/${ positionInformation.jira_job_id }`,
        },
        timestamps: {
            invitation: dayjs(testInformation._createdAt).format("hh:mm a, DD MMM YYYY"),
            start: dayjs.unix(meta.startTime / 1000).format("hh:mm a, DD MMM YYYY"),
            end: dayjs().format("hh:mm a, DD MMM YYYY"),
            duration: dayjs().diff(dayjs.unix(meta.startTime / 1000), "minutes"),
        },
        activities: [],
        codes: problems.map((problem) => ({
            readme: markdown.parse(problem.problem),
            code: markdown.parse("```" + meta.editor_cache.find((solution: any) => solution.problem_id === problem._id).source_code + "```"),
        })),
    };

    const html = await Template.Render(data, "report/test-report.ejs");
    const fileName = `/tmp/${testId}-${Date.now()}.pdf`;

    return htmlPdf.create(html, {
        format: "A4",
    }).toFile(fileName, async (err) => {
        if (err) {
            return response.status(500).json({message: "Internal Server Error"});
        }

        await AWS.SES.Send(
            process.env.FROM_ADDRESS as string,
            process.env.TO_ADDRESS as string,
            `bobTheCoder: Test Platform - Report - ${ data.candidate.name } - ${ data.position.company }`,
            "",
            [],
            fileName,
        );

        return response.status(200).send({message: "Success"});
    });
});

export const testPlatform = {
    "invite": functions.https.onRequest(Invite),
    "jiraautomation": functions.https.onRequest(Jira),
    "generatereport": functions.https.onRequest(GenerateReport),
};
