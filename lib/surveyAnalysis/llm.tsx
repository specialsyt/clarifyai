'use server'

import { createOpenAI } from '@ai-sdk/openai'
import { EnhancedQuestion, LLMEvaluationResponse, Question } from '../types'
import { m } from 'framer-motion'

const followup_cutoff = 4
const goal_followup_cutoff = 2

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

export async function evaluateUserResponse(
  transcript: string,
  mainQuestion: EnhancedQuestion
): Promise<{ leadingQuestion: string | null; mainQuestion: EnhancedQuestion }> {
  'use server'

  const analysis = await analyzeTranscript(
    transcript,
    mainQuestion,
    mainQuestion.goals
  )

  const relevancy = await evaluateResponseRelevance(transcript, mainQuestion)
  console.log(relevancy)

  if (
    analysis.indicies.length > 0 &&
    relevancy < 80 &&
    mainQuestion.num_followups < followup_cutoff
  ) {
    const leadingQuestion = await generateLeadingQuestion(
      transcript,
      mainQuestion,
      analysis.indicies
    )
    mainQuestion.num_followups += 1
    return { leadingQuestion, mainQuestion }
  } else {
    console.log('Move on to next question.')
    return { leadingQuestion: null, mainQuestion }
  }
}

export async function analyzeTranscript(
  transcript: string,
  mainQuestion: EnhancedQuestion,
  goalsLeft: string[]
): Promise<LLMEvaluationResponse> {
  'use server'

  const prompt = `
  You are a survey analysis bot. You are given a transcript of a conversation between a user and an AI chatbot.
  You need to analyze the transcript and provide a summary of the conversation.
  The user is meant to answer the following main question: ${mainQuestion.text}

  In answering the main question, the user is meant to consider the following goals.
  When the goals are specific, make sure the user answers each part of the goal.

  ${goalsLeft.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}

  As an output, you need to output a comma separated list in array format of the goals that the user has not considered. 
  If they met all the goals, you should output an empty [].
  Add <output_start> and <output_end> tags around your indicies response. Also please ensure that there is absolutely no other text on the output line
  with the indicies.

  Example Output:
  User: I love the shape of the product and how round it is. I also like the way that it feels to use.
  Based on the conversation, the user has considered the following goals:

  * Shape: mentioned that the shape is very round and that's good
  * Looks: has not mentioned anything about the looks of the product
  * Feel: mentioned that the product feels good

  <output_start>
  [2]
  <output_end>

  <explanation_start>
  The user has not mentioned anything about the second goal, the look of the product.
  However, the user has mentioned the shape of the product, saying that they like how round it is and the feel of the product, saying they like how it feels to use.
  <explanation_end>
  `

  const content = transcript
  const text = await promptLLM(prompt, content)

  const outputStart = text.indexOf('<output_start>')
  const outputEnd = text.indexOf('<output_end>')
  const output = text.slice(outputStart + 14, outputEnd)
  var indicies = JSON.parse(output) as number[]

  indicies.forEach((_, index, array) => {
    array[index] -= 1
  })

  console.log(`before filtering: ${indicies}`)
  console.log(`mainQuestion.timesFollowedUp: ${mainQuestion}`)
  console.log(`mainQuestion.timesFollowedUp: ${mainQuestion.timesFollowedUp}`)

  indicies = indicies.filter(
    (_, index) => mainQuestion.timesFollowedUp[index] < goal_followup_cutoff
  )

  console.log(`after filtering: ${indicies}`)

  return {
    text,
    indicies
  }
}

export async function evaluateResponseRelevance(
  transcript: string,
  mainQuestion: EnhancedQuestion
): Promise<number> {
  'use server'

  const evaluationPrompt = `You are a survey analysis bot. You are given a transcript of a conversation between a user and an AI chatbot.
  You need to analyze the transcript and provide a summary of the conversation.
  The user is meant to answer the following main question: ${mainQuestion.text}

  In answering the main question, the user is meant to consider the following goals.
  When the goals are specific, make sure the user answers each part of the goal.

  ${mainQuestion.goals.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}

  As an output, you should output a relevancy score between 0 and 100 which represents how completely the goals have been addressed by the user's responses.
  For example, if half of the goals have been addressed, a score of 50 would be appropriate. Please do not be overly generous or harsh with your scoring.

  Add <output_start> and <output_end> tags around your indicies response.

  Example Output:
  User: I love the shape of the product and how round it is. I also like the way that it feels to use.
  Based on the conversation, the user has considered the following goals:

  * Shape: mentioned that the shape is very round and that's good
  * Looks: has not mentioned anything about the looks of the product
  * Feel: has mentioned that the product feels good, but has not mentioned anything about the ergonomics

  <output_start>
  60
  <output_end>
  <explanation_start>
  The relevancy score of 60 has been assigned because the user directly addressed two of the three goals, but has insufficiently addressed the second of the goals, and so does not deserve a full 66 score.
  <explanation_end>
  `

  const content = transcript
  const text = await promptLLM(evaluationPrompt, content)

  const outputStart = text.indexOf('<output_start>')
  const outputEnd = text.indexOf('<output_end>')
  const output = text.slice(outputStart + 14, outputEnd)

  const relevancyScore = parseInt(output)

  return relevancyScore
}

