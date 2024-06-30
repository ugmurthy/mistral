import MistralClient from '@mistralai/mistralai';
import {performance} from 'perf_hooks';

import dotenv from 'dotenv';
dotenv.config();

const model = [
    'mistral-large-latest',
    'mistral-small-latest',
    'open-mistral-7b',
    'ft:open-mistral-7b:504267b8:20240618:CoachV2:5dcda1db'
]

// Try chat
const apiKey = process.env.MISTRAL_API_KEY;
const client = new MistralClient(apiKey);
let start = performance.now();
let m1=model[2]
//let question = 'What are running form drills and their benefits?'
let question = 'How can runners avoid gastrointestinal issues during races?'
const chatResponse1 = await client.chat({
    model: m1,
    messages: [
        {role:'user','content':question}
    ],
    temperature:0.5
})
let duration1 = performance.now()-start;
start=performance.now()
let m2 = model[3]
const chatResponse2 = await client.chat({
    model: m2,
    messages: [
        {role:'user','content':question}
    ]
})
let duration2 = performance.now()-start;
console.log(`Question : ${question}`)
console.log(`Chat Response (${duration1/1000} ms):${m1} \n`, chatResponse1.choices[0].message.content);
console.log("=====================");
console.log(`Chat Response (${duration2/1000} ms)${m2} \n`, chatResponse2.choices[0].message.content);

