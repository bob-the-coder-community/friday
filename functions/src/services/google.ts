import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {google} from "googleapis";
import axios from "axios";

const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.HOST}/authentication-callback`
);

export const Google = {
    Oauth: {
        GetLink: async (state: string): Promise<string> => {
            try {
                const scopes: string[] = [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile",
                ];

                const authLink: string = client.generateAuthUrl({
                    access_type: "offline",
                    scope: scopes,
                    hd: process.env.GOOGLE_DOMAIN,
                    state,
                });

                return Promise.resolve(authLink);
            } catch (err) {
                return Promise.reject(err);
            }
        },
        GetToken: async (code: string): Promise<GetTokenResponse> => {
            try {
                return Promise.resolve(await client.getToken(code));
            } catch (err) {
                return Promise.reject(err);
            }
        },
        GetProfile: async (credentials: GetTokenResponse): Promise<any> => {
            try {
                const {data} = await axios({
                    baseURL: "https://www.googleapis.com",
                    url: "/oauth2/v3/userinfo",
                    headers: {
                        "Authorization": `Bearer ${credentials.tokens.access_token}`,
                    },
                });

                return Promise.resolve(data);
            } catch (err) {
                return Promise.reject(err);
            }
        },
    },
};
