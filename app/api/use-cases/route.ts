import { type NextRequest, NextResponse } from "next/server"
import { getAllUseCases, createUseCase } from "@/lib/data"

export async function GET() {
  try {
    const useCases = await getAllUseCases()
    return NextResponse.json(useCases)
  } catch (error) {
    console.error("Error in GET /api/use-cases:", error)
    return NextResponse.json({ error: "Failed to fetch use cases" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const useCase = await createUseCase(body)
    return NextResponse.json(useCase, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/use-cases:", error)
    return NextResponse.json({ error: "Failed to create use case" }, { status: 500 })
  }
}
