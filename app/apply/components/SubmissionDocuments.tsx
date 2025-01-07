import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SubmissionDocumentsProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function SubmissionDocuments({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: SubmissionDocumentsProps) {
  const documents = [
    "Uniform Certification Application (UCA)",
    "Declaration of Eligibility (DOE), formerly No Change Affidavit",
    "Notice of Change",
    "DBE and SBA 8(a) or SDB certifications, denials, and/or de-certifications, if applicable",
    "DBE/ACDBE Interstate Certification Cover Letter",
    "Electronic image of the UCP directory of the original UCP that shows the DBE certification (new interstate DBE/ACDBE applicants only)"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Documents (12-26-2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index}>
              <Label htmlFor={`doc-${index}`}>{doc}</Label>
              <Input
                id={`doc-${index}`}
                type="file"
                {...register(`submissionDocuments.${index}`)}
                onFocus={() => handleInputFocus(`submissionDocuments.${index}`)}
                onBlur={handleInputBlur}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

