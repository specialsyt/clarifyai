import { useCallback, useRef, useState, useEffect } from 'react'
import { Howl } from 'howler'

export const useTextToSpeech = (model: string = 'aura-luna-en') => {
  const soundRef = useRef<Howl | null>(null)
  const [isAudioContextInitialized, setIsAudioContextInitialized] =
    useState(false)

  useEffect(() => {
    const initializeAudioContext = () => {
      if (!isAudioContextInitialized) {
        // Create a temporary Howl instance to initialize the audio context
        const tempSound = new Howl({
          src: [
            'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
          ]
        })
        tempSound.play()
        tempSound.stop()
        setIsAudioContextInitialized(true)
        document.removeEventListener('click', initializeAudioContext)
      }
    }

    document.addEventListener('click', initializeAudioContext)
    return () => {
      document.removeEventListener('click', initializeAudioContext)
    }
  }, [])

  const speakText = useCallback(
    async (text: string): Promise<void> => {
      if (!text.trim() || !isAudioContextInitialized) return

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

        // Stop and unload any existing sound
        if (soundRef.current) {
          soundRef.current.stop()
          soundRef.current.unload()
        }

        // Create a new Howl instance
        soundRef.current = new Howl({
          src: [audioUrl],
          format: ['mp3'],
          html5: true,
          onend: () => {
            URL.revokeObjectURL(audioUrl)
          },
          onloaderror: (id, error) => {
            console.error('Error loading audio:', error)
            URL.revokeObjectURL(audioUrl)
          },
          onplayerror: (id, error) => {
            console.error('Error playing audio:', error)
            URL.revokeObjectURL(audioUrl)
          }
        })

        // Play the sound
        soundRef.current.play()

        // Return a promise that resolves when the sound finishes playing
        return new Promise<void>((resolve, reject) => {
          if (soundRef.current) {
            soundRef.current.on('end', () => resolve())
            soundRef.current.on('loaderror', (id, error) => reject(error))
            soundRef.current.on('playerror', (id, error) => reject(error))
          } else {
            reject(new Error('Sound not initialized'))
          }
        })
      } catch (error) {
        console.error('Error in text-to-speech:', error)
        throw error
      }
    },
    [model, isAudioContextInitialized]
  )

  return {
    speakText,
    isAudioContextInitialized
  }
}
