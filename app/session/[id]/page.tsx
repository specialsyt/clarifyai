'use server'

import Session from '@/components/session'
import { getSurvey } from '@/lib/db/survey'

export default async function SessionPage({
  params
}: {
  params: { id: string }
}) {
  const sessionId = params.id
  const survey = await getSurvey(params.id)

  return (
    <main className="flex flex-col p-4">
      <Session sessionId={sessionId} survey={survey!} />
    </main>
  )
}
