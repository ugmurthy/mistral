function chatCompletionLlama(question) {
    const llamaApiKey = process.env.LLAMA_API_KEY;
    const baseURL = 'https://api.llama-api.com/';
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${llamaApiKey}`);
    headers.set('Content-Type', 'application/json');
    const url = baseURL+"chat/completions"
    console.log("url ",url)
    const body = {
        messages: [
            {
                role:"user",
                content:question
            }
        ],
        model:"llama3-8b",
        steam:false
    }
    console.log("body ",body)
    fetch(url, {
        method: 'POST',
        headers: headers,
        body:JSON.stringify(body)
    })
    .then(response => {console.log("response ",response); return response.json()})
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        return {}
    });
}

const question = "What is VO2Max in the context of running?"
console.log("question ",question)
const ret_val =  chatCompletionLlama(question);

console.log("-----------------\n",ret_val,"-----------------\n")