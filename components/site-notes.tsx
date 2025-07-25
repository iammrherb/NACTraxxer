"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import type { SiteNote } from "@/lib/database"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface SiteNotesProps {
  initialNotes: SiteNote[]
  siteId: string
}

export function SiteNotes({ initialNotes, siteId }: SiteNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/sites/${siteId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      })

      if (!response.ok) {
        throw new Error("Failed to add note")
      }

      const addedNote = await response.json()
      setNotes([addedNote, ...notes])
      setNewNote("")
      toast({ title: "Success", description: "Note added." })
    } catch (error) {
      toast({ title: "Error", description: "Could not add note.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newNote.trim()}>
              {isSubmitting ? "Adding Note..." : "Add Note"}
            </Button>
          </div>
        </form>
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="flex items-start gap-4 rounded-lg border p-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/40?u=${note.user_id}`} />
                  <AvatarFallback>{note.user_name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{note.user_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap">{note.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No notes for this site yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
