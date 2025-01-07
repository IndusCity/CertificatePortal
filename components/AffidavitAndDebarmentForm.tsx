import { UseFormRegister, UseFormWatch, Control } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface AffidavitAndDebarmentFormProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function AffidavitAndDebarmentForm({
  register,
  watch,
  control,
  handleInputFocus,
  handleInputBlur
}: AffidavitAndDebarmentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Affidavit and Debarment Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            A .pdf of the affidavit and debarment form that you digitally-sign on this page is available for download for your records below.
          </p>
          <div className="border p-4 rounded-md">
            <h3 className="font-semibold mb-2">Debarment Certification:</h3>
            <p className="text-sm mb-4">
              The undersigned certify that information supplied herein is correct and that neither the applicant nor any principal or officer so far as known is now debarred or otherwise declared ineligible by any agency of the Commonwealth of Virginia from making offers for furnishing materials, supplies, or services to the Commonwealth of Virginia or any agency thereof.
            </p>
            <p className="text-sm mb-4">
              The undersign do solemnly declare and affirm under the penalties of perjury that the contents of the forgoing statements are true and correct and include all information necessary to identify and explain the operation of the applicant as well as the ownership thereof.
            </p>
            <p className="text-sm">
              The undersigned also swears or affirms that the above-mentioned firm is a bonafide small, minority-owned or women-owned business enterprise that is majority-owned and controlled by one or more minorities/women or other qualified person who exercises independent day-to day management.
            </p>
          </div>
          <div>
            <Label htmlFor="firmName">Name Of Firm</Label>
            <Input 
              id="firmName" 
              {...register('firmName')}
              onFocus={() => handleInputFocus('firmName')}
              onBlur={handleInputBlur}
            />
          </div>
          <div className="space-y-2">
            <Checkbox 
              id="agreementCheckbox" 
              {...register('agreementCheckbox')}
            />
            <Label htmlFor="agreementCheckbox" className="text-sm">
              I declare under penalty of perjury that the information provided in this application and supporting documents is true and correct.
            </Label>
          </div>
          <div>
            <Label htmlFor="signatureName">Signature Of Authorized Owner *</Label>
            <Input 
              id="signatureName" 
              {...register('signatureName')}
              onFocus={() => handleInputFocus('signatureName')}
              onBlur={handleInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="signatureDate">Date *</Label>
            <Input 
              id="signatureDate" 
              type="date"
              {...register('signatureDate')}
              onFocus={() => handleInputFocus('signatureDate')}
              onBlur={handleInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="signatureTitle">Printed Name and Title *</Label>
            <Input 
              id="signatureTitle" 
              {...register('signatureTitle')}
              onFocus={() => handleInputFocus('signatureTitle')}
              onBlur={handleInputBlur}
            />
          </div>
          <Button className="mt-4">Download Affidavit and Debarment Form</Button>
        </div>
      </CardContent>
    </Card>
  )
}

