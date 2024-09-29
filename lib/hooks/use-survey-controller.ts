import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  QuestionResponse,
  Survey,
  SurveyResponse,
  QuestionBase,
  Question
} from '../types'
import { makeTranscript } from '../utils'
import { saveSurveyResponse } from '../db/survey'
import { useAuthId } from './use-user-auth'

export function useSurveyController(sessionId: string, survey: Survey) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [parentQuestion, setParentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    console.log('responses', responses)
  }, [responses])

  useEffect(() => {
    console.log('currentQuestion', currentQuestion)
  }, [currentQuestion])

  const setCurrentQuestionResponse = (response: string) => {
    if (!currentQuestion) {
      return
    }
    const newResponses = [
      ...responses,
      {
        parentId: survey.questions[currentQuestionIndex].id,
        id: currentQuestion.id,
        question: currentQuestion.text,
        response
      }
    ]
    setResponses(newResponses)
    return makeTranscript(newResponses)
  }
  const addFollowUpQuestion = (question: string) => {
    setCurrentQuestion({
      id: crypto.randomUUID(),
      text: question,
      type: 'child',
      parentId: parentQuestion?.id || ''
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
    setParentQuestion(survey.questions[currentQuestionIndex])
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

  return {
    currentQuestion,
    parentQuestion,
    setCurrentQuestionResponse,
    addFollowUpQuestion,
    nextQuestion,
    startSurvey,
    done
  }
}
