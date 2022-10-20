import axios, { AxiosRequestConfig } from 'axios';

const HIRECT_BASE_URL: string = 'https://prod.hirect.ai';
export const Hirect = {
    Get: {
        Bulk: async (token: string, jobId: string, pageNumber: number = 1, pageSize: number = 50, refreshId: string, cityId: number = 54) => {
            try {
                const config: AxiosRequestConfig = {
                    method: 'POST',
                    baseURL: HIRECT_BASE_URL,
                    url: '/hirect/candidate-service/candidates/webApp/recommendation',
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
                        'x-idtoken': token,
                        'content-type': 'application/json;charset=UTF-8 application/json;charset=UTF-8',
                    },
                    data: {},
                }

                const { data } = await axios(config);
                return Promise.resolve(data);
            } catch (err) {
                return Promise.reject(new Error(err as string));
            }
        },
        Profile: async (token: string, candidateId: string, preferenceId?: string): Promise<any> => {
            try {
                const config: AxiosRequestConfig = {
                    method: 'GET',
                    baseURL: HIRECT_BASE_URL,
                    url: `/hirect/candidate-service/recruiters/candidates/${candidateId}/profile`,
                    headers: {
                        'x-idtoken': token,
                        'content-type': 'application/json;charset=UTF-8 application/json;charset=UTF-8',
                    },
                };

                const { data } = await axios(config);
                return Promise.resolve(data);
            } catch (err) {
                return Promise.reject(new Error(err as string));
            }
        } 
    }
}