'use server'

import { createOpenAI } from '@ai-sdk/openai'
import { EnhancedQuestion, LLMEvaluationResponse, Question } from '../types'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

export async function evaluateUserResponse(
  transcript: string,
  mainQuestion: EnhancedQuestion
): Promise<string | null> {
  'use server'

  const analysis = await analyzeTranscript(
    transcript,
    mainQuestion,
    mainQuestion.goals
  )

  if (analysis.indicies.length > 0) {
    const leadingQuestion = await generateLeadingQuestion(
      transcript,
      mainQuestion,
      analysis.indicies[0]
    )
    return leadingQuestion
  } else {
    return null
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
  Add <output_start> and <output_end> tags around your indicies response.

  Example Output:
  Based on the conversation, the user has considered the following goals:

  * Shape: mentioned that the shape is very round and that's good
  * Looks: mentioned that the product looks good
  * Feel: mentioned that the product feels good

  <output_start>
  [1, 2]
  <output_end>
  `

  const evaluationPrompt = `The last line of your response should be an evaluation score of the conversation from 1 to 10 with only the score and no other text before it.`

  const content = transcript
  const text = await promptLLM(prompt, content)

  const outputStart = text.indexOf('<output_start>')
  const outputEnd = text.indexOf('<output_end>')
  const output = text.slice(outputStart + 14, outputEnd)
  const indicies = JSON.parse(output) as number[]

  indicies.forEach((_, index, array) => {
    array[index] -= 1
  })

  console.log(indicies)

  return {
    text,
    indicies
  }
}

export async function generateLeadingQuestion(
  transcript: string,
  mainQuestion: EnhancedQuestion,
  goalLeft: number
) {
  'use server'

  const prompt = `
  You are a survey analysis bot. You are given a transcript of a conversation between a user and an AI chatbot.
  You need to analyze the transcript and provide a summary of the conversation.
  The user is meant to answer the following main question: ${mainQuestion.text}

  In answering the main question, the user is meant to consider the following goals.

  The user has not met the following goal:

  ${mainQuestion.goals[goalLeft]}

  The input below is the response they have originally given.
  Output a question that the user can answer to answer the goal they have not met yet. 
  Make it concise and to the point, while not being too vague.
  Be specific to the goal that they have not met yet.
  
  Add <output_start> and <output_end> tags around your response.
  `

  const content = transcript
  const text = await promptLLM(prompt, content)

  const outputStart = text.indexOf('<output_start>')
  const outputEnd = text.indexOf('<output_end>')
  const output = text.slice(outputStart + 14, outputEnd)

  return output
}

async function promptLLM(prompt: string, content: string) {
  'use server'

  const model = groq('llama3-8b-8192')
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
    temperature: 0.5
  })

  if (!response.text) {
    throw new Error('No response text')
  }

  const text = response.text

  return text
}
