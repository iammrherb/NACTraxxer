"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type ReportType = "full_deployment" | "security_posture" | "executive_summary"

const availableReports: { id: ReportType; name: string; description: string }[] = [
  {
    id: "full_deployment",
    name: "Full Deployment Report",
    description: "A comprehensive report detailing all sites, configurations, and statuses.",
  },
  {
    id: "security_posture",
    name: "Security Posture Overview",
    description: "An analysis of security configurations and compliance.",
  },
  {
    id: "executive_summary",
    name: "Executive Summary",
    description: "A high-level overview of the project progress and key metrics.",
  },
]

export default function ReportsDashboard() {
  const [generatingReport, setGeneratingReport] = useState<ReportType | null>(null)

  const handleGenerateReport = useCallback(async (reportType: ReportType) => {
    setGeneratingReport(reportType)
    toast({
      title: "Generating Report",
      description: `Your "${availableReports.find((r) => r.id === reportType)?.name}" is being generated.`,
    })

    try {
      const response = await fetch(`/api/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType }),
      })

      if (!response.ok) {
        throw new Error("Report generation failed.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportType}_report_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Report Generated",
        description: "Your report has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not generate the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingReport(null)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generation</CardTitle>
        <CardDescription>Generate and download project reports.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <CardTitle className="text-lg">{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button onClick={() => handleGenerateReport(report.id)} disabled={!!generatingReport} className="w-full">
                {generatingReport === report.id ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate & Download
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
