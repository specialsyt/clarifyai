'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Survey } from '@/lib/types'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'
import { AudioVisualizer } from '@/components/audio-visualizer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  createClient,
  DeepgramClient,
  ListenLiveClient,
  LiveTranscriptionEvents
} from '@deepgram/sdk'
import { useLiveTranscription } from '@/lib/hooks/use-live-transcription'
import { log } from 'console'

export default function SessionPage() {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null)
  const [finalTranscript, setFinalTranscript] = useState<string>('')
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    mediaRecorder,
    error
  } = useLiveTranscription(setFinalTranscript)

  const testSurvey: Survey = {
    id: '1',
    authorId: '1',
    name: 'Test Survey',
    questions: [
      { id: '1', text: 'How was your day at camp?', type: 'informational' }
    ]
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
      setFinalTranscript('')
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
                <AudioVisualizer mediaRecorder={mediaRecorder} />
              ) : (
                <PlayIcon className="w-12 h-12" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-lg w-full text-slate-700">
        <h2 className="text-lg font-semibold mb-2">
          {isRecording ? 'Live Transcript:' : 'Final Transcript:'}
        </h2>
        <p>{isRecording ? transcript : finalTranscript}</p>
      </div>

      {!isRecording && finalTranscript && (
        <div className="mt-4">
          <Button onClick={() => setFinalTranscript('')}>
            Clear Transcript
          </Button>
        </div>
      )}
    </div>
  )
}
