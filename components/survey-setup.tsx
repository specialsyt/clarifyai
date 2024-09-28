'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/login/actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { QuestionType, ValidQuestionTypes } from '@/lib/types'
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

export default function SurveySetup() {
  const router = useRouter()
  const [result, dispatch] = useFormState(authenticate, undefined)
  const [questions, setQuestions] = useState<QuestionType[]>([
    { type: 'short' },
    { type: 'short' }
  ])

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
      <form action={dispatch} className="flex flex-col w-2/3 items-center">
        <div className="grow w-2/3 rounded-lg border bg-white px-6 py-8 my-4 shadow-md dark:bg-zinc-950">
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
          let index = questions.indexOf(q)
          return (
            <div
              key={'' + index}
              className="grow w-2/3 rounded-lg border bg-white px-6 py-8 my-4 shadow-md dark:bg-zinc-950"
            >
              <button
                type="button"
                className="w-full flex justify-end"
                // need to fix bug here after merges but i think it works
                onClick={() => {
                  const arr = [...questions]
                  console.log(arr)
                  arr.splice(index, 1)
                  setQuestions(arr)
                  console.log(arr)
                }}
              >
                <Cross1Icon />
              </button>
              <div className="flex">
                <input
                  className="peer block w-2/5 rounded-md border-b-2 bg-zinc-50 px-2 py-[9px] text-l outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                  id={'question ' + index}
                  type="question"
                  name={'question ' + index}
                  placeholder="Question Name"
                  required
                />
                <div className="py-[9px] px-[9px]">
                  <Select
                    defaultValue="short"
                    onValueChange={val => {
                      const arr = [...questions]
                      arr[index] = {
                        type: val as unknown as ValidQuestionTypes
                      }
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
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {q.type == 'short' ? (
                <div>
                  <input
                    className="peer block w-full rounded-md border-b-2 bg-zinc-50 px-2 py-[9px] mt-6 text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                    id={'question ' + index + ' answers'}
                    type="description"
                    name={'question ' + index + ' answers'}
                    placeholder="Question Answers"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          )
        })}
        <button
          type="button"
          className="my-4 flex h-10 w-10 flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          onClick={() => {
            setQuestions(questions => [...questions, { type: 'short' }])
          }}
        >
          <PlusIcon />
        </button>
      </form>

      <div className="sticky top-[100px] w-1/4 h-full rounded-lg border bg-white px-6 py-8 my-4 shadow-md dark:bg-zinc-950">
        <div className="flex pb-[40px]">
          <h2 className="pr-2">Link: {window.location.href}</h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
            }}
          >
            <CopyIcon />
          </button>
        </div>
        <CompleteButton />
      </div>
    </div>
  )
}

function CompleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Complete'}
    </button>
  )
}
