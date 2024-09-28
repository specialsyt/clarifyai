import { useEffect, useState } from 'react'
import { auth } from '@/auth'
import { Session } from '@/lib/types'

export function useAuthId() {
  const [authId, setAuthId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthId() {
      try {
        const session = (await auth()) as Session
        setAuthId(session?.user?.id || null)
      } catch (error) {
        console.error('Error fetching auth id:', error)
        setAuthId(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthId()
  }, [])

  return { authId, loading }
}
