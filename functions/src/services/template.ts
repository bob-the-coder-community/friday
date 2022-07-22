import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

const Template = {
    Render: async (data: any, template_name: string): Promise<string> => {
        try {
            const template = fs.readFileSync(path.join(__dirname, `../templates/${template_name}`)).toString();
            const html: string = ejs.render(template, { ...data });

            return Promise.resolve(html);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export {
    Template,
}