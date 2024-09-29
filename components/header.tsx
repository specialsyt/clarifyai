import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconPerson,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import { HomeButton } from './home-button'
import { IconJarLogoIcon } from '@radix-ui/react-icons'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <HomeButton />
        </>
      ) : (
        // <Link href="/new" rel="nofollow">
        //   <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
        //   <IconNextChat className="hidden size-6 mr-2 dark:block" />
        // </Link>
        <HomeButton />
      )}
      <div className="flex items-center">
        {session?.user && (
          <>
            <IconSeparator className="size-6 text-muted-foreground/50" />
            <UserMenu user={session.user} />
          </>
        )}
      </div>
    </>
  )
}

export async function Header() {
  const session = await auth()
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {session?.user ? (
          <Link href="/profile">
            <div className={cn(buttonVariants({ variant: 'outline' }))}>
              <IconPerson />
              <span className="hidden ml-2 md:flex">Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/login">
            <div className={cn(buttonVariants({ variant: 'outline' }))}>
              <IconJarLogoIcon />
              <span className="hidden ml-2 md:flex">Login</span>
            </div>
          </Link>
        )}
        <a
          target="_blank"
          href="https://github.com/specialsyt/clarifyai"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a>
      </div>
    </header>
  )
}
