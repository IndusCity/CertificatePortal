import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UseFormRegister, UseFormWatch, UseFormSetValue, Control, Controller, useFieldArray } from 'react-hook-form'
import { FormData } from './application-form-types'

interface NAICSCodesProps {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function NAICSCodes({
  control,
  register,
  watch,
  setValue,
  handleInputFocus,
  handleInputBlur
}: NAICSCodesProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "naicsCodes"
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Implement NAICS code search functionality here
    console.log("Searching for NAICS code:", searchTerm);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">NAICS Codes</h3>
      
      <div className="space-y-4">
        <Label>Search for NAICS Codes that most accurately represent your business and enter below, starting with the primary code.</Label>
        <div className="flex space-x-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search NAICS Codes"
          />
          <Button onClick={handleSearch}>Search NAICS Codes</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          The North American Industry Classification System (NAICS) classifies business establishments for the purpose of collecting, analyzing, and publishing statistical data related to the U.S. economy. The NAICS industry codes define establishments based on the activities in which they are primarily engaged.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Use the fields below to enter non-primary NAICS descriptions and codes.</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <Input
              {...register(`naicsCodes.${index}.description` as const)}
              placeholder="NAICS Description"
              onFocus={() => handleInputFocus(`naicsCodes.${index}.description`)}
              onBlur={handleInputBlur}
            />
            <Input
              {...register(`naicsCodes.${index}.code` as const)}
              placeholder="NAICS Code"
              onFocus={() => handleInputFocus(`naicsCodes.${index}.code`)}
              onBlur={handleInputBlur}
            />
            <Button variant="destructive" onClick={() => remove(index)}>Remove</Button>
          </div>
        ))}
        <Button onClick={() => append({ description: "", code: "" })}>
          + Add another product line/service
        </Button>
      </div>
    </div>
  )
}

