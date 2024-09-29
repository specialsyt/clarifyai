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
      className="w-1/5 m-[20px] aspect-square bg-zinc-100 hover:bg-zinc-50 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 overflow-hidden"
      onClick={() => {
        router.push('/results/' + surveyInfo.id)
      }}
    >
      <div className=" flex flex-col justify-between p-4">
        <div className="text-2xl font-bold mb-2 line-clamp-2">
          {surveyInfo.name}
        </div>
        <div className="text-sm text-gray-600 line-clamp-3 overflow-ellipsis">
          {surveyInfo.description}
        </div>
      </div>
    </button>
  )
}
