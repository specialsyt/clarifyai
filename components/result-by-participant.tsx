'use client'

import { deleteSurvey } from '@/lib/db/survey'
import { Session, Survey } from '@/lib/types'
import { ArrowLeftIcon, CopyIcon, TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ResultByParticipant({
  survey
}: {
  survey: Survey
}) {
  return (
    <div className="flex-col grow">
      <div className="grow w-full h-full rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950">
        <div className="flex">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
            }}
          >
            <div className="flex">
              <div className="pr-2">Link: {window.location.href}</div>
              <CopyIcon />
            </div>
          </button>
        </div>
        <div className="text-5xl py-4">{survey.name}</div>
        <hr />
        <div className="text-xl py-4">{survey.description}</div>
      </div>
      {survey.questions.map(q => {
        return (
          <div className="grow w-full h-full rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950">
            <div className="text-2xl pb-4">
              {q.text} ({q.type})
            </div>
            {q.type == 'follow_up' ? (
              <div className="text-l pb-4">{q.goals}</div>
            ) : (
              <></>
            )}
            <hr />
            {/* TODO Results here */}
          </div>
        )
      })}
    </div>
  )
}
