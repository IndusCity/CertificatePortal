import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { jsPDF } from "jspdf"

interface ReviewApplicationProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function ReviewApplication({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: ReviewApplicationProps) {
  const formData = watch()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const openPreview = () => setIsPreviewOpen(true)
  const closePreview = () => setIsPreviewOpen(false)

  const generatePDF = () => {
    const doc = new jsPDF()
    const formData = watch()
    let yPos = 10

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        doc.text(`${key}: ${JSON.stringify(value)}`, 10, yPos)
        yPos += 10
        if (yPos > 280) {
          doc.addPage()
          yPos = 10
        }
      }
    })

    doc.save("application_summary.pdf")
  }

  const ApplicationPreview = () => {
    const formData = watch()

    return (
      <ScrollArea className="h-[600px] w-full">
        <div className="p-6 space-y-4">
          {Object.entries(formData).map(([key, value]) => (
            value && (
              <div key={key} className="border-b pb-2">
                <h3 className="font-semibold">{key}</h3>
                <p>{JSON.stringify(value)}</p>
              </div>
            )
          ))}
        </div>
      </ScrollArea>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Application</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Please verify that the application is complete and all the documents have been uploaded before submitting the application.
        </p>
        <div className="space-y-4">
          {/* Display a summary of the application data here */}
          <h3 className="font-semibold">Application Summary</h3>
          <div>
            <p><strong>Business Name:</strong> {formData.legalName}</p>
            <p><strong>Business Type:</strong> {formData.businessType}</p>
            <p><strong>Contact Email:</strong> {formData.businessEmail}</p>
            {/* Add more fields as necessary */}
          </div>
          <div>
            <h4 className="font-semibold">Uploaded Documents</h4>
            {/* List uploaded documents here */}
            <ul className="list-disc list-inside">
              <li>Business License</li>
              <li>Tax Returns</li>
              <li>Proof of Identity</li>
              {/* Add more document types as necessary */}
            </ul>
          </div>
          <Button onClick={openPreview} className="mt-4">Preview Application Summary</Button>
          <Dialog open={isPreviewOpen} onOpenChange={closePreview}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Application Summary</DialogTitle>
              </DialogHeader>
              <ApplicationPreview />
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={generatePDF}>Download PDF</Button>
                <Button onClick={closePreview} variant="outline">Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

