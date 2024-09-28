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
}

export type Question = InformationalQuestion | EnhancedQuestion

export type Survey = {
  id: string
  authorId: string
  name: string
  description: string
  questions: Question[]
}
