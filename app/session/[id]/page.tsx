import Session from '@/components/session'
import MessageCard from '@/components/MessageCard'
import { getSurvey, getSurveySession } from '@/lib/db/survey'

export default async function SessionPage({
  params
}: {
  params: { id: string }
}) {
  const sessionId = params.id
  const surveySession = await getSurveySession(sessionId)
  if (!surveySession) {
    return (
      <MessageCard
        title="Survey Session Not Found"
        message="The requested survey session could not be located."
      />
    )
  }
  if (surveySession.completed) {
    return (
      <MessageCard
        title="Survey Completed"
        message="This survey session has already been completed."
      />
    )
  }
  const survey = await getSurvey(surveySession.surveyId)
  if (!survey) {
    return (
      <MessageCard
        title="Survey Not Found"
        message="The requested survey could not be located."
      />
    )
  }

  return (
    <main className="flex flex-col p-4">
      <Session surveySession={surveySession} survey={survey} />
    </main>
  )
}
