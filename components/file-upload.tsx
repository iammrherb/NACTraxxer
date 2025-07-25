"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { UploadCloud, FileIcon, X } from "lucide-react"

interface FileUploadProps {
  siteId: number
  onUploadSuccess: () => void
}

export default function FileUpload({ siteId, onUploadSuccess }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  })

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch(`/api/files/${siteId}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "File upload failed")
      }

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) have been uploaded.`,
      })
      setFiles([])
      onUploadSuccess()
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-md text-center cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50"}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        {isDragActive ? (
          <p className="mt-2 text-primary">Drop the files here ...</p>
        ) : (
          <p className="mt-2 text-muted-foreground">Drag & drop some files here, or click to select files</p>
        )}
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Selected files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
        {isUploading ? "Uploading..." : "Upload Files"}
      </Button>
    </div>
  )
}
