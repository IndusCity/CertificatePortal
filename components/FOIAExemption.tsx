import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UseFormRegister, UseFormWatch, Control, Controller } from 'react-hook-form'
import { FormData } from './application-form-types'

interface FOIAExemptionProps {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function FOIAExemption({
  control,
  register,
  watch,
  handleInputFocus,
  handleInputBlur
}: FOIAExemptionProps) {
  const [exemptionRequested, setExemptionRequested] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">FOIA Exemption</h3>
      
      <div className="space-y-4">
        <p className="text-sm">
          The Virginia Public Procurement Act{" "}
          <a href="http://law.lis.virginia.gov/vacode/title2.2/chapter43/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            (http://law.lis.virginia.gov/vacode/title2.2/chapter43/)
          </a>{" "}
          allows for the exemption of certain information from public disclosure. Under the Freedom of Information Act (FOIA), an applicant must request the exemption in writing so that certain information, such as confidential proprietary information or trade secrets (patent information) can be withheld from public view.*
        </p>

        <Controller
          name="exemptionRequested"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value)
                setExemptionRequested(value)
              }}
              className="flex flex-col space-y-2"
              onFocus={() => handleInputFocus('exemptionRequested')}
              onBlur={handleInputBlur}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="exemption-no" />
                <Label htmlFor="exemption-no">No exemption is requested.</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="exemption-yes" />
                <Label htmlFor="exemption-yes">Exemption is requested.</Label>
              </div>
            </RadioGroup>
          )}
        />

        {exemptionRequested === 'true' && (
          <div className="space-y-2">
            <Label htmlFor="exemptionReason">Please provide a reason for the exemption request:</Label>
            <Textarea
              id="exemptionReason"
              {...register('exemptionReason', { required: exemptionRequested === 'true' })}
              onFocus={() => handleInputFocus('exemptionReason')}
              onBlur={handleInputBlur}
            />
          </div>
        )}
      </div>
    </div>
  )
}

