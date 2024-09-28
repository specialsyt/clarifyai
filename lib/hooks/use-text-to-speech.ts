import { useCallback } from 'react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

export const useTextToSpeech = (model: string = 'aura-asteria-en') => {
  const { load } = useGlobalAudioPlayer()

  const speakText = useCallback(
    async (text: string) => {
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
        load(audioUrl, {
          autoplay: true,
          loop: false,
          format: 'mp3',
          onend: () => {
            console.log('Audio playback completed')
          }
        })
      } catch (error) {
        console.error('Error in text-to-speech:', error)
      }
    },
    [model, load]
  )

  return {
    speakText
  }
}
