import { transcribeAudio } from '@/lib/transcription/actions'
import { NextApiRequest } from 'next'

export async function POST(request: NextApiRequest) {
  const audioBlobData = request.body
  // convert audioBlobData to Blob
  const audioBlob = new Blob([audioBlobData], { type: 'audio/mp3' })
  const transcription = await transcribeAudio(audioBlob)
  return new Response(transcription)
}
