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
    <div className="flex flex-col space-y-6">
      <div className="rounded-lg border bg-white px-8 py-6 shadow-md dark:bg-zinc-900">
        <h1 className="text-4xl font-bold mb-4">{survey.name}</h1>
        <hr className="border-gray-200 dark:border-gray-700 mb-4" />
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {survey.description}
        </p>
      </div>

      {responses.map((r, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white px-8 py-6 shadow-md dark:bg-zinc-900"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Participant {index + 1}
          </h2>
          {r.responses.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 last:mb-0">
              {q.id === q.parentId ? (
                <>
                  <hr className="border-gray-200 dark:border-gray-700 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{q.question}</h3>
                </>
              ) : (
                <h4 className="text-lg font-semibold mb-2">{q.question}</h4>
              )}
              <p className="text-gray-700 dark:text-gray-300">{q.response}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
