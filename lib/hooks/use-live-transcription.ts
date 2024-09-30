'use client'

import { useState, useEffect, useRef } from 'react'
import {
  createClient,
  DeepgramClient,
  LiveTranscriptionEvents,
  LiveClient
} from '@deepgram/sdk'

// Types
type TranscriptionHookResult = {
  isRecording: boolean
  transcript: string
  error: string | null
  startRecording: () => Promise<string | undefined>
  stopRecording: () => void
  mediaRecorder: MediaRecorder | null
}

// Constants
const DEEPGRAM_CONFIG = {
  model: 'nova-2',
  interim_results: true,
  language: 'en-US',
  smart_format: true,
  utterance_end_ms: 1000,
  vad_events: true,
  endpointing: 1000
}

export function useLiveTranscription(): TranscriptionHookResult {
  // State
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState<string>('')
  const [deepgramClient, setDeepgramClient] = useState<DeepgramClient | null>(
    null
  )
  const [transcriptionSocket, setTranscriptionSocket] =
    useState<LiveClient | null>(null)
  const [speechEnd, setSpeechEnd] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const onSpeechEndResolve = useRef<((transcript: string) => void) | null>(null)

  // Initialize Deepgram client
  useEffect(() => {
    if (!deepgramClient) {
      const client = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY)
      setDeepgramClient(client)
    }
  }, [])

  useEffect(() => {
    if (speechEnd) {
      onSpeechEndResolve.current?.(transcript)
      setSpeechEnd(false)
    }
  }, [speechEnd, transcript])

  const setupTranscriptionSocketListeners = (
    transcriptionSocket: LiveClient
  ) => {
    transcriptionSocket.on(LiveTranscriptionEvents.Open, () => {
      transcriptionSocket.on(
        LiveTranscriptionEvents.Transcript,
        handleTranscript
      )
      transcriptionSocket.on(LiveTranscriptionEvents.Error, handleError)
      transcriptionSocket.on(LiveTranscriptionEvents.Metadata, handleMetadata)
      transcriptionSocket.on(LiveTranscriptionEvents.Close, handleClose)
      transcriptionSocket.on(
        LiveTranscriptionEvents.UtteranceEnd,
        handleUtteranceEnd
      )
    })
  }

  const handleTranscript = (data: any) => {
    if (data.is_final) {
      setTranscript(
        prev => prev + ' ' + data.channel.alternatives[0].transcript
      )
    }
    if (data.speech_final) {
      stopRecording()
    }
  }

  const handleError = (e: Error) => {
    setError('Error in WebSocket connection')
  }
  const handleMetadata = (metadata: any) => {}
  const handleClose = () => {}
  const handleUtteranceEnd = () => {
    stopRecording()
  }

  const startRecording = async () => {
    if (!deepgramClient) {
      console.warn('Deepgram client not initialized')
      setError('Deepgram client not initialized')
      return
    }
    console.log('starting recording')

    setTranscript('')

    const transcriptionSocket = deepgramClient.listen.live(DEEPGRAM_CONFIG)
    setupTranscriptionSocketListeners(transcriptionSocket)
    setTranscriptionSocket(transcriptionSocket)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      // Check if MediaRecorder is supported
      if (typeof MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder is not supported in this browser')
      }

      // Try different MIME types
      const mimeTypes = [
        'audio/webm',
        'audio/mp4',
        'audio/wav',
        'audio/ogg',
        'audio/mpeg'
      ]
      let supportedMimeType = null

      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          supportedMimeType = type
          break
        }
      }

      if (!supportedMimeType) {
        throw new Error('No supported MIME type found for MediaRecorder')
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = handleDataAvailable(transcriptionSocket)

      mediaRecorder.start(1000)
      setIsRecording(true)
      return await new Promise<string>(resolve => {
        onSpeechEndResolve.current = resolve
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      setError(`Error accessing microphone: ${errorMessage}`)
      console.error('Error accessing microphone', error)
    }
  }

  const handleDataAvailable =
    (transcriptionSocket: LiveClient) => (event: BlobEvent) => {
      transcriptionSocket?.send(event.data)
    }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    if (transcriptionSocket) {
      transcriptionSocket.requestClose()
      setTranscriptionSocket(null)
    }
    setIsRecording(false)
    setSpeechEnd(true)
  }

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    mediaRecorder: mediaRecorderRef.current,
    error
  }
}
