import * as functions from "firebase-functions";
import * as dayjs from "dayjs";
import * as fs from "fs";
// import * as htmlPdf from "html-pdf";
import {withMiddleWare} from "@utils/withMiddleware";
import {AWS} from "@services/aws-ses";
import {Template} from "@services/template";
import {Sanity} from "@services/sanity-client";
import {markdown} from "@services/markdown";
import {v4} from "uuid";
import {Judge0} from "@services/judge0";

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
        `Invitation: ${options.position.title} at ${options.position.company}`,
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
            job_id: jobId,
            candidate_name: candidateName,
            candidate_email: candidateEmail,
        } = request.query;

        const Position = (await Sanity.Query(`*[_type == "position" && jira_job_id == "${decodeURI(jobId as string)}"]`))[0];

        if (!Position) {
            return response.status(400).json({message: "Position Not Found"});
        }

        const document = {
            _type: "invitation",
            candidate_name: decodeURI(candidateName as string),
            candidate_email: decodeURI(candidateEmail as string),
            state: "invitation-sent",
            position: [{
                _key: v4(),
                _ref: Position._id,
                _type: "reference",
            }],
            meta: "{}",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
        };

        const tid = await Sanity.Create(document);
        const options = {
            tid,
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
            candidateEmail as string,
            `Invitation: ${options.position.title} at ${options.position.company}`,
            template,
        );

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

    const testId = request.body.testId || request.query.testId;
    const {inHtml} = request.query;

    const testInformation = (await Sanity.Query(`*[_type == "invitation" && _id == "${testId}"]`))[0];
    const positionInformation = (await Sanity.Query(`*[_type == "position" && _id == "${testInformation.position[0]._ref}"]`))[0];
    const problems = (
        await Sanity.Query(`*[_type == "problem" && (${
            positionInformation.problems.map((problem: { _ref: any; }) => `_id == "${problem._ref}"`).join("||")
        })]`));

    const meta: any = JSON.parse(testInformation.meta);
    const endTime: number = (meta.lastSync || Date.now()) / 1000;

    const data = {
        tid: testId,
        candidate: {
            name: testInformation.candidate_name,
            email: testInformation.candidate_email,
        },
        position: {
            title: positionInformation.title,
            company: positionInformation.company,
            jiraLink: `https://bobthecompany.atlassian.net/browse/${positionInformation.jira_job_id}`,
        },
        timestamps: {
            invitation: dayjs(testInformation._createdAt).add(330, 'minutes').format("hh:mm a, DD MMM YYYY"),
            start: dayjs.unix(meta.startTime / 1000).add(330, 'minutes').format("hh:mm a, DD MMM YYYY"),
            end: dayjs.unix(endTime).add(330, 'minutes').format("hh:mm a, DD MMM YYYY"),
            duration: dayjs.unix(endTime).diff(dayjs.unix(meta.startTime / 1000), "minutes"),
        },
        activities: [],
        codes: problems.map((problem) => ({
            problemId: problem._id,
            readme: markdown.parse(problem.problem),
            code: markdown.parse(meta.editor_cache.find((solution: any) => solution.problem_id === problem._id).source_code),
            hiddenTests: problem.hidden_test,
            expectedOutput: problem.expected_output,
            languageId: problem.language_id,
        })),
    };

    const executions = await Promise.all(
        data.codes.map((code) =>
            Judge0.Evaluate(
                code.problemId,
                code.languageId,
                meta.editor_cache.find((solution: any) => solution.problem_id === code.problemId).source_code, code.hiddenTests,
                code.expectedOutput
            )
        ),
    );

    data.codes = data.codes.map((code) => ({
        ...code,
        expectedOutput: markdown.parse(code.expectedOutput),
        pass: executions.find((item) => item.problem_id === code.problemId)?.pass ? "✅ Pass" : "⚠️ Failed",
        stdout: markdown.parse(executions.find((item) => item.problem_id === code.problemId)?.stdout),
    }));

    const report = await Template.Render(data, "report/test-report.ejs");
    const email = await Template.Render(data, "email/test-completion.ejs");
    const fileName = `/tmp/${testId}-${Date.now()}.html`;

    fs.writeFileSync(fileName, report);

    if (inHtml) {
        response.status(200).write(report);
        return response.end();
    }

    await AWS.SES.Send(
        process.env.FROM_ADDRESS as string,
        process.env.TO_ADDRESS as string,
        `bobTheCoder: Test Platform - Report - ${data.candidate.name} - ${data.position.company}`,
        email,
        [],
        fileName,
    );

    return response.status(200).send({message: "Success"});
});

export const testPlatform = {
    "invite": functions.https.onRequest(Invite),
    "jiraautomation": functions.https.onRequest(Jira),
    "generatereport": functions.https.onRequest(GenerateReport),
};
