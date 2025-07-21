import { type NextRequest, NextResponse } from "next/server"
import { getQuestionnaires, createQuestionnaire } from "@/lib/api"

export async function GET() {
  try {
    const questionnaires = await getQuestionnaires()
    return NextResponse.json(questionnaires)
  } catch (error) {
    console.error("Error fetching questionnaires:", error)
    return NextResponse.json({ error: "Failed to fetch questionnaires" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newQuestionnaire = await createQuestionnaire(data)
    return NextResponse.json(newQuestionnaire, { status: 201 })
  } catch (error) {
    console.error("Error creating questionnaire:", error)
    return NextResponse.json({ error: "Failed to create questionnaire" }, { status: 500 })
  }
}
