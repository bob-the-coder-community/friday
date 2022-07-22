import * as aws from 'aws-sdk';

aws.config.update({
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
});

const SES = new aws.SES();

const AWS = {
    SES: {
        Send: async (from: string, to: string, subject: string, body: string, cc?: string[]) => {
            try {
                const options: aws.SES.SendEmailRequest = {
                    Destination: {
                        ToAddresses: [to],
                        CcAddresses: cc || []
                    },
                    Message: {
                        Body: {
                            Html: {
                                Charset: 'UTF-8',
                                Data: body,
                            },
                        },
                        Subject: {
                            Charset: 'UTF-8',
                            Data: subject,
                        }
                    },
                    Source: from,
                    ReplyToAddresses: [
                        'help@bobthecoder.org'
                    ]
                };

                await SES.sendEmail(options).promise();
                return Promise.resolve(true);
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }
}

export {
    AWS,
}