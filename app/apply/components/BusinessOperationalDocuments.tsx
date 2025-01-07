'use client'

import { useState, useCallback } from 'react'
import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileText, Upload, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { useToast } from '@/components/ui/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface BusinessOperationalDocumentsProps {
register: UseFormRegister<FormData>
watch: UseFormWatch<FormData>
control: Control<FormData>
handleInputFocus: (fieldName: string) => void
handleInputBlur: () => void
}

interface FileUpload {
name: string
size: number
progress: number
status: 'uploading' | 'completed' | 'error'
path?: string
type: string
preview?: string
}

const formatFileSize = (bytes: number): string => {
if (bytes === 0) return '0 Bytes'
const k = 1024
const sizes = ['Bytes', 'KB', 'MB', 'GB']
const i = Math.floor(Math.log(bytes) / Math.log(k))
return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function BusinessOperationalDocuments({
register,
watch,
control,
handleInputFocus,
handleInputBlur
}: BusinessOperationalDocumentsProps) {
const [fileUploads, setFileUploads] = useState<{ [key: string]: FileUpload }>({})
const [dragActive, setDragActive] = useState<string | null>(null)
const [notification, setNotification] = useState<string | null>(null)
const { toast } = useToast()

const documents = [
  "Work experience resumes (that includes places of employment with corresponding dates) for all owners and officers of your firm",
  "List of all employees, job titles, and dates of employment",
  "Trust agreements held by any owner claiming disadvantaged status, if any",
  "Documented proof of any transfers of assets to/from your firm and/or to/from any of its owners over the past two years",
  "Descriptions of all real estate (including office/storage space, etc.) owned/leased by your firm and documented proof of ownership/signed leases",
  "Insurance agreements for each truck owned or operated by your firm",
  "List of equipment and/or vehicles owned and leased including VIN numbers, copy of titles, proof of ownership, insurance cards for each vehicle",
  "All relevant licenses, license renewal forms, permits, and haul authority forms",
  "Title(s), registration certificate(s), and US DOT numbers for each truck owned or operated by your firm",
  "Proof of warehouse/storage facility ownership or lease agreements",
  "List of product lines carried and list of distribution equipment owned and/or leased"
]

const handleDrag = useCallback((e: React.DragEvent, documentName: string) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(documentName)
  } else if (e.type === "dragleave") {
    setDragActive(null)
  }
}, [])

const handleDrop = useCallback(async (e: React.DragEvent, documentName: string) => {
  e.preventDefault()
  e.stopPropagation()
  setDragActive(null)

  const file = e.dataTransfer.files?.[0]
  if (file) {
    await handleFile(file, documentName)
  }
}, [])

const handleFile = async (file: File, documentName: string) => {
  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    setNotification('File too large. Please upload a file smaller than 50MB.')
    setTimeout(() => setNotification(null), 5000)
    return
  }

  // Create preview for images
  let preview = undefined
  if (file.type.startsWith('image/')) {
    preview = URL.createObjectURL(file)
  }

  setFileUploads(prev => ({
    ...prev,
    [documentName]: {
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      type: file.type,
      preview
    }
  }))

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `business-operational-documents/${documentName}/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('general-submission-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          const percentage = (progress.loaded / progress.total) * 100
          setFileUploads(prev => ({
            ...prev,
            [documentName]: { 
              ...prev[documentName], 
              progress: percentage,
              path: filePath
            }
          }))
        },
      })

    if (uploadError) throw uploadError

    setFileUploads(prev => ({
      ...prev,
      [documentName]: { 
        ...prev[documentName], 
        status: 'completed',
        path: filePath
      }
    }))

    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded.`,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    setFileUploads(prev => ({
      ...prev,
      [documentName]: { ...prev[documentName], status: 'error' }
    }))
    toast({
      title: "Error uploading file",
      description: "There was an error uploading your file. Please try again.",
      variant: "destructive",
    })
  }
}

const handleDelete = async (documentName: string) => {
  const file = fileUploads[documentName]
  if (file?.path) {
    try {
      const { error } = await supabase.storage
        .from('general-submission-documents')
        .remove([file.path])

      if (error) throw error

      setFileUploads(prev => {
        const newUploads = { ...prev }
        delete newUploads[documentName]
        return newUploads
      })

      setNotification('File deleted successfully.')
      setTimeout(() => setNotification(null), 5000)
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      setNotification('Error deleting file. Please try again.')
      setTimeout(() => setNotification(null), 5000)
      toast({
        title: "Error deleting file",
        description: "There was an error deleting your file. Please try again.",
        variant: "destructive",
      })
    }
  }
}

return (
  <Card className="w-full max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Business Operational Documents</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        {documents.map((doc, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">{doc}</h3>
            
            {!fileUploads[doc] ? (
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 transition-colors
                  ${dragActive === doc 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={(e) => handleDrag(e, doc)}
                onDragLeave={(e) => handleDrag(e, doc)}
                onDragOver={(e) => handleDrag(e, doc)}
                onDrop={(e) => handleDrop(e, doc)}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Drag and drop your file here, or
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="relative mt-2"
                      onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
                    >
                      Browse File
                      <input
                        id={`file-upload-${index}`}
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFile(file, doc)
                        }}
                        onFocus={() => handleInputFocus(`businessOperationalDocuments.${index}`)}
                        onBlur={handleInputBlur}
                      />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    File should be max 50MB in size
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {fileUploads[doc].name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileUploads[doc].size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileUploads[doc].status === 'uploading' && (
                        <div className="w-24">
                          <Progress value={fileUploads[doc].progress} />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(doc)}
                      >
                        <span className="sr-only">Delete file</span>
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {fileUploads[doc].preview && (
                    <div className="mt-2">
                      <img
                        src={fileUploads[doc].preview}
                        alt="Preview"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
      {notification && (
        <div className="text-sm text-green-600">{notification}</div>
      )}
    </CardContent>
  </Card>
)
}

