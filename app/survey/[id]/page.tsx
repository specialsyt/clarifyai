import Session from '@/components/session'
import { getSurvey } from '@/lib/db/survey'
import { redirect } from 'next/navigation'

export default async function SurveyPage({
  params
}: {
  params: { id: string }
}) {
  const survey = await getSurvey(params.id)
  if (!survey) {
    return <div>Survey not found</div>
  }
  console.log(survey)
  const sessionUUID = crypto.randomUUID()

  redirect(`/session/${sessionUUID}`)

  return (
    <main className="flex flex-col p-4">
      <Session survey={survey!} />
    </main>
  )
}
