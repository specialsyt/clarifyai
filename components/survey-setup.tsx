'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { useRouter } from 'next/navigation'
import { PlusIcon, Cross1Icon } from '@radix-ui/react-icons'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Question, Session, Survey } from '@/lib/types'
import { createSurvey } from '@/lib/db/survey'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { v4 as uuidv4 } from 'uuid'

interface Result {
  type: string
  resultCode: 'Valid Form' | 'Missing Fields' | 'Invalid Form'
}

export default function SurveySetup({ session }: { session: Session }) {
  const router = useRouter()
  const [result, dispatch] = useFormState(validateForm, undefined)
  const [questions, setQuestions] = useState<Question[]>([])

  const [surveyId, setSurveyId] = useState(uuidv4())

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
            goals: (formData.get('question answers ' + q.id) as string).split(
              ','
            ),
            timesFollowedUp: (
              formData.get('question answers ' + q.id) as string
            )
              .split(',')
              .map(_ => 0),
            num_followups: 0
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
        authorId: session.user.id,
        name: formData.get('surveyName') as string,
        description: formData.get('description') as string,
        questions: questionsArr
      }

      await createSurvey(session, newSurvey)
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
        toast.error('Invalid form, please try again!')
      } else {
        toast.success('Survey created!')
        router.push(`/results/${surveyId}`)
      }
    }
  }, [result, router, questions])

  return (
    <div className="container lg:w-1/2  px-4 py-8">
      <form action={dispatch} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                id="surveyName"
                name="surveyName"
                placeholder="Survey Name"
                required
              />
              <Textarea
                id="description"
                name="description"
                placeholder="Survey Description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {questions.map((q, index) => (
          <Card key={q.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <Input
                  className="w-2/3"
                  id={`question ${q.id}`}
                  name={`question name ${q.id}`}
                  placeholder="Question Name"
                  required
                />
                <Select
                  defaultValue="informational"
                  name={`question type ${q.id}`}
                  onValueChange={val => {
                    const arr = questions.map(question => {
                      if (question.id === q.id) {
                        return val === 'follow_up'
                          ? {
                              ...question,
                              type: 'follow_up',
                              goals: []
                            }
                          : {
                              ...question,
                              type: 'informational'
                            }
                      }
                      return question
                    })
                    setQuestions(arr as Question[])
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const arr = questions.filter(questions => {
                      return questions.id !== q.id
                    })
                    setQuestions(arr)
                  }}
                >
                  <Cross1Icon className="h-4 w-4" />
                </Button>
              </div>
              {q.type == 'follow_up' ? (
                <Input
                  id={'question answers ' + q.id}
                  type="description"
                  name={'question answers ' + q.id}
                  placeholder="Comma Delimited Goals"
                  required
                />
              ) : (
                <></>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => {
              setQuestions(questions => [
                ...questions,
                {
                  type: 'informational',
                  id: uuidv4(),
                  text: 'text'
                } as Question
              ])
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>

        <div className="sticky top-[100px] flex justify-center">
          <CompleteButton />
        </div>
      </form>
    </div>
  )
}

function CompleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <IconSpinner className="mr-2 h-4 w-4" /> : null}
      {pending ? 'Creating...' : 'Complete'}
    </Button>
  )
}
