import { useEffect, useState } from 'react'
import { QuestionResponse, Survey, SurveyResponse, Question } from '../types'
import { makeTranscript } from '../utils'
import { saveSurveyResponse } from '../db/survey'
import { useAuthId } from './use-user-auth'

export function useSurveyController(survey: Survey) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [parentQuestion, setParentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [done, setDone] = useState(false)
  const { authId } = useAuthId()
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
      text: question,
      type: 'child',
      parentId: survey.questions[currentQuestionIndex].id
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
    if (authId) {
      const surveyResponse: SurveyResponse = {
        id: survey.id,
        surveyId: survey.id,
        userId: authId,
        responses: responses
      }
      await saveSurveyResponse(survey.id, authId, surveyResponse)
    }
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
    parentQuestion: parentQuestion,
    setCurrentQuestionResponse,
    addFollowUpQuestion,
    nextQuestion,
    getTranscript,
    startSurvey,
    done
  }
}
