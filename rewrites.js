const editJsonFile = require("edit-json-file");
const functions = require('./functions/lib');
const rewrites = [];

const __PREFIX__ = '';

Object.keys(functions).forEach((item) => {
    Object.keys(functions[item]).forEach((name) => {
        rewrites.push({
            source: `${__PREFIX__}/${item}/${name}`,
            function: `${item}-${name}`
        })
    })
});

const file = editJsonFile('./firebase.json');
file.set("hosting.rewrites", rewrites);
file.save();

console.log('Rewrite Complete');
process.exit(0);