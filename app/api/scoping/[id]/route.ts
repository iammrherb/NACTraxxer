import { type NextRequest, NextResponse } from "next/server"
import { updateQuestionnaire, deleteQuestionnaire } from "@/lib/api"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    const updated = await updateQuestionnaire(id, data)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating questionnaire:", error)
    return NextResponse.json({ error: "Failed to update questionnaire" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await deleteQuestionnaire(id)
    return NextResponse.json({ message: "Questionnaire deleted successfully" })
  } catch (error) {
    console.error("Error deleting questionnaire:", error)
    return NextResponse.json({ error: "Failed to delete questionnaire" }, { status: 500 })
  }
}
