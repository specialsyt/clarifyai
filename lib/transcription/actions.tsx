'use server'

import { Readable } from 'stream'
import Groq from 'groq-sdk'
import { randomUUID } from 'crypto'
import { kv } from '@vercel/kv'

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

    // Log the transcribed text
    console.log(transcription.text)

    return transcription.text
//   } catch (error) {
//     console.error('Error transcribing audio:', error)
//     throw new Error('Failed to transcribe audio')
//   }
}

// Helper function to convert Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
