'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Survey } from '@/lib/types'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'
import { AudioVisualizer } from '@/components/audio-visualizer'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, ListenLiveClient } from '@deepgram/sdk'

export default function CampFeedback() {
  const [isRecording, setIsRecording] = useState(false)
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  const [transcriptionSocket, setTranscriptionSocket] =
    useState<ListenLiveClient | null>(null)
  const [transcript, setTranscript] = useState<string>('')

  const testSurvey: Survey = {
    id: '1',
    authorId: '1',
    name: 'Test Survey',
    questions: [
      { id: '1', text: 'How was your day at camp?', type: 'informational' }
    ]
  }

  useEffect(() => {
    setSurvey(testSurvey)
    const deepgramClient = createClient(
      process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
    )
    const socket = deepgramClient.listen.live({
      model: 'nova',
      smart_format: true
    })
    setTranscriptionSocket(socket)
  }, [])

  const startRecording = async () => {
    if (transcriptionSocket) {
      transcriptionSocket.on('open', async () => {
        console.log('client: connected to websocket')

        transcriptionSocket.on('Results', data => {
          console.log(data)

          const newTranscript = data.channel.alternatives[0].transcript

          if (newTranscript !== '') {
            setTranscript(newTranscript)
          }
        })

        transcriptionSocket.on('error', e => console.error(e))

        transcriptionSocket.on('warning', e => console.warn(e))

        transcriptionSocket.on('Metadata', e => console.log(e))

        transcriptionSocket.on('close', e => console.log(e))
      })
    }
    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Set up audio context and analyser
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      analyserRef.current = analyser

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
        transcriptionSocket?.send(event.data)
      }
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
      mediaRecorder.start()
      setIsRecording(true)
      setCurrentQuestion(0)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setCurrentQuestion(null)
    }
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-8">{survey?.name}</h1>
      {currentQuestion !== null ? (
        <div className="mb-8 text-xl">
          {survey?.questions[currentQuestion].text}
        </div>
      ) : (
        <div className="mb-8 text-xl">Text</div>
      )}
      <motion.div
        animate={{
          width: isRecording ? 200 : 96,
          height: 96
        }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          size="lg"
          className="w-full h-full rounded-full transition-all duration-300 relative overflow-hidden"
          onClick={handleClick}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isRecording ? 'visualizer' : 'play'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isRecording ? (
                <AudioVisualizer mediaRecorder={mediaRecorderRef.current} />
              ) : (
                <PlayIcon className="w-12 h-12" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>
      <canvas ref={canvasRef} width="300" height="100" className="mt-4" />
      {audioURL && (
        <audio className="mt-4" controls src={audioURL}>
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-lg w-full text-slate-700">
        <h2 className="text-lg font-semibold mb-2">Transcript:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  )
}
