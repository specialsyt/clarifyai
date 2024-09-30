'use client'

import { deleteSurvey } from '@/lib/db/survey'
import { Session, Survey, SurveyResponse } from '@/lib/types'
import {
  ArrowLeftIcon,
  CopyIcon,
  TrashIcon,
  CheckIcon
} from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ResultByQuestion from './result-by-question'
import ResultByParticipant from './result-by-participant'
import { IconDownload } from './ui/icons'
import { useState } from 'react'

// Add this new function
function exportToCSV(survey: Survey, responses: SurveyResponse[]) {
  // Create CSV content
  let csvContent = 'data:text/csv;charset=utf-8,'

  // Add headers
  csvContent += 'Question,Response,Participant\n'

  // Add data
  responses.forEach((response, index) => {
    response.responses.forEach(answer => {
      csvContent += `"${answer.question.replace(/"/g, '""')}","${answer.response.replace(/"/g, '""')}","Participant ${index + 1}"\n`
    })
  })

  // Create download link
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${survey.name}_responses.csv`)
  document.body.appendChild(link)

  // Trigger download
  link.click()
}

export default function ResultView({
  session,
  survey,
  responses
}: {
  session: Session | null
  survey: Survey
  responses: SurveyResponse[]
}) {
  const router = useRouter()
  const surveyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${survey.id}`
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
  }

  return (
    <div className="flex-col grow">
      <div className="flex-row flex w-full space-between items-center">
        <button
          className="my-4 w-20 sm:w-40 flex flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          onClick={() => {
            router.push('/profile')
          }}
        >
          <ArrowLeftIcon />
          <div className="pl-2 hidden sm:block">Profile</div>
        </button>

        {/* Add this new section for displaying the survey link */}
        <div className="flex-grow mx-4">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-md"></div>
        </div>

        <div className="flex justify-end">
          {/* Add this new button */}
          <button
            className="my-4 mr-4 w-10 sm:w-40 flex flex-row items-center justify-center rounded-md bg-green-600 p-2 text-sm font-semibold text-white hover:bg-green-700"
            type="button"
            onClick={() => exportToCSV(survey, responses)}
          >
            <IconDownload className="mx-1" />
            <div className="hidden sm:block">Export to CSV</div>
          </button>
          <button
            className="my-4 w-10 sm:w-40 flex flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            type="button"
            onClick={() => {
              deleteSurvey(survey.id)
              router.push('/profile')
            }}
          >
            <TrashIcon />
            <div className="pl-2 hidden sm:block">Delete Survey</div>
          </button>
        </div>
      </div>

      <Tabs
        defaultValue="question"
        className="flex flex-col items-center w-full"
      >
        <TabsList className="mx-auto">
          <TabsTrigger value="question">Results by Question</TabsTrigger>
          <TabsTrigger value="participant">Results by Participant</TabsTrigger>
        </TabsList>

        {/* Move the survey link section here */}
        <div className="w-full flex justify-center my-4">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-md">
            <span className="text-sm font-medium pl-2 py-1 text-gray-500 dark:text-gray-400">
              Survey Link:
            </span>
            <button
              onClick={handleCopy}
              className="text-blue-500 hover:text-blue-600 pr-2 py-1 transition-colors duration-200"
              title="Copy to clipboard"
            >
              <div className="flex flex-row items-center">
                <input
                  type="text"
                  value={surveyUrl}
                  readOnly
                  className="bg-transparent text-xs px-2 py-1 w-64 focus:outline-none"
                />
                {copied ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </div>
            </button>
          </div>
        </div>

        <TabsContent value="question" className="w-full lg:w-1/2">
          <ResultByQuestion survey={survey!} responses={responses!} />
        </TabsContent>
        <TabsContent value="participant" className="w-full lg:w-1/2">
          <ResultByParticipant survey={survey} responses={responses!} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
