'use server'

import { kv } from '@vercel/kv'
import { QuestionResponse, Session, Survey, SurveyResponse } from '../types'

export async function createSurvey(
  session: Session,
  survey: Survey
): Promise<void> {
  const user = session?.user
  if (!user) {
    throw new Error('User not found')
  }

  await kv.set('survey:' + survey.id, survey)
}

export async function getSurveysByUser(userId: string): Promise<Survey[]> {
  const surveyKeys = await kv.keys('survey:*')
  const surveys = await Promise.all<Survey | null>(
    surveyKeys.map(key => kv.get(key))
  )
  if (!surveys) {
    return []
  }
  const surveysByUser = surveys.filter(
    survey => survey && survey.authorId === userId
  )
  return surveysByUser as Survey[]
}

export async function getSurvey(surveyId: string): Promise<Survey | null> {
  return await kv.get('survey:' + surveyId)
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  await kv.del('survey:' + surveyId)
}

export async function saveSurveyResponse(
  surveyId: string,
  userId: string,
  surveyResponse: SurveyResponse
): Promise<void> {
  await kv.set('survey_response:' + surveyId + ':' + userId, surveyResponse)
}

export async function getSurveyResponsesByUser(
  userId: string,
  surveyId: string
): Promise<SurveyResponse[]> {
  const surveyResponseKeys = await kv.keys(
    'survey_response:' + surveyId + ':' + userId
  )
  const surveyResponses = await Promise.all<SurveyResponse | null>(
    surveyResponseKeys.map(key => kv.get(key))
  )
  return surveyResponses as SurveyResponse[]
}

export async function getSurveyBySessionId(
  sessionId: string
): Promise<Survey | null> {
  return await kv.get('survey:' + sessionId)
}
