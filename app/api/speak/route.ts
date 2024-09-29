import { createClient } from '@deepgram/sdk'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SpeechCreateParams } from 'openai/resources/audio/speech'

export const revalidate = 0

/**
 * Return a stream from the API
 * @param {NextRequest} req - The HTTP request
 * @returns {Promise<NextResponse>} A NextResponse with the streamable response
 */
export async function POST(request: NextRequest) {
  return deepgram_POST(request)
}

async function deepgram_POST(request: NextRequest) {
  // gotta use the request object to invalidate the cache every request :vomit:
  const url = request.url
  const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? '')

  const model = request.nextUrl.searchParams.get('model') ?? 'aura-asteria-en'
  const message = await request.json()

  console.log(model, message)

  const result = await deepgram.speak.request(message, { model })
  const stream = await result.getStream()
  const headers = await result.getHeaders()

  const response = new NextResponse(stream, { headers })
  response.headers.set('Surrogate-Control', 'no-store')
  response.headers.set(
    'Cache-Control',
    's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  response.headers.set('Expires', '0')

  return response
}

async function openai_POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const message = await request.json()
  const voice: SpeechCreateParams['voice'] = 'nova'

  const text = message.text

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: voice,
    input: message
  })

  const stream = await response.body
  const headers = {
    'Content-Type': 'audio/mpeg'
  }

  const nextResponse = new NextResponse(stream, { headers })
  nextResponse.headers.set('Surrogate-Control', 'no-store')
  nextResponse.headers.set(
    'Cache-Control',
    's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  nextResponse.headers.set('Expires', '0')

  return nextResponse
}
