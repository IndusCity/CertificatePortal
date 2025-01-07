'use client'

import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface SWaMUploadInstructionsProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function SWaMUploadInstructions({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: SWaMUploadInstructionsProps) {
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
      </CardContent>
    </Card>
  )
}

