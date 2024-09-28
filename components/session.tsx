'use client'

import { deleteSurvey } from '@/lib/db/survey'
import { useLiveTranscription } from '@/lib/hooks/use-live-transcription'
import { Survey } from '@/lib/types'
import {
  ArrowLeftIcon,
  CopyIcon,
  PlayIcon,
  TrashIcon
} from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { AudioVisualizer } from '@/components/audio-visualizer'

export default function Session({ survey }: { survey: Survey }) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1)
  const [finalTranscript, setFinalTranscript] = useState<string>('')
  const [questionToRead, setQuestionToRead] = useState<string>('')
  const [done, setDone] = useState(false)
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    mediaRecorder,
    error
  } = useLiveTranscription(setFinalTranscript)

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
      setFinalTranscript('')
    }
  }

  useEffect(() => {
    setQuestionToRead(survey?.questions[currentQuestion]?.text)
  }, [currentQuestion])

  const foo = (a: any) => {
    return true
  }

  useEffect(() => {
    if (!isRecording) {
      if (foo(finalTranscript)) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setQuestionToRead('advice')
      }
    }
    if (currentQuestion == survey.questions.length - 1 && !isRecording) {
      setDone(true)
    }
  }, [isRecording])

  return done ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-8">{survey?.name}</h1>
      Thanks for completing this survey! Your results have been saved.
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-8">{survey?.name}</h1>

      <div className="mb-8 text-xl">{questionToRead}</div>
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
