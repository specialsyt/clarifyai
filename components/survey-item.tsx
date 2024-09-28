'use client'

import { Survey } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface SurveyItemProps {
  surveyInfo: Survey
}

export default function SurveyItem({ surveyInfo }: SurveyItemProps) {
  const router = useRouter()

  return (
    <button
      className="w-1/5 m-[20px] aspect-square bg-zinc-200 hover:bg-zinc-100"
      onClick={() => {
        router.push('/results/' + surveyInfo.id)
      }}
    >
      <div className="h-full flex-row justify-start">
        <div className="text-3xl p-4">{surveyInfo.name}</div>
        <div>{surveyInfo.description}</div>
      </div>
    </button>
  )
}
