import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface UploadDocumentsProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function UploadDocuments({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: UploadDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          The SBSD now requires all documents to be uploaded digitally. This is a secure website which uses encryption technology to ensure that your data is kept confidential. Your documents will be uploaded to our secure on-premise database.
        </p>
        <p className="mb-4">
          Note: File size should be less than 50MB
        </p>
        <div>
          <Label htmlFor="document">Upload Document</Label>
          <Input
            id="document"
            type="file"
            {...register('document')}
            onFocus={() => handleInputFocus('document')}
            onBlur={handleInputBlur}
          />
        </div>
      </CardContent>
    </Card>
  )
}

