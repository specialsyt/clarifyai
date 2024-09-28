'use server'

import { auth } from '@/auth'
import ProfileView from '@/components/profile-view'
import { getSurveysByUser } from '@/lib/db/survey'
import {
  analyzeTranscript,
  generateLeadingQuestion
} from '@/lib/surveyAnalysis/llm'
import { EnhancedQuestion, Session, Survey } from '@/lib/types'

export default async function ProfilePage() {
  const session = (await auth()) as Session

  const surveys = await getSurveysByUser(session?.user?.id)

  const transcript =
    'I think the product is pretty good. It looks and feels good. The shape is very good. '

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

  return (
    <main className="flex flex-col p-4">
      <ProfileView session={session} surveys={surveys} />
    </main>
  )
}
