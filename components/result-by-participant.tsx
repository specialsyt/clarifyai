'use client'

import { Survey, SurveyResponse } from '@/lib/types'
import { CopyIcon } from '@radix-ui/react-icons'

export default function ResultByParticipant({
  survey,
  responses
}: {
  survey: Survey
  responses: SurveyResponse[]
}) {
  const url = window.location.origin + '/survey/' + survey.id
  return (
    <div className="flex-col grow">
      <div className="grow w-full h-full rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950">
        <div className="flex">
          <button
            onClick={() => {
              navigator.clipboard.writeText(url)
            }}
          >
            <div className="flex">
              <div className="pr-2">Link: {url}</div>
              <CopyIcon />
            </div>
          </button>
        </div>
        <div className="text-5xl py-4">{survey.name}</div>
        <hr />
        <div className="text-xl py-4">{survey.description}</div>
      </div>
      {responses.map(r => {
        return (
          <div className="grow w-full h-full rounded-lg border bg-white px-8 py-8 my-4 shadow-md dark:bg-zinc-950">
            {r.responses.map(q => {
              return q.id == q.parentId ? (
                <div>
                  <hr />
                  <div className="text-xl py-4 font-bold">{q.question}</div>
                  <div className="">{q.response}</div>
                </div>
              ) : (
                <div>
                  <div className="text-l pb-4 font-bold">{q.question}</div>
                  <div className="">{q.response}</div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
