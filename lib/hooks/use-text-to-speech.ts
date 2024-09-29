import { useCallback } from 'react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

export const useTextToSpeech = (model: string = 'aura-luna-en') => {
  const { load } = useGlobalAudioPlayer()

  const speakText = useCallback(
    async (text: string): Promise<void> => {
      if (!text.trim()) return

      try {
        const response = await fetch(`/api/speak?model=${model}`, {
          cache: 'no-store',
          method: 'POST',
          body: JSON.stringify({ text })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch audio')
        }
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        await new Promise<void>((resolve, reject) => {
          load(audioUrl, {
            autoplay: true,
            loop: false,
            format: 'mp3',
            onend: () => {
              resolve()
            }
          })
        })
      } catch (error) {
        console.error('Error in text-to-speech:', error)
        throw error // Re-throw the error to be handled by the caller
      }
    },
    [model, load]
  )

  return {
    speakText
  }
}
