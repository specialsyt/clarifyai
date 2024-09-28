'use server'

import { auth } from '@/auth'
import ProfileView from '@/components/profile-view'
import { analyzeTranscript } from '@/lib/surveyAnalysis/llm'
import { Session } from '@/lib/types'

export default async function ProfilePage() {
  const session = (await auth()) as Session
  // const results = await analyzeTranscript('I think the product is pretty good')

  // console.log(results)

  return (
    <main className="flex flex-col p-4">
      <ProfileView session={session} />
    </main>
  )
}
