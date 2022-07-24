import * as showdown from "showdown";
// import highlighter from 'showdown-highlight';

const parser = new showdown.Converter({
    extensions: [],
});

/**
 * Converts Markdown into HTML
 * @param str markdown in string format
 * @returns html string generated from markdown
 */
function parse(str: string): string {
    return parser.makeHtml(str);
}

export const markdown = {
    parse,
};
