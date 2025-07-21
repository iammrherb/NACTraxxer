import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const questionnaires = await sql`
      SELECT * FROM scoping_questionnaire 
      ORDER BY created_at DESC
    `

    return NextResponse.json(questionnaires)
  } catch (error) {
    console.error("Error fetching questionnaires:", error)
    return NextResponse.json({ error: "Failed to fetch questionnaires" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const questionnaire = await sql`
      INSERT INTO scoping_questionnaire (
        organization_name, contact_person, contact_email, contact_phone,
        total_sites, total_users, network_vendors, switch_models, wireless_models,
        identity_providers, mdm_solutions, siem_solutions, mdr_solutions, 
        xdr_solutions, edr_solutions, auth_methods, certificate_requirements,
        guest_access_requirements, byod_requirements, vlan_segmentation,
        access_policies, compliance_requirements, risk_tolerance,
        security_priorities, compliance_frameworks, target_deployment_date,
        budget_range, project_timeline_months, high_availability_required,
        disaster_recovery_required, multi_region_deployment, status
      ) VALUES (
        ${data.organizationName}, ${data.contactPerson}, ${data.contactEmail}, ${data.contactPhone},
        ${data.totalSites}, ${data.totalUsers}, ${JSON.stringify(data.networkVendors)}, 
        ${JSON.stringify(data.switchModels)}, ${JSON.stringify(data.wirelessModels)},
        ${JSON.stringify(data.identityProviders)}, ${JSON.stringify(data.mdmSolutions)},
        ${JSON.stringify(data.siemSolutions)}, ${JSON.stringify(data.mdrSolutions)},
        ${JSON.stringify(data.xdrSolutions)}, ${JSON.stringify(data.edrSolutions)},
        ${JSON.stringify(data.authMethods)}, ${JSON.stringify(data.certificateRequirements)},
        ${JSON.stringify(data.guestAccessRequirements)}, ${JSON.stringify(data.byodRequirements)},
        ${JSON.stringify(data.vlanSegmentation)}, ${JSON.stringify(data.accessPolicies)},
        ${JSON.stringify(data.complianceRequirements)}, ${data.riskTolerance},
        ${JSON.stringify(data.securityPriorities)}, ${JSON.stringify(data.complianceFrameworks)},
        ${data.targetDeploymentDate}, ${data.budgetRange}, ${data.projectTimelineMonths},
        ${data.highAvailabilityRequired}, ${data.disasterRecoveryRequired},
        ${data.multiRegionDeployment}, 'submitted'
      )
      RETURNING *
    `

    return NextResponse.json(questionnaire[0])
  } catch (error) {
    console.error("Error creating questionnaire:", error)
    return NextResponse.json({ error: "Failed to create questionnaire" }, { status: 500 })
  }
}
