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

  if (!survey) redirect('/')

  return (
    <main className="flex flex-col p-4">
      <ResultView session={session} survey={survey!} />
    </main>
  )
}
