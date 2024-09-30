import Session from '@/components/session'
import {
  createSurveySession,
  doesSurveyExist,
  getSurvey
} from '@/lib/db/survey'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

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

  const sessionUUID = uuidv4()
  await createSurveySession(surveyId, sessionUUID)

  redirect(`/session/${sessionUUID}`)
}
