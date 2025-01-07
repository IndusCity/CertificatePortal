import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { UseFormRegister, UseFormWatch, UseFormSetValue, Control, Controller, FieldValues } from 'react-hook-form'
import { FormData } from './application-form-types'

interface NIGPCommodityCodesProps {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function NIGPCommodityCodes({
  control,
  register,
  watch,
  setValue,
  handleInputFocus,
  handleInputBlur
}: NIGPCommodityCodesProps) {
  const [commodityCodes, setCommodityCodes] = useState([{ id: 1 }])

  const addCommodityCode = () => {
    setCommodityCodes([...commodityCodes, { id: commodityCodes.length + 1 }])
  }

  const removeCommodityCode = (id: number) => {
    setCommodityCodes(commodityCodes.filter(code => code.id !== id))
  }

  const geographicAreas = [
    "Statewide Virginia",
    "Eastern Shore/Tidewater Virginia",
    "Northern Virginia",
    "Northwest Virginia",
    "Southwest Virginia",
    "Central Virginia",
    "Other Location"
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">NIGP Commodity Codes</h3>
      
      <div>
        <Label htmlFor="businessCategory">Business Category*</Label>
        <Controller
          name="businessCategory"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange}
              onOpenChange={() => handleInputFocus('businessCategory')}
            >
              <SelectTrigger id="businessCategory">
                <SelectValue placeholder="Select business category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-sm text-gray-500 mt-1">Which of the following industries or categories describes your business the best?</p>
      </div>

      <div>
        <Label>Search for your company's commodity codes and enter below, starting with the primary code.</Label>
        <Button className="mt-2" onClick={() => {/* Implement search functionality */}}>
          Search Commodity Codes
        </Button>
      </div>

      <div>
        <p className="text-sm text-gray-500">What is a NIGP Commodity/Services Code?</p>
        <p className="text-sm text-gray-500">
          The NIGP Commodity/Services Code is an acronym for the National Institute of Governmental Purchasings' Commodity/Services Code. 
          The NIGP Code is a coding taxonomy used primarily to classify products and services procured by state and local governments in North America.
        </p>
      </div>

      {commodityCodes.map((code, index) => (
        <div key={code.id} className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`productLineDescription-${code.id}`}>
                {index === 0 ? 'Primary' : 'Other'} Product Line/Service Description
                {index === 0 && '*'}
              </Label>
              <Input
                id={`productLineDescription-${code.id}`}
                {...register(`commodityCodes.${index}.description` as const, { required: index === 0 })}
                onFocus={() => handleInputFocus(`commodityCodes.${index}.description`)}
                onBlur={handleInputBlur}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor={`nigpCode-${code.id}`}>
                {index === 0 ? 'Primary' : 'Other'} NIGP Code
                {index === 0 && '*'}
              </Label>
              <Input
                id={`nigpCode-${code.id}`}
                {...register(`commodityCodes.${index}.code` as const, { required: index === 0 })}
                onFocus={() => handleInputFocus(`commodityCodes.${index}.code`)}
                onBlur={handleInputBlur}
                readOnly
              />
            </div>
          </div>
          {index > 0 && (
            <Button variant="destructive" onClick={() => removeCommodityCode(code.id)}>
              Remove
            </Button>
          )}
        </div>
      ))}

      <Button onClick={addCommodityCode}>
        + Add Another product line/service
      </Button>

      <div>
        <Label>Geographic Marketing Area</Label>
        <p className="text-sm text-gray-500">Select at least one marketing area *</p>
        {geographicAreas.map((area) => (
          <div key={area} className="flex items-center space-x-2 mt-2">
            <Controller
              name="geographicMarketingAreas"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={`area-${area}`}
                  checked={field.value?.includes(area)}
                  onCheckedChange={(checked) => {
                    const updatedValue = checked
                      ? [...(field.value || []), area]
                      : (field.value || []).filter((value: string) => value !== area);
                    field.onChange(updatedValue);
                  }}
                  onFocus={() => handleInputFocus('geographicMarketingAreas')}
                  onBlur={handleInputBlur}
                />
              )}
            />
            <Label htmlFor={`area-${area}`}>{area}</Label>
          </div>
        ))}
      </div>

      <div>
        <Label>Does your business accept charge cards?*</Label>
        <Controller
          name="acceptsChargeCards"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={(value) => field.onChange(value === 'true')}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="accepts-charge-cards-yes" />
                <Label htmlFor="accepts-charge-cards-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="accepts-charge-cards-no" />
                <Label htmlFor="accepts-charge-cards-no">No</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </div>
  )
}

