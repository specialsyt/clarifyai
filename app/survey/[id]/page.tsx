import Session from '@/components/session'
import {
  createSurveySession,
  doesSurveyExist,
  getSurvey
} from '@/lib/db/survey'
import { redirect } from 'next/navigation'

export default async function SurveyPage({
  params
}: {
  params: { id: string }
}) {
  const surveyId = params.id
  const surveyExists = await doesSurveyExist(surveyId)

  if (!surveyExists) {
    return <div>Survey not found</div>
  }

  const sessionUUID = crypto.randomUUID()
  await createSurveySession(surveyId, sessionUUID)

  redirect(`/session/${sessionUUID}`)
}
