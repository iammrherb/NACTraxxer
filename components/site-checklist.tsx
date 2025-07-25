"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { SiteChecklistItem, User } from "@/lib/database"

interface SiteChecklistProps {
  initialItems: SiteChecklistItem[]
  siteId: string
  users: Pick<User, "id" | "name" | "avatar_url">[]
}

export function SiteChecklist({ initialItems, siteId, users }: SiteChecklistProps) {
  const [items, setItems] = useState(initialItems)

  const groupedItems = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const category = item.category || "General"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(item)
        return acc
      },
      {} as Record<string, SiteChecklistItem[]>,
    )
  }, [items])

  const handleUpdate = async (itemId: number, payload: object) => {
    const originalItems = [...items]
    const updatedItem = { ...items.find((i) => i.checklist_item_id === itemId), ...payload }

    // Optimistic update
    setItems((prev) => prev.map((item) => (item.checklist_item_id === itemId ? { ...item, ...updatedItem } : item)))

    try {
      const response = await fetch(`/api/sites/${siteId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, ...payload }),
      })

      if (!response.ok) throw new Error("Failed to update checklist")

      const result = await response.json()
      // Update with server response to ensure consistency
      setItems((prev) =>
        prev.map((item) => (item.checklist_item_id === result.checklist_item_id ? { ...item, ...result } : item)),
      )

      toast({ title: "Success", description: "Checklist updated." })
    } catch (error) {
      setItems(originalItems) // Revert on failure
      toast({ title: "Error", description: "Could not update checklist.", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={Object.keys(groupedItems)} className="w-full">
          {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-lg">{category}</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {itemsInCategory.map((item) => (
                  <div key={item.checklist_item_id} className="flex items-start space-x-4 rounded-md border p-4">
                    <Checkbox
                      id={`item-${item.checklist_item_id}`}
                      checked={item.completed}
                      onCheckedChange={(checked) => handleUpdate(item.checklist_item_id, { completed: !!checked })}
                      className="mt-1"
                    />
                    <div className="flex-grow grid gap-2">
                      <Label htmlFor={`item-${item.checklist_item_id}`} className="text-base font-medium">
                        {item.title}
                      </Label>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      <div className="flex items-center gap-4 pt-2">
                        {/* User Assignment */}
                        <Select
                          value={item.assigned_user_id ?? "unassigned"}
                          onValueChange={(value) =>
                            handleUpdate(item.checklist_item_id, {
                              assignedUserId: value === "unassigned" ? null : value,
                            })
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Assign a user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={user.avatar_url ?? undefined} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{user.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Due Date Picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !item.due_date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {item.due_date ? format(new Date(item.due_date), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={item.due_date ? new Date(item.due_date) : undefined}
                              onSelect={(date) =>
                                handleUpdate(item.checklist_item_id, {
                                  dueDate: date ? format(date, "yyyy-MM-dd") : null,
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
