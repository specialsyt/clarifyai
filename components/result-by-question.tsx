'use client'

import { Survey, SurveyResponse } from '@/lib/types'
import { CopyIcon } from '@radix-ui/react-icons'

export default function ResultByQuestion({
  survey,
  responses
}: {
  survey: Survey
  responses: SurveyResponse[]
}) {
  const url = window.location.origin + '/session/' + survey.id
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
            {responses.map(r => {
              const arr = r.responses.filter(a => {
                return a.parentId == q.id
              })
              return arr.map(a => {
                return (
                  <div className="">
                    {a.id == a.parentId ? (
                      <div>
                        <hr />
                        <div className="pt-4">{a.response}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold pt-2">{a.question}</div>
                        <div>{a.response}</div>
                      </div>
                    )}
                  </div>
                )
              })
            })}
          </div>
        )
      })}
    </div>
  )
}
