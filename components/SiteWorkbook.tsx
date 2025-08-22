"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

interface SiteWorkbookProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function SiteWorkbook({ isOpen, onClose }: SiteWorkbookProps) {
  if (isOpen && onClose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Demo Data</CardTitle>
            <CardDescription>Load sample data for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This will load sample sites and configurations for demonstration purposes.</p>
            <div className="flex gap-2">
              <Button onClick={onClose}>Load Demo Data</Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Site Workbook</h2>
        <p className="text-gray-600 dark:text-gray-400">Documentation and reports for site deployments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Site Assessment Report
            </CardTitle>
            <CardDescription>Comprehensive site analysis and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Implementation Guide
            </CardTitle>
            <CardDescription>Step-by-step deployment instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Testing Checklist
            </CardTitle>
            <CardDescription>Validation and testing procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
