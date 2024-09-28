'use server'

import { auth } from '@/auth'
import ProfileView from '@/components/profile-view'
import { Session } from '@/lib/types'

export default async function ProfilePage() {
  const session = await auth() as Session
  
  return (
    <main className="flex flex-col p-4">
      <ProfileView session={session}/>
    </main>
  )
}
