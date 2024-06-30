/*
Talks to any mistral model in bactch mode.
Usage:
   node mistral.js <questionsFilePathname>
*/
import MistralClient from '@mistralai/mistralai';
import {performance} from 'perf_hooks';
import fs from 'fs';


function readJsonFile(filename) {
    try {
        const jsonData = fs.readFileSync(filename, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error reading JSON file: ${filename}`);
        return null;
    }
}

function writeJsonFile(jsonObject, filename) {
    try {
        fs.writeFileSync(filename, JSON.stringify(jsonObject), 'utf8');
    } catch (error) {
        console.error(`Error writing JSON file: ${filename}`);
    }
}
// Get API Key
const apiKey = process.env.MISTRAL_API_KEY;
if (apiKey===undefined) {
    console.log("MISTRAL_API_KEY missing or null")
    process.exit(-1)
}

// Get the command-line arguments
const args = process.argv.slice(2)
if (args.length <= 0 ) {
    console.log("Error args missing arg1 is pathname of json file with user objects")
    process.exit(-1);
}
// models
const model = [
    'mistral-large-latest', //0
    'mistral-small-latest', //1
    'open-mistral-7b', //2
    'ft:open-mistral-7b:504267b8:20240618:RunningCoach:828a47cc', //3 old fine tuned model to be deleted
    'open-mixtral-8x22b', //4
    'ft:open-mistral-7b:504267b8:20240620:MyCoach:29b5b062' //5 fine tuned model 20/Jun
]

const DEFAULT_MODEL = model[2] // open-mistral-7b
const client = new MistralClient(apiKey);

// Parse the arguments
const jsonFile = args[0];  // input json pathname
var stop = 10000 // process all questions
if (args.length>1) { // looks like we have 2nd argument
    stop = parseInt(args[1])
    if (isNaN(stop)) {
        console.log("Error 2nd argument is not a number")
        process.exit(-1)
    }
} 
const outfname = jsonFile.split('.')[0]+'MSGQA.json'
console.log(`\nInput  pathname  :${jsonFile}`);
console.log(`Output pathname  :${outfname}`);
const questionObject = readJsonFile(jsonFile);

if (questionObject===null) {
    console.log("Error Got null object on reading json file")
    process.exit(-1)
}
const questions = questionObject.map((q)=>{return q.content})
console.log(stop===10000?`Processing ${questions.length} questions`:`Processing ${stop} of ${questions.length}`);
// questions now contains and array of question strings

async function invokeLLM(mdl,query) {
    const m = model.includes(mdl)? model:DEFAULT_MODEL
    const chatResponse = await client.chat({
    model:m,
    messages: [
        {role:'user','content':query}
        ]
    })
    return chatResponse.choices[0].message.content
}

////
const messages=[]
const start = performance.now()
var interval=performance.now()
for (let i=0;i<questions.length;i++) {
    //INFERENCE answer each question
    let ans = await invokeLLM(model[2],questions[i])
    //let ans=`dummy content # ${i+1}`
    let user = questionObject[i];
    let assistant = {role:"assistant",content:ans}
    messages.push(user);
    messages.push(assistant);
    console.log(`Q${i+1}: ${questions[i]} took ${(performance.now()-interval)/1000} secs`);
    interval = performance.now();
    if (i===stop-1) {
        break;
    }
    // write output after every 10 responses
    if (i%10===0 && i > 0) {
        console.log("check pointing @ i = ",i)
        writeJsonFile({messages},outfname);
    }
}

console.log(`\n\nAll done. Total questions ${questions.length} answers in ${(performance.now()-start)/1000} secs\n\n`)

const output = {messages}
writeJsonFile(output,outfname);
