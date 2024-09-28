'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { PlusIcon, Cross1Icon, CopyIcon } from '@radix-ui/react-icons'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Question, Session, Survey } from '@/lib/types'

interface Result {
  type: string
  resultCode: 'Valid Form' | 'Missing Fields' | 'Invalid Form'
}

export default function SurveySetup({session}: {session: Session | null }) {
  const router = useRouter()
  const [result, dispatch] = useFormState(validateForm, undefined)
  const [questions, setQuestions] = useState<Question[]>([
    {
      type: 'follow_up',
      goal: 'goal',
      id: 'abcdef123',
      text: 'text'
    },
    {
      type: 'informational',
      id: 'abcdef234',
      text: 'text'
    }
  ])

  const surveyId = crypto.randomUUID();

  async function validateForm(
    _prevState: Result | undefined,
    formData: FormData
  ): Promise<Result | undefined> {
    try {
      let questionsArr: Question[] = []
      questions.forEach(q => {
        if (formData.get('question type ' + q.id) == 'follow_up') {
          questionsArr.push({
            id: q.id,
            text: formData.get('question name ' + q.id) as string,
            type: 'follow_up',
            goal: formData.get('question answers ' + q.id) as string
          })
        } else {
          questionsArr.push({
            id: q.id,
            text: formData.get('question name ' + q.id) as string,
            type: 'informational'
          })
        }
      })

      const newSurvey: Survey = {
        id: surveyId,
        authorId: session?.user?.id || '',
        name: formData.get('surveyName') as string,
        description: formData.get('description') as string,
        questions: questionsArr
      }

      //TODO: Store the new survey somewhere
      console.log(newSurvey)

      return {
        type: 'success',
        resultCode: 'Valid Form'
      }
    } catch (error) {
      if (error) {
        console.log(error)
        return {
          type: 'error',
          resultCode: 'Invalid Form'
        }
      }
    }
  }

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode))
      } else {
        toast.success(getMessageFromCode(result.resultCode))
        router.refresh()
      }
    }
  }, [result, router])

  return (
    <div className="flex">
      <form action={dispatch} className="flex flex-col w-full items-center">
        <div className="flex w-full">
          <div className="w-full pt-[5px] pr-6">
            <div className="grow w-full rounded-lg border bg-white px-6 py-8 my-4 shadow-md dark:bg-zinc-950">
              <input
                className="peer block w-2/5 rounded-md border-b-2 bg-zinc-50 px-2 py-[9px] text-xl outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="surveyName"
                type="surveyName"
                name="surveyName"
                placeholder="Create a New Survey"
                required
              />
              <input
                className="peer block w-full rounded-md border-b-2 bg-zinc-50 px-2 py-[9px] mt-6 text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="description"
                type="description"
                name="description"
                placeholder="Survey Description"
              />
            </div>
            {questions.map(q => {
              let curr = q.id
              return (
                <div
                  key={curr}
                  className="grow w-full rounded-lg border bg-white px-6 py-8 my-4 shadow-md dark:bg-zinc-950"
                >
                  <div className="w-full flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const arr = questions.filter(q => {
                          return q.id != curr
                        })
                        setQuestions(arr)
                      }}
                    >
                      <Cross1Icon />
                    </button>
                  </div>
                  <div className="flex">
                    <input
                      className="peer block w-2/5 rounded-md border-b-2 bg-zinc-50 px-2 py-[9px] text-l outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                      id={'question ' + curr}
                      type="question"
                      name={'question name ' + curr}
                      placeholder="Question Name"
                      required
                    />
                    <div className="py-[9px] px-[9px]">
                      <Select
                        defaultValue="short"
                        name={'question type ' + curr}
                        required
                        onValueChange={val => {
                          const arr = questions.map(q => {
                            if (q.id == curr) {
                              return val == 'follow_up'
                                ? ({
                                    type: 'follow_up',
                                    goal: 'goal',
                                    id: q.id,
                                    text: q.text
                                  } as Question)
                                : ({
                                    type: 'informational',
                                    id: q.id,
                                    text: q.text
                                  } as Question)
                            } else {
                              return q
                            }
                          })
                          setQuestions(arr)
                        }}
                      >
                        <SelectTrigger className="w-[200px] peer border-b-2 bg-zinc-50 py-[9px] dark:border-zinc-800 dark:bg-zinc-950">
                          <SelectValue
                            className="text-l outline-none placeholder:text-zinc-500"
                            placeholder="Select Question Type"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="informational">Short</SelectItem>
                            <SelectItem value="follow_up">Long</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {q.type == 'follow_up' ? (
                    <div>
                      <input
                        className="peer block w-full rounded-md border-b-2 bg-zinc-50 px-2 py-[9px] mt-6 text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                        id={'question answers ' + curr}
                        type="description"
                        name={'question answers ' + curr}
                        placeholder="Question Answers"
                        required
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )
            })}
            <div className="h-full flex justify-center">
              <button
                type="button"
                className="my-4 flex h-10 w-10 flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                onClick={() => {
                  setQuestions(questions => [
                    ...questions,
                    {
                      type: 'informational',
                      // TODO How to come up with new question IDs
                      id: '' + questions[questions.length - 1].id + '1',
                      text: 'text'
                    } as Question
                  ])
                }}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
          <div className="sticky top-[100px] w-1/2 h-fit rounded-lg border bg-white px-6 py-8 my-4 shadow-md dark:bg-zinc-950">
            {/* <div className="flex pb-[40px]">
              <div className="pr-2">
                Link: {window.location.href}/{surveyId}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                }}
              >
                <CopyIcon />
              </button>
            </div> */}
            <div className="py-30">
              <CompleteButton />
              {/* TODO: pop up a modal/link after submit */}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function CompleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Complete'}
    </button>
  )
}
