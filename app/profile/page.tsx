'use server'

import { auth } from '@/auth'
import ProfileView from '@/components/profile-view'
import { getSurveysByUser } from '@/lib/db/survey'
import {
  analyzeTranscript,
  generateLeadingQuestion
} from '@/lib/surveyAnalysis/llm'
import { EnhancedQuestion, Session, Survey } from '@/lib/types'
import { getUser } from '../login/actions'

export default async function ProfilePage() {
  const session = (await auth()) as Session | null
  if (!session) throw new Error('Session is null')
  const user = await getUser(session.user?.email ?? '')

  if (!user) throw new Error('User is null')

  const surveys = await getSurveysByUser(session.user?.id ?? '')

  return (
    <main className="flex flex-col p-4">
      <ProfileView user={user} surveys={surveys} />
    </main>
  )
}
