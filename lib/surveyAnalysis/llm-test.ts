import { EnhancedQuestion } from '../types'
import { analyzeTranscript, generateLeadingQuestion } from './llm'

export async function TestLLMAnalysisAndGeneration() {
  const transcript =
    'I think the product is pretty good. The shape is very good. '

  const question = {
    id: '1',
    text: 'How do you feel about the product?',
    type: 'follow_up',
    goals: ['Shape', 'looks', 'feel']
  } as EnhancedQuestion

  const analysis = await analyzeTranscript(transcript, question, [
    'Shape and specifically the roundness of it',
    'looks',
    'feel'
  ])

  if (analysis.indicies.length > 0) {
    const leadingQuestion = await generateLeadingQuestion(
      transcript,
      question,
      analysis.indicies[0]
    )
    console.log(leadingQuestion)
  }
}
