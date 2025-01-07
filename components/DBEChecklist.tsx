import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DBEChecklistProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function DBEChecklist({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: DBEChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DBE Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="mb-4">Print DBE Checklist</Button>
        <p className="mb-4">
          If you are not already an approved DBE/ACDBE, use the DBE checklist to compile all the required documents and attach each below using the upload button.
        </p>
        <p>
          If your firm is already DBE/ACDBE approved, please use the DBE Roadmap on the DBE page of our website at <a href="https://www.sbsd.virginia.gov/certification-division/dbe/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.sbsd.virginia.gov/certification-division/dbe/</a> to be directed to the appropriate page with the specific directions and forms you'll need for uploading.
        </p>
      </CardContent>
    </Card>
  )
}

