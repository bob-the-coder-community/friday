import {withMiddleWare} from "@utils/withMiddleware";
import {Hirect} from "@controllers/gods-eye/services";
import * as functions from "firebase-functions";
import {ICandidate} from "@controllers/candidate/candidate.type";
import {Candidate} from "@controllers/candidate";
import {Runner} from "@controllers/gods-eye/runner";
import {cors} from "@middlewares/cors";
import {chunk} from "lodash";

const sleep = (s: number) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(true);
    }, s * 1000);
});

const Init = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, cors, async (error: Error) => {
    try {
        if (error) {
            return response.json({statusCode: 500, body: "Internal Server Error"});
        }

        const {token, jobId} = request.body;
        const {data: {totalCount, refreshId}} = await Hirect.Get.Bulk(token, jobId as string, 1, 1, "");

        const runnerId = await Runner.Init(jobId);

        const totalCalls = Math.floor((Math.round(totalCount / 10) * 10) / 50);
        const requests: any[] = (new Array(totalCalls > 2 ? 2 : totalCalls).fill(" ")).map((_i, i) => i + 1);

        const results: any[] = [];
        for await (const item of requests) {
            console.log(`Bulk fetching ${item}`);
            results.push(await Hirect.Get.Bulk(token, jobId as string, item, 50, refreshId));
        }


        for await (const item of chunk(results.map((item) => item.data.list).flat(2), 30)) {
            try {
                console.log("Running Batch at", Date.now());
                const candidates: ICandidate[] = await Promise.all(item.map(async (candidate): Promise<ICandidate> => {
                    try {
                        const {data} = await Hirect.Get.Profile(token, candidate.id as string);
                        console.log("Fetched candidate information - ", data.firstName);
                        return Promise.resolve({
                            uid: candidate.id,
                            name: {
                                first: data.firstName,
                                last: data.lastName,
                            },
                            bio: data.advantage,
                            avatar: data.avatar,
                            gender: data.gender,
                            contact: {
                                phone: data.mobile,
                                email: data.email,
                            },
                            birth: {
                                date: data.birthDate,
                                age: data.age,
                            },
                            skills: data.skillTags,
                            education: {
                                highest: data.degree,
                                institutions: data.educations.map((education: any) => ({
                                    name: education.schoolName,
                                    major: education.major,
                                    degree: education.degree,
                                    start: education.startTime,
                                    end: education.endTime,
                                })),
                            },
                            experience: {
                                current: {
                                    company: data.company,
                                    designation: data.designation,
                                },
                                companies: data.experiences.map((company: any) => ({
                                    name: company.companyName,
                                    designation: company.designation,
                                    start: company.startTime,
                                    end: company.endTime,
                                    isPresent: company.isPresent,
                                    description: company.jobContent,
                                })),
                                total: data.workYears,
                            },
                        });
                    } catch (err) {
                        console.error(err);
                        return Promise.reject(err);
                    }
                }));

                console.log("writing candidates information to database");
                await Candidate.Service.Insert.Bulk(candidates);
                console.log("waiting 1 second");
                await sleep(1);
                console.log("Completed a batch");
            } catch (err) {
                console.error(err);
            }
        }

        await Runner.Finish(runnerId, totalCount);
        return response.json({
            status: 200,
            message: {
                totalCount,
            },
        });
    } catch (err) {
        console.error(err);
        return response.json({statusCode: 500, body: "Internal Server Error"});
    }
});


const List = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, cors, async (error: Error) => {
    try {
        if (error) {
            return response.json({statusCode: 500, body: "Internal Server Error"});
        }

        const documents = await Runner.List();
        return response.json({
            status: 200,
            message: {
                data: documents,
                totalCount: documents.length,
            },
        });
    } catch (err) {
        return response.json({statusCode: 500, body: "Internal Server Error"});
    }
});

export const godseye = {
    "hirect": functions.runWith({
        timeoutSeconds: 539,
    }).https.onRequest(Init),
    "list": functions.https.onRequest(List),
};
