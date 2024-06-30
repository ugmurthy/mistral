### 
### Refer : https://docs.llama-api.com/quickstart
###

"""
Usage : python llama.py filename.txt
arg1 is input file/pathname - assumes a question on each line and filename ending in .txt

llama.py take each question querys the LLM and gets the response.
the output will be in filenameMSQA.jsonl (JSON LINES)

"""
# use the OpenAI lib for python
from openai import OpenAI
import os,json, sys, time
def readlines_from_file(file_name):
    lines=[]
    with open(file_name, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return lines

start = time.time()
models=["llama3-70b","llama3-8b"]
model = models[0]
def query(question, model):
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": question}
        ],
        max_tokens=2000

    )
    content=response.choices[0].message.content
    return content

## check args
args = sys.argv
print("args :", args)
if len(args)==1:
    print("Error: need json filename of questions as  argument ")
fname = args[1]
if len(args)==3:
    ofname = args[2]+f"_{model}_"+"MSGQA.jsonl"
else:
    ofname = args[1].split(".txt")[0]+f"_{model}_"+"MSGQA.jsonl"
questions=readlines_from_file(fname)

system = "You are a world class distance running and strength coach and specialise in training athletes for running a marathon"

##
## setup client
api_key = os.environ['LLAMA_API_KEY']
client = OpenAI(
api_key = api_key,
base_url = "https://api.llama-api.com"
)


print(80*"=")
print(fname," -> ",ofname)
print(f"Got {len(questions)} questions")
print(f"using model : {model}")
print(80*"=")

##exit(0)

# Test if it works for a question
# print(query(questions[0],model))
all = []
for idx,q in enumerate(questions):
    s = time.time()
    
    content = query(q,model)
    ## used for testing
    ##content = "Dummy Answer" 
    e = time.time()
    qnonl = q.strip('\n')
    print(f"Q{idx+1}: {qnonl} took {(e-s):.2f} secs to answer")
    jsonl = [{"role":"user","content":q},{"role":"assistant","content":content}]
    all.append(jsonl)

## write the array all to file.
def write2file(array, filename):
    with open(filename, 'w') as f:
        for obj in array:
            f.write(json.dumps(obj) + '\n')
print(f"array all has {len(all)} elements")
write2file(all, ofname)


