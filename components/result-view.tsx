'use client'

import { deleteSurvey } from '@/lib/db/survey'
import { Session, Survey, SurveyResponse } from '@/lib/types'
import { ArrowLeftIcon, CopyIcon, TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ResultByQuestion from './result-by-question'
import ResultByParticipant from './result-by-participant'

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

  const validUser = session?.user?.id == survey.authorId
  if (!validUser) router.push('/')

  return validUser ? (
    <div className="flex-col grow">
      <div className="flex-row flex w-full space-between">
        <button
          className="my-4 w-40 flex flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          onClick={() => {
            router.push('/profile')
          }}
        >
          <ArrowLeftIcon />
          <div className="pl-2">Back to profile</div>
        </button>
        <div className="flex w-full justify-end">
          <button
            className="my-4 w-40 flex flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
      </div>
      <Tabs defaultValue="question" className="flex flex-col justify-center">
        <TabsList>
          <TabsTrigger value="question">Results by Question</TabsTrigger>
          <TabsTrigger value="participant">Results by Participant</TabsTrigger>
        </TabsList>
        <TabsContent value="question">
          <ResultByQuestion survey={survey!} responses={responses!} />
        </TabsContent>
        <TabsContent value="participant">
          <ResultByParticipant survey={survey} responses={responses!}/>
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <></>
  )
}
