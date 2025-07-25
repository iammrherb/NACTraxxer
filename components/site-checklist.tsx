"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import type { SiteChecklistItem } from "@/lib/database"

interface SiteChecklistProps {
  initialItems: SiteChecklistItem[]
  siteId: string
}

export function SiteChecklist({ initialItems, siteId }: SiteChecklistProps) {
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

  const handleCheckChange = async (itemId: number, completed: boolean) => {
    // Optimistically update UI
    setItems((prevItems) =>
      prevItems.map((item) => (item.checklist_item_id === itemId ? { ...item, completed } : item)),
    )

    try {
      const response = await fetch(`/api/sites/${siteId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, completed }),
      })

      if (!response.ok) {
        throw new Error("Failed to update checklist")
      }
      toast({ title: "Success", description: "Checklist updated." })
    } catch (error) {
      // Revert optimistic update on failure
      setItems((prevItems) =>
        prevItems.map((item) => (item.checklist_item_id === itemId ? { ...item, completed: !completed } : item)),
      )
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
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent className="space-y-4">
                {itemsInCategory.map((item) => (
                  <div key={item.checklist_item_id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`item-${item.checklist_item_id}`}
                      checked={item.completed}
                      onCheckedChange={(checked) => handleCheckChange(item.checklist_item_id, !!checked)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={`item-${item.checklist_item_id}`} className="text-base font-medium">
                        {item.title}
                      </Label>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
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
