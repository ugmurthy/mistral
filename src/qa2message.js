
// Convert an array of question/answers to messages
// input = [{question:"...question.....?",answer:".........answer......"},{...}]
// output= {messages:[{"role":"user","content":"...question.....?"},{"role":"assistant","content":"....answer...."},{...},{...}]}
function qa2msg(qa) {
    const ret_val = []
    for (let i=0;i<qa.length;i++) {
       let user= {"role":"user","content": qa[i].question}
       let assistant= {"role":"assistant","content": qa[i].answer}
       ret_val.push(user);
       ret_val.push(assistant);
    }
    return ret_val
    //return {"messages":ret_val}
}

// input an array of json object containing q/a by category. category
// is indicated by key
/* [
    "category1": [
        {question:".......", "answer": "......."},
        {question:".......", "answer": "......."},
        {question:".......", "answer": "......."},
        ],
    "category2": [
        {question:".......", "answer": "......."},
        {question:".......", "answer": "......."},
        {question:".......", "answer": "......."},
        ]
    ]
*/
function category_qa2msg(cqa) {
    let ret_val=[]
    
    for (category in cqa ) {
        let k = Object.keys(cqa[category])[0]
       
        let msg = qa2msg(cqa[category][k]);
        console.log("Processing... ",k, "total q/a  = ",msg.length)
        ret_val.push(msg)
    }
    //return {"messages":ret_val.flat()}
    return ret_val.flat();
}

