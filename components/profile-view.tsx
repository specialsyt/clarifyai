'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import SurveyItem from './survey-item'
import { Session, Survey, User } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getUser } from '@/app/login/actions'

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
      <div className="grow h-full items-center rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950 ">
        <div className="text-7xl py-4">Welcome, {user.firstName}!</div>
        <hr />
        {surveys.length == 0 ? <div>No Surveys Yet</div> : <></>}
        <div className="flex items-center flex-wrap pt-20">
          {surveys.map(s => {
            return <SurveyItem key={s.id} surveyInfo={s} />
          })}
          <div className="w-1/5 m-[20px] aspect-square">
            <button
              type="button"
              className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-zinc-950 hover:bg-zinc-600 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 overflow-hidden"
              onClick={() => {
                router.push('/new')
              }}
            >
              <PlusIcon className="w-12 h-12  text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
