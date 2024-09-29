import { EnhancedQuestion } from '../types'
import {
  analyzeTranscript,
  generateLeadingQuestion,
  evaluateResponseRelevance,
  evaulateUserResponse
} from './llm'

export async function TestLLMAnalysisAndGeneration() {
  var transcript =
    'It was a good day. I think that all the kids had fun. We had an incident where a kid got spit at, but besides that it was fine.'

  const question = {
    id: '1',
    text: 'How was your day at camp?',
    type: 'follow_up',
    goals: ['Incidents', 'safety', 'fun']
  } as EnhancedQuestion

  while (true) {
    const followupQuestion = await evaulateUserResponse(transcript, question)
    if (followupQuestion) {
      console.log(followupQuestion)
      var answer = 'I think that all the kids were being safe.'
      transcript += '\n' + followupQuestion + '\n' + answer
    } else {
      break
    }
  }
}
