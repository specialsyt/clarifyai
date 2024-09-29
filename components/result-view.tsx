'use client'

import { deleteSurvey } from '@/lib/db/survey'
import { Session, Survey } from '@/lib/types'
import { ArrowLeftIcon, CopyIcon, TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

export default function ResultView({
  session,
  survey
}: {
  session: Session | null
  survey: Survey
}) {
  const router = useRouter()

  const validUser = session?.user?.id == survey.authorId
  if (!validUser) router.push('/')

  return validUser ? (
    <div className="flex-col grow">
      <div className="w-full flex justify-end">
        <button
          className="my-4 flex flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          type="button"
          onClick={() => {
            deleteSurvey(survey.id)
            router.push('/profile')
          }}
        >
          <div className="pr-2">Delete Survey</div>
          <TrashIcon />
        </button>
      </div>
      <button
        className="my-4 flex flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        onClick={() => {
          router.push('/profile')
        }}
      >
        <ArrowLeftIcon />
        <div className="pl-2">Back to profile</div>
      </button>
      <div className="grow w-full h-full rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950">
        <div className="flex">
          <div className="pr-2">
            Link:{' '}
            {window.location.href.includes(survey.id)
              ? window.location.href
              : `${window.location.href}/${survey.id}`}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
            }}
          >
            <CopyIcon />
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
              <div className="text-l pb-4">{q.goal}</div>
            ) : (
              <></>
            )}
            <hr />
            {/* TODO Results here */}
          </div>
        )
      })}
    </div>
  ) : (
    <></>
  )
}
