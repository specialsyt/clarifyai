import { EnhancedQuestion } from '../types'
import {
  analyzeTranscript,
  generateLeadingQuestion,
  evaluateResponseRelevance,
  evaulateUserResponse
} from './llm'

export async function TestLLMAnalysisAndGeneration() {
  const transcript =
    'It was a good day. I think that all the kids had fun and no one got hurt, so that is good.'

  const question = {
    id: '1',
    text: 'How was your day at camp?',
    type: 'follow_up',
    goals: ['Incidents', 'safety', 'fun']
  } as EnhancedQuestion

  evaulateUserResponse(transcript, question)
}
