import * as aws from "aws-sdk";
import * as mailcomposer from 'mailcomposer';

aws.config.update({
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
});

const SES = new aws.SES();


const AWS = {
    SES: {
        Send: (from: string, to: string, subject: string, body: string, cc?: string[], attachment?: string) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const mail = mailcomposer({
                        from: from,
                        replyTo: 'help@bobthecoder.org',
                        to: to,
                        subject: subject,
                        html: body,
                        attachments: attachment ? [{
                            path: attachment,
                        }] : [],
                    });
    
                    mail.build(async (err: any, message: string) => {
                        if (err) {
                            return reject(err);
                        }

                        await SES.sendRawEmail({ RawMessage: { Data: message } }).promise();
                        return resolve(true);
                    });
                } catch (err) {
                    return reject(err);
                }                
            })
        },
    },
};

export {
    AWS,
};
