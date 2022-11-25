import axios, {AxiosRequestConfig} from "axios";

const HIRECT_BASE_URL = "https://prod.hirect.ai";
export const Hirect = {
    Get: {
        Bulk: async (token: string, jobId: string, pageNumber = 1, pageSize = 50, refreshId: string, cityId = 54) => {
            try {
                const config: AxiosRequestConfig = {
                    method: "POST",
                    baseURL: HIRECT_BASE_URL,
                    url: "/hirect/candidate-service/candidates/webApp/recommendation",
                    params: {
                        jobId: jobId,
                        type: 1,
                        cityId: cityId,
                        pageNum: pageNumber,
                        pageSize: pageSize,
                        refresh: false,
                        refreshId: refreshId,
                    },
                    headers: {
                        "x-idtoken": token,
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json;charset=UTF-8 application/json;charset=UTF-8",
                        "user-agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
                        "x-appversion": "2.1.0",
                        "x-brand": "Mac OS",
                        "x-deviceid": "f3997c2268393c3e44db9d6171c7d192",
                        "x-model": "10.15.7",
                        "x-os": "webapp",
                        "x-region": "in",
                        "x-role": "1",
                        "x-timestamp": "1669025476626",
                        "x-uid": "71c47b13261d43ba8516abc5e820",
                    },
                    data: {},
                };

                const {data} = await axios(config);
                return Promise.resolve(data);
            } catch (err) {
                return Promise.reject(new Error(err as string));
            }
        },
        Profile: async (token: string, candidateId: string): Promise<any> => {
            try {
                const config: AxiosRequestConfig = {
                    method: "GET",
                    baseURL: HIRECT_BASE_URL,
                    url: `/hirect/candidate-service/recruiters/candidates/${candidateId}/profile`,
                    headers: {
                        "x-idtoken": token,
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json;charset=UTF-8 application/json;charset=UTF-8",
                        "user-agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
                        "x-appversion": "2.1.0",
                        "x-brand": "Mac OS",
                        "x-deviceid": "f3997c2268393c3e44db9d6171c7d192",
                        "x-model": "10.15.7",
                        "x-os": "webapp",
                        "x-region": "in",
                        "x-role": "1",
                        "x-timestamp": "1669025476626",
                        "x-uid": "71c47b13261d43ba8516abc5e820",
                    },
                };

                const {data} = await axios(config);
                return Promise.resolve(data);
            } catch (err) {
                return Promise.reject(new Error(err as string));
            }
        },
    },
};
