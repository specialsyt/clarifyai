'use server'

import { auth } from '@/auth'
import ProfileView from '@/components/profile-view'
import { getSurveysByUser } from '@/lib/db/survey'
import { analyzeTranscript } from '@/lib/surveyAnalysis/llm'
import { Session } from '@/lib/types'

export default async function ProfilePage() {
  const session = (await auth()) as Session

  const surveys = await getSurveysByUser(session?.user?.id)

  const analysis = await analyzeTranscript(
    'I think the product is pretty good. It looks and feels good. The shape is very good. ',
    {
      id: '1',
      text: 'How do you feel about the product?',
      type: 'follow_up',
      goals: ['Shape', 'looks', 'feel']
    },
    ['Shape and specifically the roundness of it', 'looks', 'feel']
  )

  return (
    <main className="flex flex-col p-4">
      <ProfileView session={session} />
    </main>
  )
}
