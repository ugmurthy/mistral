/* import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['LLAMA_API_KEY'], // This is the default and can be omitted
  baseURL: "https://api.llama-api.com",
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Explain the role of protien in strength training' }]
  });
}

main(); */


import LlamaAI from 'llamaai';

const apiToken = process.env.LLAMA_API_KEY
const LlamaAPI = new LlamaAI(apiToken);

/* LlamAPI.run(apiRequestJson)
    .then(response => {
        console.log("-------------response.choices[0].content----------")
        console.log(response.choices[0].content)
        console.log("--------------Full Response------------")
        console.log(response)
    })
    .catch(error => {
        console.log("Error : ",error);
    })
 */
async function getChatCompletion(question) {
    const apiRequestJson = {
        messages: [
            {"role":"user","content":question}
        ],
        model:"llama3-8b",
        stream:false
    }

    try {
        const response = await LlamaAPI.run(apiRequestJson);
        if (response.choices && response.choices.length > 0) {
            return response.choices[0].message.content;
        } else {
            console.error('No choices returned in response');
            return null;
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response data ",error.response.data);
            console.error("Error response status ",error.response.status )
        } else {
        console.error('Error getting chat completion:', error.message);
        }
        return null;
    }
}

var question = "What is VO2 max in the context of running?"
var ret_val = await getChatCompletion(question)

console.log("Ret_val : ",ret_val)