import fs from 'fs'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert Blob to Base64
    const base64Audio = await blobToBase64(audioBlob)

    // Create a transcription job
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(base64Audio), // Required path to audio file - replace with your audio file!
      model: 'distil-whisper-large-v3-en', // Required model to use for transcription
      prompt: 'Specify context or spelling', // Optional
      response_format: 'json', // Optional
      language: 'en', // Optional
      temperature: 0.0 // Optional
    })
    // Log the transcribed text
    console.log(transcription.text)

    return transcription.text
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw new Error('Failed to transcribe audio')
  }
}

// Helper function to convert Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
