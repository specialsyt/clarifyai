'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import SurveyItem from './survey-item'
import { redirect } from 'next/navigation'
import { Survey } from '@/lib/types'

export default function ProfileView() {
  const user = 'George P. Burdell'

  // TODO
  const surveys: Survey[] = []

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
          <div className="w-1/5 m-[20px] items-center justify-center">
            <button
              type="button"
              className="my-4 flex grow items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              onClick={() => {
                // todo fix this the redirect is not working :(
                console.log("clicked!")
                redirect('/')
              }}
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
