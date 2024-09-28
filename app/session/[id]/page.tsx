'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Survey } from '@/lib/types'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'
import { LiveAudioVisualizer } from 'react-audio-visualize'
import { AudioVisualizer } from '@/components/audio-visualizer'
import { motion, AnimatePresence } from 'framer-motion'
import { transcribeAudio } from '@/lib/transcription/actions'

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
  }, [])

  const startRecording = async () => {
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
      }
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

        const transcriptionResponse = await fetch(
          `${window.location.pathname}/audioUpload`,
          {
            method: 'POST',
            body: audioBlob
          }
        )
        const transcription = await transcriptionResponse.json()
        console.log(transcription)
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
    </div>
  )
}
