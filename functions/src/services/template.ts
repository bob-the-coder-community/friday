import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";

const Template = {
    Render: async (data: any, templateName: string): Promise<string> => {
        try {
            const template = fs.readFileSync(path.join(__dirname, `../templates/${templateName}`)).toString();
            const html: string = ejs.render(template, {...data});

            return Promise.resolve(html);
        } catch (err) {
            return Promise.reject(err);
        }
    },
};

export {
    Template,
};
