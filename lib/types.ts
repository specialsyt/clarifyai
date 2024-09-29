import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
  firstName: string
  lastName: string
}
export type QuestionBase = {
  id: string
  text: string
}

export type InformationalQuestion = QuestionBase & {
  type: 'informational'
}

export type EnhancedQuestion = QuestionBase & {
  type: 'follow_up'
  goals: string[]
  timesFollowedUp: number[]
  num_followups: number
}

export type ChildQuestion = QuestionBase & {
  type: 'child'
  parentId: string
}

export type Question = InformationalQuestion | EnhancedQuestion | ChildQuestion

export type Survey = {
  id: string
  authorId: string
  name: string
  description: string
  questions: Question[]
}

export type LLMEvaluationResponse = {
  text: string
  indicies: number[]
}

export type QuestionResponse = {
  parentId: string
  id: string
  question: string
  response: string
}

export type SurveyResponse = {
  id: string
  surveyId: string
  responses: QuestionResponse[]
}

export enum TranscriptRole {
  PARTICIPANT = 'participant',
  INTERVIEWER = 'interviewer'
}

export type SurveySession = {
  id: string
  surveyId: string
  completed: boolean
  createdAt: string
}
