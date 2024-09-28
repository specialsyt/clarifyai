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

  return (
    <main className="flex flex-col p-4">
      <ProfileView session={session} surveys={surveys} />
    </main>
  )
}
