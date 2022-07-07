const tsConfig = require('../tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
    baseUrl: __dirname,
    paths: tsConfig.compilerOptions.paths,
});

import * as functions from "firebase-functions";
import { Login } from "@controllers/authentication/handler";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(Login);
