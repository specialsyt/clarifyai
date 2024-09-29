import { useEffect, useState } from 'react'
import {
  QuestionResponse,
  Survey,
  SurveyResponse,
  QuestionBase
} from '../types'
import { makeTranscript } from '../utils'
import { _saveSurveyResponse, saveSurveyResponse } from '../db/survey'
import { useAuthId } from './use-user-auth'

export function useSurveyController(sessionId: string, survey: Survey) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBase | null>(
    null
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [done, setDone] = useState(false)
  // const { authId } = useAuthId()
  const setCurrentQuestionResponse = (response: string) => {
    if (!currentQuestion) {
      return
    }
    setResponses(prev => [
      ...prev,
      {
        parentId: survey.questions[currentQuestionIndex].id,
        id: currentQuestion.id,
        question: currentQuestion.text,
        response
      }
    ])
  }
  const addFollowUpQuestion = (question: string) => {
    setCurrentQuestion({
      id: crypto.randomUUID(),
      text: question
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIndex === survey.questions.length - 1) {
      endSurvey()
      return
    }
    setCurrentQuestionIndex(prev => prev + 1)
  }

  const startSurvey = () => {
    setCurrentQuestionIndex(0)
  }

  useEffect(() => {
    setCurrentQuestion(survey.questions[currentQuestionIndex])
  }, [currentQuestionIndex])

  const saveSurvey = async () => {
    const surveyResponse: SurveyResponse = {
      id: survey.id,
      surveyId: survey.id,
      responses: responses
    }
    await saveSurveyResponse(sessionId, survey.id, surveyResponse)
  }

  const endSurvey = () => {
    setDone(true)
    saveSurvey()
  }

  const getTranscript = () => {
    return makeTranscript(responses)
  }

  return {
    currentQuestion: currentQuestion?.text,
    setCurrentQuestionResponse,
    addFollowUpQuestion,
    nextQuestion,
    getTranscript,
    startSurvey,
    done
  }
}
