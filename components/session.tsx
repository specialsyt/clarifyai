'use client'

import { useLiveTranscription } from '@/lib/hooks/use-live-transcription'
import { Survey, SurveySession } from '@/lib/types'
import { PlayIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { AudioVisualizer } from '@/components/audio-visualizer'
import { useSurveyController } from '@/lib/hooks/use-survey-controller'
import { useTextToSpeech } from '@/lib/hooks/use-text-to-speech'
import { evaluateUserResponse } from '@/lib/surveyAnalysis/llm'

export default function Session({
  surveySession,
  survey
}: {
  surveySession: SurveySession
  survey: Survey
}) {
  const {
    currentQuestion,
    parentQuestion,
    setCurrentQuestionResponse,
    addFollowUpQuestion,
    nextQuestion,
    startSurvey,
    done
  } = useSurveyController(survey)

  const { speakText } = useTextToSpeech()

  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    mediaRecorder,
    error
  } = useLiveTranscription()

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startSurvey()
    }
  }

  useEffect(() => {
    ;(async () => {
      if (currentQuestion) {
        console.log('parentQuestion', parentQuestion)
        await speakText(currentQuestion.text)
        const transcript = await startRecording()
        if (!transcript) {
          return
        }
        const fullTranscript = setCurrentQuestionResponse(transcript)
        if (!fullTranscript) {
          return
        }
        if (parentQuestion?.type !== 'follow_up') {
          nextQuestion()
          return
        }

        const followUpQuestion = await evaluateUserResponse(
          fullTranscript,
          parentQuestion
        )
        if (followUpQuestion) {
          console.log('followUpQuestion', followUpQuestion)
          addFollowUpQuestion(followUpQuestion)
          return
        }
        nextQuestion()
      }
    })()
  }, [currentQuestion])

  useEffect(() => {
    if (done) {
      speakText(
        'Thank you for completing this survey! Your results have been saved.'
      )
    }
  }, [done])

  return done ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-8">{survey?.name}</h1>
      Thanks for completing this survey! Your results have been saved.
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-8">{survey?.name}</h1>

      <div className="mb-8 text-xl">{currentQuestion?.text}</div>
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
        <h2 className="text-lg font-semibold mb-2">Live Transcript:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  )
}
