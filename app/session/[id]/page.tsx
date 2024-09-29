'use server'

import Session from '@/components/session'
import { getSurvey, getSurveySession } from '@/lib/db/survey'

export default async function SessionPage({
  params
}: {
  params: { id: string }
}) {
  const sessionId = params.id
  const surveySession = await getSurveySession(sessionId)
  if (!surveySession) {
    return <div>Survey session not found</div>
  }
  const survey = await getSurvey(surveySession.surveyId)
  if (!survey) {
    return <div>Survey not found</div>
  }

  return (
    <main className="flex flex-col p-4">
      <Session surveySession={surveySession} survey={survey} />
    </main>
  )
}
