/*
This program reads a json file (xxxxxQs.json) with question is {role:user ,content:"question text"} format
and gets answer from a local model of choice

outfile (xxxxxQsMSGQA.json) is a json in message forma {"role":"user","content":"question text","role":"assistant":"Answer text"}
*/


import {ChatOllama} from "@langchain/community/chat_models/ollama"
const model = ['llama3','mistral','deepseek-coder:6.7b']

import { ChatPromptTemplate} from "@langchain/core/prompts"
import {StringOutputParser} from "@langchain/core/output_parsers"
import fs from 'fs';
import {performance} from 'perf_hooks';

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


// Get the command-line arguments
const args = process.argv.slice(2)
if (args.length <= 0 ) {
    console.log("Error args missing arg1 is pathname of json file with user objects")
    process.exit(-1);
}
// Parse the arguments
const jsonFile = args[0];
const outfname = jsonFile.split('.')[0]+'MSGQA.json'
console.log(`Pathname  :${jsonFile}`);
const questionObject = readJsonFile(jsonFile);

if (questionObject===null) {
    console.log("Error Got null object on reading json file")
    process.exit(-1)
}
const questions = questionObject.map((q)=>{return q.content})
console.log(`Got ${questions.length} questions`)

var chatModel;
try {
 chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: model[0],
  })
} catch(e) {
    console.log(e)
}


const prompt = ChatPromptTemplate.fromMessages([
    ["system","You are a world class distance running and strength coach and specialise in training athletes for running a marathon"],
    ["user","{input}"],
]);

const chain = prompt.pipe(chatModel)
//  x = await chain.invoke({
//     input: question,
// })
//console.log(x.content);

const outputParser = new StringOutputParser();
const llmchain = prompt.pipe(chatModel).pipe(outputParser);
const messages=[]
const start = performance.now()
var interval=performance.now()
for (let i=0;i<questions.length;i++) {
    // answer each question
    let ans = await llmchain.invoke({input:questions[i]})
    //let ans='dummy'
    let user = questionObject[i];
    let assistant = {role:"assistant",content:ans}
    messages.push(user);
    messages.push(assistant);
    console.log(`Q${i+1}: ${questions[i]} took ${((performance.now()-interval)/1000).toFixed(2)} secs`);
    interval = performance.now();
}

const output = {messages}
writeJsonFile(output,outfname);

