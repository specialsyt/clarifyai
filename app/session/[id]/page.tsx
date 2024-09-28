'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Survey } from '@/lib/types'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'

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
      mediaRecorder.onstop = () => {
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
      drawWaveform()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const drawWaveform = () => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      const width = canvas.width
      const height = canvas.height

      analyser.getByteTimeDomainData(dataArray)

      ctx.fillStyle = 'rgb(200, 200, 200)'
      ctx.fillRect(0, 0, width, height)

      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.beginPath()

      const sliceWidth = (width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
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
      {currentQuestion !== null && (
        <div className="mb-8 text-xl">
          {survey?.questions[currentQuestion].text}
        </div>
      )}
      <Button
        variant="outline"
        size="lg"
        className="w-24 h-24 rounded-full"
        onClick={handleClick}
      >
        {isRecording ? <StopIcon /> : <PlayIcon />}
      </Button>

      <canvas ref={canvasRef} width="300" height="100" className="mt-4" />

      {audioURL && (
        <audio className="mt-4" controls src={audioURL}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  )
}
