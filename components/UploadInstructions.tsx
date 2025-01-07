import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface UploadInstructionsProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function UploadInstructions({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: UploadInstructionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          The SBSD now requires all documents to be uploaded digitally. This is a secure website which uses encryption technology to ensure that your data is kept confidential. Your documents will be uploaded to our secure on-premise database.
        </p>
        <p className="mb-4">
          Note: File size should be less than 50MB
        </p>
        <p className="mb-4">
          IMPORTANT NOTE: You can upload as many or as few documents as are applicable to your firm's DBE submission, but you do NOT HAVE TO UPLOAD ANYTHING to this page in order to proceed and submit the application and should ONLY upload applicable documents on this page in special cases such as having made significant changes to your firm for which it is appropriate and necessary to submit supporting documentation to our office on those changes, or uploading documentation to support your firm's request for new NAICS codes.
        </p>
        <p>
          If there is no default space below that matches your document(s), you can create one or more Miscellaneous space(s) for which to upload your supporting documentation.
        </p>
      </CardContent>
    </Card>
  )
}

