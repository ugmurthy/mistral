/*
Converts the messages json object to json lines
usage: node json2lines.cjs <filename>
Example:
following object is transformed
CASE QA = False
{"messages":[
    {"role":"user","content":"Some question text1"},
    {"role":"assistant","content":"Some response text1"},
    {"role":"user","content":"Some question text2"},
    {"role":"assistant","content":"Some response text2"}
]}

CASE QA = True
{"messages":[
    {"question":"some question text1","answer":"some response text1"},
    {"question":"some question text2","answer":"some response text2"}
]
}
to json lines:

[{"role":"user","content":"Some question text1"},{"role":"assistant","content":"Some response text1"}]
[{"role":"user","content":"Some question text2"},{"role":"assistant","content":"Some response text2"}]
*/

const fs = require('fs');

function readJsonFile(filename) {
    try {
        const jsonData = fs.readFileSync(filename, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error reading JSON file: ${filename}`);
        return null;
    }
}

function writeFile(textLines, filename) {
    try {
        fs.writeFileSync(filename, textLines, 'utf8');
    } catch (error) {
        console.error(`Error writing JSON file: ${filename}`);
    }
}

// Get the command-line arguments
const args = process.argv.slice(2)
if (args.length <= 0 ) {
    console.log("Error args missing arg1 is pathname of json file")
    process.exit(-1);
}
// Parse the arguments
const jsonFile = args[0];
const outfname = jsonFile.split('.')[0]+'.jsonl'
console.log(`Pathname  :${jsonFile}`);
const jsonObject = readJsonFile(jsonFile);

if (jsonObject === null) {
    console.error('Failed to read JSON file');
    process.exit(-1)
}

const messages = jsonObject.messages;

/// check if this is an array of {'question':'....','answer':'........'},...
/// or this is an array of {'role':'user','content':'....'},{'role':'assistant','content':'....'}
const sample = messages[0]
const QA = Object.keys(sample).includes('role')?false:true
console.log("Questions Answers? ",QA);


var jsonlines = ""
var count = 0;
if (QA) {
    for (let i=0;i<messages.length;i++) {
        let qaObj = messages[i];
        let msg = JSON.stringify([{'role':'user','content':qaObj.question},{'role':'assistant','content':qaObj.answer}])+'\n';
        jsonlines = jsonlines + msg;
        count++
    }
} else {
    for (let i=0;i<messages.length;i+=2) {
        let msg = JSON.stringify([messages[i],messages[i+1]])+'\n'
        jsonlines = jsonlines + msg
        count++
    }
}
console.log(jsonObject.messages.length,count );
writeFile(jsonlines,outfname);
