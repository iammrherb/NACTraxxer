"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, File, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  siteId: string
  onUploadComplete?: () => void
}

interface UploadedFile {
  id: number
  filename: string
  original_name: string
  file_size: number
  category: string
  description?: string
  uploaded_by_name: string
  created_at: string
}

export function FileUpload({ siteId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const loadFiles = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/files/${siteId}`)
      if (response.ok) {
        const filesData = await response.json()
        setFiles(filesData)
      }
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setLoading(false)
    }
  }, [siteId])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!category) {
        toast({
          title: "Error",
          description: "Please select a file category first",
          variant: "destructive",
        })
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("siteId", siteId)
          formData.append("category", category)
          formData.append("description", description)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Upload failed")
          }

          setUploadProgress(100)
        }

        toast({
          title: "Success",
          description: `${acceptedFiles.length} file(s) uploaded successfully`,
        })

        // Reset form
        setCategory("")
        setDescription("")

        // Refresh file list
        loadFiles()
        onUploadComplete?.()
      } catch (error: any) {
        console.error("Upload error:", error)
        toast({
          title: "Error",
          description: error.message || "Upload failed",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [category, description, siteId, toast, onUploadComplete, loadFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      documentation: "bg-blue-100 text-blue-800",
      network_diagram: "bg-green-100 text-green-800",
      certificate: "bg-purple-100 text-purple-800",
      report: "bg-orange-100 text-orange-800",
      image: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.other
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">File Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="network_diagram">Network Diagram</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">Supports: Images, PDF, Word, Excel, Text files (Max 10MB)</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="mx-auto h-12 w-12 mb-4" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{file.original_name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(file.category)}`}>
                          {file.category.replace("_", " ")}
                        </span>
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>by {file.uploaded_by_name}</span>
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleDateString()}</span>
                      </div>
                      {file.description && <p className="text-sm text-muted-foreground mt-1">{file.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
