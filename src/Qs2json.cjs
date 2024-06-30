/*
Converts text questions to  json 
usage: node Qs2json.js  <filename>.txt
Example:
following file containing one question per line is transformed

`
What is the time?
Explain Solar system and the importance of planets.
`

to json <filenameQs.json:
[
{"role":"user","content":"What is the time?"},
{"role":"user","content":"Explain Solar system and the importance of planets."},
]

*/

const fs = require('fs');

function readFile(filename) {
    try {
        const lines = fs.readFileSync(filename, 'utf8');
        return lines.split("\n"); // return an array of lines
    } catch (error) {
        console.error(`Error reading file: ${filename}`);
        return null;
    }
}

function writeFile(jsonObj, filename) {
    try {

        fs.writeFileSync(filename, JSON.stringify(jsonObj), 'utf8');
    } catch (error) {
        console.error(`Error writing JSON file: ${filename}`);
    }
}

// Get the command-line arguments
const args = process.argv.slice(2)
if (args.length <= 0 ) {
    console.log("Error args missing arg1 is pathname of text file")
    process.exit(-1);
}
// Parse the arguments
const txtFile = args[0];
const outFile = txtFile.split('.')[0]+'Qs.json'
console.log(`Outfilename  :${outFile}`);
const txtArray = readFile(txtFile);


if (txtArray.length === 0) {
    console.error('Nothing in the file to read');
    process.exit(-1)
}

// convert text to object with keys {user,content}

const jsonObject = txtArray.map((line)=>{return {"role":"user","content":line}})
console.log(`got ${txtArray.length} questions in ${txtFile}`)
console.log(`writing ${jsonObject.length} objects to ${outFile}`)
writeFile(jsonObject,outFile);
