import { withMiddleWare } from "@utils/withMiddleware";
import { Hirect } from "@controllers/gods-eye/services";
import * as functions from "firebase-functions";
import { ICandidate } from "@controllers/candidate/candidate.type";
import { Candidate } from "@controllers/candidate";

const Init = (request: functions.https.Request, response: functions.Response) => withMiddleWare(request, response, async (error: Error) => {
    try {
        if (error) {
            return response.json({ statusCode: 500, body: "Internal Server Error" });
        }

        const { token, jobId } = request.body;
        const { data: { totalCount, refreshId } } = await Hirect.Get.Bulk(token, jobId as string, 1, 1, '');

        // const totalCalls = Math.floor((Math.round(totalCount / 10) * 10) / 50);
        const requests: any[] = (new Array(1).fill(' ')).map((_i, i) => i + 1);

        const results: any[] = [];
        for await (const item of requests) {
            results.push(await Hirect.Get.Bulk(token, jobId as string, item, 50, refreshId));
        }

        const candidates: ICandidate[] = [];
        for await (const item of results.map((item) => item.data.list).flat(2)) {
            const { data } = await Hirect.Get.Profile(token, item.id as string);
            candidates.push({
                uid: item.id,
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
                        designation: data.designation
                    },
                    companies: data.experiences.map((company: any) => ({
                        name: company.companyName,
                        designation: company.designation,
                        start: company.startTime,
                        end: company.endTime,
                        isPresent: company.isPresent,
                        description: company.jobContent
                    })),
                    total: data.workYears
                },
            });
        }

        await Candidate.Service.Insert.Bulk(candidates);
        return response.json({
            status: 200,
            message: {
                totalCount,
            }
        });
    } catch (err) {
        return response.json({ statusCode: 500, body: "Internal Server Error" });
    }
})

export const godseye = {
    "hirect": functions.https.onRequest(Init),
}