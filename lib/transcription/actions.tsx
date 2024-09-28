'use server'

import { Readable } from 'stream'
import Groq, { toFile } from 'groq-sdk'
import { randomUUID } from 'crypto'
import { kv } from '@vercel/kv'
import fs from 'fs'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const file = await toFile(audioBlob, 'audio.mp3')
  // Create a transcription job
  const transcription = await groq.audio.transcriptions.create({
    file: file,
    model: 'whisper-large-v3',
    response_format: 'json',
    language: 'en',
    temperature: 0.0
  })
  console.log('Transcription:', transcription)

  return transcription.text
}