export async function generateLeadingQuestion(
  transcript: string,
  mainQuestion: EnhancedQuestion,
  goalsLeft: number[]
) {
  'use server'

  const prompt = `
  You are a survey analysis bot. You are given a transcript of a conversation between a user and an AI chatbot.
  You need to analyze the transcript and provide a summary of the conversation.
  The user is meant to answer the following main question: ${mainQuestion.text}

  In answering the main question, the user is meant to consider a set of goals.
  The user has not met the following goals:

  ${mainQuestion.goals
    .filter(
      (goal, index) =>
        index in goalsLeft &&
        mainQuestion.timesFollowedUp[index] < goal_followup_cutoff
    )
    .map((goal, index) => `${index + 1}. ${goal}`)
    .join('\n')}

  The input below is the response they have originally given.

  Please come up with a list of possible leading questions that would encourage the interviewee to provide more details regarding the goals that have not been met.
  There should be 2-3 questions which are not overly detailed or wordy. Encourage the user to provide more information regarding the goals and about what they have already mentioned.
  Make sure that all of your questions are 5 or fewer words in length.

  After you have brainstormed some questions, select a single question and the number of a corresponding unmet goal. Please only include the number of the goal, not the body.
  Add <goal_start> and <goal_end> tags around the selected goal number.
  Add <output_start> and <output_end> tags around the selected question.
  Also include your explanation for why you selected that question and goal, with <explanation_start> and <explanation_end> tags around your explanation.
  When creating closing tags, please do not include forward slashes.

  For example, DO NOT DO:
  <goal_start>
  </goal_end>

  DO NOT DO:
  <output_start>
  </output_end>

  Example Output:
  Based on the conversation, the user has considered the following goals:

  1. Shape: mentioned that the shape is very round and that's good
  2. Looks: has not mentioned anything about the looks of the product
  3. Feel: has not mentioned anything about how the product feels or its ergonomics
  
  Questions:
  - Do you have any specific thoughts on the looks of the product?
  - How does the product feel to use?
  - Is the product intuitive to use?

  <goal_start>
  2
  <goal_end>

  <output_start>
  Do you have any specific thoughts on the looks of the product?
  <output_end>

  <explanation_start>
  The question "Do you have any specific thoughts on the looks of the product?" has been selected because the user has not mentioned anything about the looks of the product, and it has been linked with Goal 2, Looks, because it clearly relates to the looks of the product.
  <explanation_end>
  `
  console.log(
    `[${mainQuestion.goals
      .filter(
        (goal, index) =>
          index in goalsLeft &&
          mainQuestion.timesFollowedUp[index] < goal_followup_cutoff
      )
      .map((goal, index) => `${index}`)
      .join(', ')}]`
  )

  const content = transcript
  const text = await promptLLM(prompt, content)

  const outputStart = text.indexOf('<output_start>')
  const outputEnd = text.indexOf('<output_end>')
  const output = text.slice(outputStart + 14, outputEnd)

  const goalStart = text.indexOf('<goal_start>')
  const goalEnd = text.indexOf('<goal_end>')
  const goal = parseInt(text.slice(goalStart + 12, goalEnd))
  console.log(`Goal: ${goal}`)

  //Add to the number of times a given goal has been referenced
  mainQuestion.timesFollowedUp[goal - 1] += 1

  return output
}

async function promptLLM(prompt: string, content: string) {
  'use server'

  const model = groq('llama-3.1-70b-versatile')
  const response = await model.doGenerate({
    inputFormat: 'messages',
    mode: {
      type: 'regular'
    },
    prompt: [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: content
          }
        ]
      }
    ],
    temperature: 0
  })

  if (!response.text) {
    throw new Error('No response text')
  }

  const text = response.text

  return text
}
