'use server'

import { auth } from '@/auth'
import ResultView from '@/components/result-view'
import { getSurvey } from '@/lib/db/survey'
import { Session, Survey } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function ResultPage({
  params
}: {
  params: { id: string }
}) {
  const session = (await auth()) as Session
  const survey = await getSurvey(params.id)
  //   const responses: SurveyResponse[]
  const responses = [
    {
      id: 'temp response id',
      surveyId: 'temp survey id',
      userId: 'temp user id',
      responses: [
        {
          parentId: 'b6d678b6-3e39-47e1-82ff-3c8414cc7589',
          id: 'b6d678b6-3e39-47e1-82ff-3c8414cc7589',
          question: 'question text!',
          response: 'response'
        }
      ]
    },
    {
      id: 'temp response id',
      surveyId: 'temp survey id',
      userId: 'temp user id',
      responses: [
        {
          parentId: 'b6d678b6-3e39-47e1-82ff-3c8414cc7589',
          id: '"b6d678b6-3e39-47e1-82ff-3c8414cc"',
          question: 'question text!',
          response: 'response but different'
        }
      ]
    },
    {
      id: 'temp response id',
      surveyId: 'temp survey id',
      userId: 'temp user id',
      responses: [
        {
          parentId: 'b6d678b6-3e39-47e1-82ff-3c8414cc7589',
          id: 'b6d678b6-3e39-47e1-82ff-3c8414cc7589',
          question: 'question text!',
          response: '2response'
        }
      ]
    },
    {
      id: 'temp response id',
      surveyId: 'temp survey id',
      userId: 'temp user id',
      responses: [
        {
          parentId: 'b6d678b6-3e39-47e1-82ff-3c8414cc7589',
          id: '"b6d678b6-3e39-47e1-82ff-3c8414cc"',
          question: '2question text!',
          response: '2response but different'
        }
      ]
    }
  ]

  if (!survey) redirect('/')

  return (
    <main className="flex flex-col p-4">
      <ResultView session={session} survey={survey!} responses={responses!}/>
    </main>
  )
}
