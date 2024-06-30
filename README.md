# Mistral FineTuning Hackathon - Jun 2024

## Project `MyCoach`:

`MyCoach` is an innovative Marathon Coaching application designed to offer comprehensive support to runners. The app provides guidance on nutrition, strength and mental training, the musculoskeletal system, motivational strategies, and racing tactics. `MyCoach` aims to enhance running performance and help users achieve their goals, whether they are beginners or experienced runners.

The development of `MyCoach` began as a project for the [Mistral.ai](https://mistral.ai/) Hackathon. Leveraging the **Fine Tuning API**, the project utilised both synthetic and crowd-sourced questions. These questions were answered by leading large language models (LLMs) including ChatGPT-4o, Mistral Large, Gemini Advanced, Llama3-70b, and some smaller models. The responses from these LLMs were compiled to create a robust dataset.

This dataset was then used to fine-tune an `open-mistral-7b` model, ensuring it was capable of providing expert advice on marathon coaching. The refined model was integrated into `MyCoach`, the front-end web app, to offer users easy access to personalised running guidance.

With MyCoach, runners can receive expert advice, motivational support, and tailored strategies to improve their performance and enjoy their running journey.

[![MyCoach](https://img.youtube.com/vi/2xqy7wj1exI/0.jpg)](https://www.youtube.com/watch?v=2xqy7wj1exI)

[MyCoach Code Repo](https://github.com/ugmurthy/mistral-ft)

## 1.0 Project Objectives:

To Create a `fine tuned` model from [mistal.ai](https://mistral.ai/)'s `open-mistral-7b` to represent a Expert Marathon Coach and verify if the `fine tuned` model performs better than `open-mistral-7b` more specifically the `fine tuned` model should:

- Provide brief but informative answers to questions/requests
- Provide output well formated (`markdown` in this case)
- Perform better than `open-mistral-7b`

an finally expose the `fine tuned` model via a front web app called `MyCoach`

## 2.0 Data Set Preparation

![DataSet Preparation](/img/FineTuning.png) {a brief description about this data set preparation}

Data Set preparation was the most challenging phase of the project as it took lots of time and effort to gather data for fine tuning.

The overall 250+ plus questions were gathered covering various aspects relating to running a Marathon - example Training, Recovery, Nutrition, Racing, Strength Training. Then seek answers to all these question from multiple sources.

LLMs were used to generate answers finally ending in 800 plus question/answers.

More details follow....

## 2.1 Question Generation

This was critical part of the data set preparation phase as good questions were important from end use perspective. Two methods employed to generate questions

1. I used the book "ADVANCED MARATHONING" 2nd Edition by PETE PFITZINGER and SCOTT DOUGLAS as the based for generating questions from its various chapters.
2. I used GeminiAdvanced Chat interface to generate another set of questions about Marathoning
3. The last set of questions was crowdsourced a [google form](https://tinyurl.com/AI-Running-Coach) was send to the running community that I am part of.

##### 2.2 Answer Generation

Again two methods were employed to get answers to question generated. The Basic idea was to ask larger/more advanced models the question and seek answer.

1. Using `GPT-4o`, `GeminiAdvance` chat interfaces were used to generate JSON arrays containing both question and answers
2. Using MISTRAL API to get `chat/completions` from `mistral-8x22B` and `mistral-large` models
3. Using llama API to get `chat/completions` from `llama3-70b`
4. Using ollama API to get `chat/completions` from `llama3-7b` and `mistral-7b`

##### 2.3 Combine to get `.jsonl` files

The Q/As generated in 2.1 and 2.2 were converted to `.jsonl` files.

for example here are few lines representing a `.jsonl` format
`[{"role":"user","content":"What is 2+2=?"},{"role":"assistant","content":"2+2=4"}]
[{"role":"user","content":"What is 2+2=?"},{"role":"assistant","content":"2+2=4"}]
[{"role":"user","content":"What is 2+2=?"},{"role":"assistant","content":"2+2=4"}]`

##### 2.4 Split to Training and Validation Sets

Approximately 5% of the DataSet was set aside as Validation Data set. The 5% percent was chosen randomly from each of the Q/As datasets that were created using various techniques.

#### 3.0 Fine Tuning

Fine tuning involed the following steps

1. Upload training and validation datasets (be sure to store response for file ids as it required in step 3)
2. Do Dry runs to ascertain if we are okay to proceed with fine tuning - most corrections were relating to validation dataset being too large
3. Do fine tuning of `open-mistral-7B`

Note: [`hitpie`](https://httpie.io/) desktop was used for All steps in Fine Tuning.

#### 4.0 Testing

As the project objective was to see if the Fine Tuned model performed better than `open-mistral-7B`
the following steps were carried out

1. A set of 6 Test questions were hand crafted
2. Responses sought from both the fine tuned model and `open-mistral-7b`
3. The Question/Answers from each of these test were given to Chat GPT/4 to carry out a evaluation

##### Chat GPT/4 Evaluation

`FineTuned Model` Composite Score : 4.43
`open-mistral-7B` : Composite Score: 4.14

    Prompt: Each of the text files contains questions and answers. The question text follows "Question:n:" where "n" is an integer. The corresponding answer follows "Answer:n:" where "n" is an integer. The Answer ends in "----". your task is to pick a question from first text file and compare the answer with the corresponding question  and answer in the second text file. Score the Answers  on a scale of 1 to 5 for each of the following parameter : Relevance: Both answers are relevant and address the question.
    Completeness: Both answers cover the main benefits, but Answer A provides a bit more detail on challenges.
    Clarity: Both answers are clear and well-written.
    Coherence: Both answers are logically structured.
    Originality: Both answers provide unique points but are fairly similar in content.
    Engagement: Both answers are engaging but can be improved with more vivid examples.
    Support and Evidence: Both answers mention challenges, but neither provides specific examples or references. Provide an equally weighted cumulative score for answers in each text file. The Output will be a JSON object indicating the scores per question/answer pair for each text file.
    <textfile containing Q/A for each model>

    Response:
        I've extracted and compared the answers for "Question:1: Explain VO2 Max and how can one improve it?" from the two text files. Here's a detailed assessment based on the criteria you specified:

        1. **Relevance**: Both answers are highly relevant, clearly defining VO2 Max and offering methods to improve it.

        - **Score for both**: 5/5

        2. **Completeness**: Both answers cover various methods to improve VO2 Max. Answer from the first text file is more detailed in describing specific types of exercises and their benefits.

        - **Score for TestFTMSGQA**: 5/5
        - **Score for TestLlama7bMSGQA**: 4/5

        3. **Clarity**: Both answers are well-structured and easy to understand, using bullet points to list improvement methods.

        - **Score for both**: 5/5

        4. **Coherence**: Both answers maintain a logical flow, starting with a definition of VO2 Max followed by improvement strategies.

        - **Score for both**: 5/5

        5. **Originality**: Both answers are somewhat standard in their content about VO2 Max, with common strategies listed. The first text file, however, integrates more detailed training suggestions and dietary advice.

        - **Score for TestFTMSGQA**: 4/5
        - **Score for TestLlama7bMSGQA**: 4/5

        6. **Engagement**: The answer from the first text file is slightly more engaging due to the detailed description of exercises and their specific benefits.

        - **Score for TestFTMSGQA**: 4/5
        - **Score for TestLlama7bMSGQA**: 3/5

        7. **Support and Evidence**: Neither answer provides specific scientific studies or references to support their claims, but they do mention general physiological concepts.
        - **Score for both**: 3/5

        ### Cumulative Scores:

        - **TestFTMSGQA**: \( (5 + 5 + 5 + 5 + 4 + 4 + 3) / 7 \approx 4.43 \)
        - **TestLlama7bMSGQA**: \( (5 + 4 + 5 + 5 + 4 + 3 + 3) / 7 \approx 4.14 \)

        ### JSON Output:

        ```json
        {
        "TestFTMSGQA": {
            "Question1": 4.43
        },
        "TestLlama7bMSGQA": {
            "Question1": 4.14
        }
        }
        ```

        These scores indicate that both answers are effective, with the first text file (TestFTMSGQA) slightly outperforming the second (TestLlama7bMSGQA) in engagement and completeness.
