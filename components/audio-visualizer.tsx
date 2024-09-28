import { useRef, useEffect } from 'react'
import { LiveAudioVisualizer } from 'react-audio-visualize'

interface AudioVisualizerProps {
  mediaRecorder: MediaRecorder | null
}

export function AudioVisualizer({ mediaRecorder }: AudioVisualizerProps) {
  return (
    <>
      {mediaRecorder && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder}
          width={180} // Slightly smaller than the button width
          height={75}
          smoothingTimeConstant={0.85}
          minDecibels={-70}
          maxDecibels={0}
          barWidth={2}
          barColor={'#FFFFFF'}
        />
      )}
    </>
  )
}
