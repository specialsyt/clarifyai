'use server'

import { auth } from '@/auth'
import SurveySetup from '@/components/survey-setup'
import { Session } from '@/lib/types'

export default async function NewPage() {
  const session = (await auth()) as Session
  return (
    <main className="flex flex-col p-4">
      <SurveySetup session={session} />
    </main>
  )
}
