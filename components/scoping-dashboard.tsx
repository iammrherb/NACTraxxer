"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScopingQuestionnaire } from "./scoping-questionnaire"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "./ui/use-toast"
import * as api from "@/lib/api"
import type { ScopingQuestionnaire as ScopingQuestionnaireType, LibraryData, Site } from "@/lib/database"
import { Plus, Edit, Trash2, FileText } from "lucide-react"

export function ScopingDashboard({ library, onSiteCreate }: { library: LibraryData; onSiteCreate: () => void }) {
  const [questionnaires, setQuestionnaires] = useState<ScopingQuestionnaireType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<ScopingQuestionnaireType | null>(null)

  const fetchQuestionnaires = async () => {
    setIsLoading(true)
    try {
      const data = await api.getQuestionnaires()
      setQuestionnaires(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch questionnaires.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  const handleOpenModal = (questionnaire: ScopingQuestionnaireType | null = null) => {
    setSelectedQuestionnaire(questionnaire)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedQuestionnaire(null)
  }

  const handleSave = async (data: any) => {
    try {
      let savedQuestionnaire
      if (selectedQuestionnaire) {
        savedQuestionnaire = await api.updateQuestionnaire(selectedQuestionnaire.id, data)
        toast({ title: "Success", description: "Questionnaire updated." })
      } else {
        savedQuestionnaire = await api.createQuestionnaire(data)
        toast({ title: "Success", description: "Questionnaire saved." })
      }
      fetchQuestionnaires()
      handleCloseModal()

      if (savedQuestionnaire.status === "Completed") {
        handleCreateSitesFromScoping(savedQuestionnaire)
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save questionnaire.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this questionnaire?")) {
      try {
        await api.deleteQuestionnaire(id)
        toast({ title: "Success", description: "Questionnaire deleted." })
        fetchQuestionnaires()
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete questionnaire.", variant: "destructive" })
      }
    }
  }

  const handleCreateSitesFromScoping = async (scopingData: ScopingQuestionnaireType) => {
    try {
      const sitesToCreate: Partial<Site>[] = Array.from({ length: scopingData.siteCount }, (_, i) => ({
        name: `${scopingData.organizationName} - Site ${i + 1}`,
        id: `${scopingData.organizationName.replace(/\s+/g, "-").toUpperCase()}-${Date.now() + i}`,
        industry: scopingData.industry,
        project_goals: scopingData.projectGoals,
        users_count: Math.floor(scopingData.totalUsers / scopingData.siteCount),
        country: scopingData.country,
        region: scopingData.region,
        // Map vendors from names to IDs
        idp_vendor_ids: library.idpVendors.filter((v) => scopingData.idpVendors.includes(v.name)).map((v) => v.id),
        mdm_vendor_ids: library.mdmVendors.filter((v) => scopingData.mdmVendors.includes(v.name)).map((v) => v.id),
        // ... add other vendor types here
      }))

      await api.bulkCreateSites(sitesToCreate)
      toast({
        title: "Sites Created",
        description: `${scopingData.siteCount} sites have been created from the questionnaire.`,
      })
      onSiteCreate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sites from scoping data.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Project Scoping</CardTitle>
              <CardDescription>Manage scoping questionnaires to define new customer deployments.</CardDescription>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="mr-2 h-4 w-4" /> Start New Questionnaire
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : questionnaires.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No questionnaires found.
                  </TableCell>
                </TableRow>
              ) : (
                questionnaires.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.organizationName}</TableCell>
                    <TableCell>{q.region}</TableCell>
                    <TableCell>{q.siteCount}</TableCell>
                    <TableCell>
                      <Badge variant={q.status === "Completed" ? "default" : "secondary"}>{q.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(q.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreateSitesFromScoping(q)}
                        disabled={q.status !== "Completed"}
                        title="Create Sites from Questionnaire"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(q)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(q.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isModalOpen && (
        <ScopingQuestionnaire
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          library={library}
          questionnaire={selectedQuestionnaire}
        />
      )}
    </>
  )
}
