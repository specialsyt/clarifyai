'use server'

import { Readable } from 'stream'
import Groq from 'groq-sdk'
import { randomUUID } from 'crypto'
import { kv } from '@vercel/kv'
import fs from 'fs'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  {
    // Create a temporary file URL
    const audioFile = new File([audioBlob], 'audio.webm', {
      type: 'audio/webm'
    })

    // Create a transcription job
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'distil-whisper-large-v3-en',
      prompt: 'Specify context or spelling',
      response_format: 'json',
      language: 'en',
      temperature: 0.0
    })
    return transcription.text
  }
}
