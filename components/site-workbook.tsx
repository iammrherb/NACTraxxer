"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { checklistItems } from "@/lib/library-data"
import { getChecklistStatus, updateChecklistStatus } from "@/lib/api"

interface SiteWorkbookProps {
  siteId: string
}

const phases = [
  "Planning & Discovery",
  "Design & Architecture",
  "Configuration & Integration",
  "Pilot & Testing",
  "Deployment & Go-Live",
  "Optimization & Maintenance",
]

export function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (siteId) {
      setLoading(true)
      getChecklistStatus(siteId)
        .then((status) => {
          setCheckedItems(status)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to get checklist status", err)
          setLoading(false)
        })
    }
  }, [siteId])

  const handleCheckChange = (itemId: string, checked: boolean) => {
    const newCheckedItems = { ...checkedItems, [itemId]: checked }
    setCheckedItems(newCheckedItems)
    updateChecklistStatus(siteId, newCheckedItems).catch((err) => {
      console.error("Failed to update checklist status", err)
      // Optionally revert state on failure
    })
  }

  const itemsByPhase = checklistItems.reduce(
    (acc, item) => {
      if (!acc[item.phase]) {
        acc[item.phase] = []
      }
      acc[item.phase].push(item)
      return acc
    },
    {} as Record<string, typeof checklistItems>,
  )

  if (loading) {
    return <div>Loading workbook...</div>
  }

  return (
    <Accordion type="multiple" defaultValue={phases} className="w-full">
      {phases.map((phase) => {
        const phaseItems = itemsByPhase[phase] || []
        const completedItems = phaseItems.filter((item) => checkedItems[item.id]).length
        const totalItems = phaseItems.length
        const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

        return (
          <AccordionItem value={phase} key={phase}>
            <AccordionTrigger>
              <div className="flex flex-col items-start w-full pr-4">
                <span className="font-semibold">{phase}</span>
                <div className="flex items-center w-full mt-2">
                  <Progress value={progress} className="w-full h-2" />
                  <span className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                    {completedItems} / {totalItems}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {phaseItems.map((item) => (
                  <div key={item.id} className="items-top flex space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={!!checkedItems[item.id]}
                      onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={item.id} className="font-medium">
                        {item.task}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
