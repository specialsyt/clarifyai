'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import SurveyItem from './survey-item'
import { Session, Survey } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function ProfileView({session}: {session: Session | null }) {
  const router = useRouter()
  console.log(session);
  const user = session?.user?.email

  // TODO: Get surveys
  const surveys: Survey[] = [
    {
      id: 'fake id',
      name: 'fake name',
      authorId: 'fake author',
      description: 'fake description',
      questions: [
        {
          id: 'qid 1',
          text: 'fake question 1',
          type: 'follow_up',
          goal: 'fake goal'
        },
        { id: 'qid 2', text: 'fake question 2', type: 'informational' }
      ]
    },
    {
      id: 'fake id',
      name: 'fake name',
      authorId: 'fake author',
      description: '',
      questions: [
        {
          id: 'qid 1',
          text: 'fake question 1',
          type: 'follow_up',
          goal: 'fake goal'
        },
        { id: 'qid 2', text: 'fake question 2', type: 'informational' }
      ]
    }
  ]

  return (
    <div className="flex grow">
      <div className="grow w-full h-full rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950">
        <div className="text-7xl py-4">Welcome, {user}!</div>
        <hr />
        {surveys.length == 0 ? <div>No Surveys Yet</div> : <></>}
        <div className="flex items-center flex-wrap pt-20">
          {surveys.map(s => {
            return <SurveyItem surveyInfo={s} />
          })}
          <div className="w-1/5 m-[20px] flex">
            <button
              type="button"
              className="my-4 flex grow items-center justify-center rounded-md  p-2 text-sm font-semibold text-zinc-100 bg-zinc-900 hover:bg-zinc-600"
              onClick={() => {
                router.push('/new')
              }}
            >
              <div className="text-l pr-1 semibold">Create New Survey</div>
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
