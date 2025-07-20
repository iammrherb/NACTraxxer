"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScopingQuestionnaire } from "./scoping-questionnaire"
import { createSite } from "@/lib/api"
import { toast } from "./ui/use-toast"

export function ScopingDashboard({ library, onSiteCreate }: { library: any; onSiteCreate: () => void }) {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false)

  const handleSaveScoping = async (scopingData: any) => {
    try {
      // Here you would typically generate a quote or a proposal.
      // For this workflow, we'll directly create a site based on the scoping.
      const sitePayload = {
        name: scopingData.organizationName,
        id: `SITE-${Math.floor(1000 + Math.random() * 9000)}`,
        industry: scopingData.industry,
        project_goals: scopingData.projectGoals,
        legacy_nac_systems: scopingData.legacySystems,
        users_count: scopingData.totalUsers,
        country: scopingData.country,
        region: scopingData.region,
        // ... map other relevant scoping data to site fields
      }

      await createSite(sitePayload)
      toast({
        title: "Site Created",
        description: `Site "${sitePayload.name}" has been created from your scoping data.`,
      })
      onSiteCreate() // Refresh the main page data
      setIsQuestionnaireOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create site from scoping data.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Scoping & Quoting</CardTitle>
        <CardDescription>
          Start here to define a new customer deployment. The questionnaire will capture all necessary details to
          generate a project plan and a bill of materials.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button size="lg" onClick={() => setIsQuestionnaireOpen(true)}>
          Start New Scoping Questionnaire
        </Button>
      </CardContent>
      <ScopingQuestionnaire
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSave={handleSaveScoping}
        library={library}
      />
    </Card>
  )
}
