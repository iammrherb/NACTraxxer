"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScopingQuestionnaire } from "@/components/scoping-questionnaire"
import { EnhancedArchitectureDiagram } from "@/components/enhanced-architecture-diagram"
import { getScopingQuestionnaires, createScopingQuestionnaire } from "@/lib/api"
import type { ScopingQuestionnaire as ScopingQuestionnaireType, ScopingData } from "@/lib/types"
import { toast } from "sonner"
import { PlusCircle, Loader2, Eye } from "lucide-react"
import { format } from "date-fns"

export function ScopingDashboard() {
  const [questionnaires, setQuestionnaires] = useState<ScopingQuestionnaireType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false)
  const [isDiagramOpen, setIsDiagramOpen] = useState(false)
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<ScopingQuestionnaireType | null>(null)

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const data = await getScopingQuestionnaires()
        setQuestionnaires(data)
      } catch (error) {
        toast.error("Failed to load scoping questionnaires.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuestionnaires()
  }, [])

  const handleSave = async (data: ScopingData) => {
    try {
      const newQuestionnaire = await createScopingQuestionnaire(data)
      setQuestionnaires((prev) => [newQuestionnaire, ...prev])
      toast.success("Questionnaire submitted successfully!")
    } catch (error) {
      toast.error("Failed to submit questionnaire.")
      console.error(error)
    }
  }

  const handleViewDiagram = (questionnaire: ScopingQuestionnaireType) => {
    setSelectedQuestionnaire(questionnaire)
    setIsDiagramOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scoping Questionnaires</CardTitle>
            <CardDescription>Review submitted forms and view generated architecture diagrams.</CardDescription>
          </div>
          <Button onClick={() => setIsQuestionnaireOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Questionnaire
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionnaires.length > 0 ? (
                  questionnaires.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.organizationName}</TableCell>
                      <TableCell>{q.contactPerson}</TableCell>
                      <TableCell>{format(new Date(q.created_at), "PPP")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDiagram(q)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Diagram
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No questionnaires submitted yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ScopingQuestionnaire
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSave={handleSave}
      />

      {selectedQuestionnaire && (
        <Dialog open={isDiagramOpen} onOpenChange={setIsDiagramOpen}>
          <DialogContent className="max-w-4xl">
            <EnhancedArchitectureDiagram data={selectedQuestionnaire} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
