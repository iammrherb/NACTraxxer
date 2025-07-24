import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const useCase = await sql`
      SELECT 
        uc.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', tc.id,
              'name', tc.name,
              'description', tc.description,
              'expected_outcome', tc.expected_outcome,
              'status', tc.status,
              'actual_outcome', tc.actual_outcome,
              'test_date', tc.test_date,
              'tester_name', tc.tester_name
            )
          ) FILTER (WHERE tc.id IS NOT NULL), 
          '[]'
        ) as test_cases,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', dl.id,
              'title', dl.title,
              'url', dl.url,
              'description', dl.description
            )
          ) FILTER (WHERE dl.id IS NOT NULL), 
          '[]'
        ) as documentation_links,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', sc.id,
              'criteria', sc.criteria,
              'is_met', sc.is_met
            )
          ) FILTER (WHERE sc.id IS NOT NULL), 
          '[]'
        ) as success_criteria
      FROM use_cases uc
      LEFT JOIN test_cases tc ON uc.id = tc.use_case_id
      LEFT JOIN documentation_links dl ON uc.id = dl.use_case_id
      LEFT JOIN success_criteria sc ON uc.id = sc.use_case_id
      WHERE uc.id = ${params.id}
      GROUP BY uc.id
    `

    if (useCase.length === 0) {
      return NextResponse.json({ error: "Use case not found" }, { status: 404 })
    }

    return NextResponse.json(useCase[0])
  } catch (error) {
    console.error("Error fetching use case:", error)
    return NextResponse.json({ error: "Failed to fetch use case" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const useCaseData = await request.json()

    const useCase = await sql`
      UPDATE use_cases 
      SET 
        title = ${useCaseData.title},
        subtitle = ${useCaseData.subtitle},
        description = ${useCaseData.description},
        category = ${useCaseData.category},
        status = ${useCaseData.status},
        priority = ${useCaseData.priority},
        completion_percentage = ${useCaseData.completion_percentage},
        notes = ${useCaseData.notes},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(useCase[0])
  } catch (error) {
    console.error("Error updating use case:", error)
    return NextResponse.json({ error: "Failed to update use case" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM use_cases WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting use case:", error)
    return NextResponse.json({ error: "Failed to delete use case" }, { status: 500 })
  }
}
