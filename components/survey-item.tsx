'use client'

import { Survey } from '@/lib/types'

interface SurveyItemProps {
  surveyInfo: Survey
}

export default function SurveyItem({ surveyInfo }: SurveyItemProps) {
  console.log(surveyInfo)
  return (
    <button
      className="w-1/5 m-[20px] aspect-square bg-zinc-500"
      onClick={() => {}}
    ></button>
  )
}
