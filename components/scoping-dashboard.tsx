"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { IntelligentQuestionnaire } from "./intelligent-questionnaire"
import type { ScopingQuestionnaire, LibraryData } from "@/lib/database"

interface ScopingDashboardProps {
  questionnaires: ScopingQuestionnaire[]
  onSave: (data: Partial<ScopingQuestionnaire>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onUpdate: () => void
  library: LibraryData | null
}

export function ScopingDashboard({ questionnaires, onSave, onDelete, onUpdate, library }: ScopingDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<ScopingQuestionnaire | undefined>(undefined)

  const handleNew = () => {
    setEditingQuestionnaire(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (q: ScopingQuestionnaire) => {
    setEditingQuestionnaire(q)
    setIsFormOpen(true)
  }

  const handleSave = async (data: Partial<ScopingQuestionnaire>) => {
    await onSave(data)
    setIsFormOpen(false)
    onUpdate()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this scoping document?")) {
      await onDelete(id)
      onUpdate()
    }
  }

  if (isFormOpen) {
    return (
      <IntelligentQuestionnaire
        libraryData={library}
        onSave={handleSave}
        onCancel={() => setIsFormOpen(false)}
        questionnaire={editingQuestionnaire}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Scoping & Discovery</CardTitle>
            <CardDescription>Manage and initiate project scoping questionnaires.</CardDescription>
          </div>
          <Button onClick={handleNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Scoping
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionnaires.length > 0 ? (
              questionnaires.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.organization_name}</TableCell>
                  <TableCell>
                    <Badge variant={q.status === "Completed" ? "success" : "outline"}>{q.status}</Badge>
                  </TableCell>
                  <TableCell>{q.industry}</TableCell>
                  <TableCell>{q.total_users}</TableCell>
                  <TableCell>{new Date(q.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No scoping documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
