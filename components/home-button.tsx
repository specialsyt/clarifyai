'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HomeIcon } from '@radix-ui/react-icons'

export function HomeButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        router.push('/')
      }}
    >
      <HomeIcon className="size-6" />
      <span className="sr-only">Home</span>
    </Button>
  )
}
