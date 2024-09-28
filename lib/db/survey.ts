'use server'

import { kv } from '@vercel/kv'
import { Session, Survey } from '../types'

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
