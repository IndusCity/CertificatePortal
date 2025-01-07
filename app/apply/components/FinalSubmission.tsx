import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface FinalSubmissionProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
  onSubmit: () => void
}

export function FinalSubmission({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur,
  onSubmit
}: FinalSubmissionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You must click the Submit button below to complete your submission and for the processing time to begin.
          </AlertDescription>
        </Alert>
        <div className="mt-6 space-y-4">
          <p>
            By clicking the Submit button, you confirm that:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>All information provided is accurate and complete</li>
            <li>All required documents have been uploaded</li>
            <li>You have reviewed and agree to the terms in the Affidavit and Debarment Form</li>
          </ul>
          <Button onClick={onSubmit} className="w-full">Submit Application</Button>
        </div>
      </CardContent>
    </Card>
  )
}

