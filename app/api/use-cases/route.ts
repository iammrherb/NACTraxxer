import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const useCases = await sql`
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
        ) as success_criteria,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', r.id,
              'type', r.type,
              'description', r.description,
              'justification', r.justification,
              'status', r.status
            )
          ) FILTER (WHERE r.id IS NOT NULL), 
          '[]'
        ) as requirements
      FROM use_cases uc
      LEFT JOIN test_cases tc ON uc.id = tc.use_case_id
      LEFT JOIN documentation_links dl ON uc.id = dl.use_case_id
      LEFT JOIN success_criteria sc ON uc.id = sc.use_case_id
      LEFT JOIN use_case_requirements ucr ON uc.id = ucr.use_case_id
      LEFT JOIN requirements r ON ucr.requirement_id = r.id
      GROUP BY uc.id
      ORDER BY uc.id
    `

    return NextResponse.json(useCases)
  } catch (error) {
    console.error("Error fetching use cases:", error)
    return NextResponse.json({ error: "Failed to fetch use cases" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const useCaseData = await request.json()

    const useCase = await sql`
      INSERT INTO use_cases (
        id, title, subtitle, description, category, status, priority, completion_percentage, notes
      ) VALUES (
        ${useCaseData.id}, ${useCaseData.title}, ${useCaseData.subtitle}, 
        ${useCaseData.description}, ${useCaseData.category}, ${useCaseData.status}, 
        ${useCaseData.priority}, ${useCaseData.completion_percentage}, ${useCaseData.notes}
      )
      RETURNING *
    `

    return NextResponse.json(useCase[0])
  } catch (error) {
    console.error("Error creating use case:", error)
    return NextResponse.json({ error: "Failed to create use case" }, { status: 500 })
  }
}
