import { transcribeAudio } from '@/lib/transcription/actions'
import { NextApiRequest } from 'next'
import React from 'react'

export async function POST(request: NextApiRequest) {
  const audioBlobData = request.body
  // convert audioBlobData to Blob
  const audioBlob = new Blob([audioBlobData], { type: 'audio/webm' })
  const transcription = await transcribeAudio(audioBlob)
  return new Response(transcription)
}
