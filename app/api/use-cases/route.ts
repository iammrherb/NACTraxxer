import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    // This query joins the use_cases table with related tables and aggregates the related data into JSON arrays.
    const useCases = await sql`
    SELECT 
      uc.*,
      COALESCE(
        (SELECT json_agg(t) FROM test_cases t WHERE t.use_case_id = uc.id),
        '[]'::json
      ) as test_cases,
      COALESCE(
        (SELECT json_agg(d) FROM documentation_links d WHERE d.use_case_id = uc.id),
        '[]'::json
      ) as documentation_links,
      COALESCE(
        (SELECT json_agg(s) FROM success_criteria s WHERE s.use_case_id = uc.id),
        '[]'::json
      ) as success_criteria,
      COALESCE(
        (SELECT json_agg(r) FROM requirements r JOIN use_case_requirements ucr ON r.id = ucr.requirement_id WHERE ucr.use_case_id = uc.id),
        '[]'::json
      ) as requirements
    FROM use_cases uc
    ORDER BY uc.created_at DESC
  `
    return NextResponse.json(useCases)
  } catch (error) {
    console.error("Error fetching use cases:", error)
    return NextResponse.json({ message: "Error fetching use cases" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const useCaseData = await request.json()

    // If no ID is provided, generate a new one.
    if (!useCaseData.id) {
      const lastUseCaseResult = await sql`SELECT id FROM use_cases ORDER BY id DESC LIMIT 1`
      let newId = "UC-001"
      if (lastUseCaseResult.length > 0 && lastUseCaseResult[0].id) {
        const lastId = lastUseCaseResult[0].id
        const lastIdNumMatch = lastId.match(/\d+$/)
        if (lastIdNumMatch) {
          const lastIdNum = Number.parseInt(lastIdNumMatch[0])
          newId = `UC-${(lastIdNum + 1).toString().padStart(3, "0")}`
        }
      }
      useCaseData.id = newId
    }

    const [newUseCase] = await sql`
    INSERT INTO use_cases (
      id, title, subtitle, description, category, status, priority, completion_percentage, notes
    ) VALUES (
      ${useCaseData.id}, 
      ${useCaseData.title}, 
      ${useCaseData.subtitle}, 
      ${useCaseData.description}, 
      ${useCaseData.category}, 
      ${useCaseData.status}, 
      ${useCaseData.priority}, 
      ${useCaseData.completion_percentage}, 
      ${useCaseData.notes}
    )
    RETURNING *
  `
    return NextResponse.json(newUseCase, { status: 201 })
  } catch (error) {
    console.error("Error creating use case:", error)
    return NextResponse.json({ message: "Error creating use case" }, { status: 500 })
  }
}
