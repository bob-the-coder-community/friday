import axios from "axios";

export const Judge0 = {
    Evaluate: async (problemId: string, languageId = 16, sourceCode: string, stdin: string, expectedOutput: string) => {
        try {
            const {data} = await axios({
                url: process.env.JUDGE0_EXECTION_LINK,
                method: "POST",
                data: {
                    language_id: languageId,
                    source_code: sourceCode,
                    stdin,
                },
            });

            /** There is error with code execution */
            if (data.stderr || data.stdout !== expectedOutput) {
                return Promise.resolve({
                    problem_id: problemId,
                    pass: false,
                    stdout: data.stderr || data.stdout,
                });
            }

            return Promise.resolve({
                problem_id: problemId,
                pass: true,
                stdout: data.stdout,
            });
        } catch (err) {
            return Promise.resolve({
                problem_id: problemId,
                pass: false,
                stdout: "Internal Server Error",
            });
        }
    },
};
