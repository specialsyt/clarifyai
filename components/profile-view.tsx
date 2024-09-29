'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import SurveyItem from './survey-item'
import { Session, Survey, User } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getUser } from '@/app/login/actions'
import { Button } from './ui/button'

export default function ProfileView({
  user,
  surveys
}: {
  user: User
  surveys: Survey[]
}) {
  const router = useRouter()

  return (
    <div className="lg:w-1/2 mx-auto flex justify-center items-center grow">
      <div className="grow h-full items-center rounded-lg border bg-white px-8 py-8 my-4 shadow-md">
        <div className="text-7xl py-4">Welcome, {user.firstName}!</div>
        <hr />
        {surveys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              No Surveys Yet
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Create your first survey by clicking the plus button below.
            </p>
          </div>
        ) : null}
        <div className="flex items-center flex-wrap pt-20">
          {surveys.map(s => {
            return <SurveyItem key={s.id} surveyInfo={s} />
          })}
          <div className="w-1/5 m-[20px] aspect-square">
            <Button
              className="w-full h-full"
              onClick={() => {
                router.push('/new')
              }}
            >
              <PlusIcon className="w-12 h-12  text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
