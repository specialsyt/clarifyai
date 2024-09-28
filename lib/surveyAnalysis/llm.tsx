import 'server-only'

import { createOpenAI } from '@ai-sdk/openai'
import { EnhancedQuestion, Question } from '../types'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

export async function analyzeTranscript(
  transcript: string,
  mainQuestion: Question,
  questions: EnhancedQuestion
) {
  'use server'

  const prompt = `
  You are a survey analysis bot. You are given a transcript of a conversation between a user and an AI chatbot.
  You need to analyze the transcript and provide a summary of the conversation.
  The user is meant to answer the following main question: 


  The last line of your response should be an evaluation score of the conversation from 1 to 10 with only the score and no other text before it.
  `

  const content = transcript
  const text = await promptLLM(prompt, content)

  return text
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
    ]
  })

  const text = response.text

  return text
}
