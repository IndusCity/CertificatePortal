import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldValues, Control, Controller, useFieldArray } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface OwnershipProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function Ownership({ register, watch, setValue, control, handleInputFocus, handleInputBlur }: OwnershipProps) {
  const [owners, setOwners] = useState([{ id: 1 }])
  const [has10PctOwnership, setHas10PctOwnership] = useState(false)

  const { fields: affiliateFields, append: appendAffiliate } = useFieldArray({
    control,
    name: "affiliates"
  });

  const addOwner = () => {
    setOwners([...owners, { id: owners.length + 1 }])
  }

  const ethnicityOptions = [
    "Hispanic or Latino",
    "White",
    "Black or African American",
    "Native American or Alaska Native",
    "Asian",
    "Native Hawaiian or Other Pacific Islander",
    "Two or More Races",
    "Other"
  ]

  const countryOptions = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    // Add more countries as needed
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Ownership Information</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Enter details for <strong>ALL</strong> owners of the company.</p>
          <p className="text-sm text-gray-500">You will be required to upload proof of U.S citizenship or Permanent Residency of any owner(s) making up at least 51% ownership, in the format listed below.</p>
          <ol className="list-decimal list-inside text-sm text-gray-500">
            <li>DMV License</li>
            <li>U.S Passport OR Birth Certificate OR Permanent Resident Card OR Certificate of Naturalization.</li>
          </ol>
        </div>
      </div>

      {owners.map((owner, index) => (
        <div key={owner.id} className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Owner {index + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`fullName-${owner.id}`}>Owner's Full Name</Label>
              <Input
                id={`fullName-${owner.id}`}
                {...register(`owners.${index}.fullName` as const, { required: true })}
                onFocus={() => handleInputFocus(`owners.${index}.fullName`)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor={`ownershipPercentage-${owner.id}`}>Ownership %</Label>
              <Input
                id={`ownershipPercentage-${owner.id}`}
                type="number"
                {...register(`owners.${index}.ownershipPercentage` as const, { required: true, min: 0, max: 100 })}
                onFocus={() => handleInputFocus(`owners.${index}.ownershipPercentage`)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor={`ethnicity-${owner.id}`}>Ethnicity</Label>
              <Select 
                onValueChange={(value) => setValue(`owners.${index}.ethnicity` as const, value)}
                onOpenChange={() => handleInputFocus(`owners.${index}.ethnicity`)}
              >
                <SelectTrigger id={`ethnicity-${owner.id}`}>
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {ethnicityOptions.map((ethnicity) => (
                    <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <RadioGroup
                onValueChange={(value) => setValue(`owners.${index}.gender` as const, value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id={`gender-male-${owner.id}`} />
                  <Label htmlFor={`gender-male-${owner.id}`}>Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id={`gender-female-${owner.id}`} />
                  <Label htmlFor={`gender-female-${owner.id}`}>Female</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="col-span-2">
              <Label htmlFor={`address-${owner.id}`}>Address</Label>
              <Input
                id={`address-${owner.id}`}
                {...register(`owners.${index}.address` as const, { required: true })}
                onFocus={() => handleInputFocus(`owners.${index}.address`)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor={`title-${owner.id}`}>Owner's title/position in business</Label>
              <Input
                id={`title-${owner.id}`}
                {...register(`owners.${index}.title` as const, { required: true })}
                onFocus={() => handleInputFocus(`owners.${index}.title`)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor={`email-${owner.id}`}>Owner's Email</Label>
              <Input
                id={`email-${owner.id}`}
                type="email"
                {...register(`owners.${index}.email` as const)}
                onFocus={() => handleInputFocus(`owners.${index}.email`)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" onClick={addOwner} className="mt-4">
        + Add Another Owner
      </Button>

      <div className="mt-6">
        <Label>
          Does this firm or any of its owners have more than 10% ownership in any other firm(s)?
        </Label>
        <Controller
          name="doOwnersHave10PctOwnershipInOtherFirms"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value === 'true')
                setHas10PctOwnership(value === 'true')
              }}
              value={field.value ? 'true' : 'false'}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="ownership-other-firms-yes" />
                <Label htmlFor="ownership-other-firms-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="ownership-other-firms-no" />
                <Label htmlFor="ownership-other-firms-no">No</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>
      {has10PctOwnership && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Affiliates</h4>
              <p className="text-sm text-gray-600 mb-4">
                Because you answered yes to the above question you need to provide the affiliate ownership information for any owner that also owns more than 10% ownership in another firm. You will also need to submit the following additional documentation for the affiliate firm you list below.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mb-6">
                <li>Federal Tax Return – FULL return from the most recent year and 1st page of previous two years</li>
                <li>Federal Form 941(Employer's Quarterly Federal Tax Return) - 1st page only from the most recent four quarters if you are qualifying under the number of employees for small business status</li>
              </ol>
            </div>

            {affiliateFields.map((field, index) => (
              <div key={field.id} className="space-y-4 pt-4 border-t first:border-t-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`affiliates.${index}.ownerName`}>
                      Owner's Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`affiliates.${index}.ownerName`}
                      {...register(`affiliates.${index}.ownerName`, { required: "Owner's name is required" })}
                      onFocus={() => handleInputFocus(`affiliates.${index}.ownerName`)}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`affiliates.${index}.title`}>
                      Title/Position in affiliate firm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`affiliates.${index}.title`}
                      {...register(`affiliates.${index}.title`, { required: "Title is required" })}
                      onFocus={() => handleInputFocus(`affiliates.${index}.title`)}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`affiliates.${index}.ownershipPercentage`}>
                      Ownership % <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`affiliates.${index}.ownershipPercentage`}
                      type="number"
                      min="10"
                      max="100"
                      {...register(`affiliates.${index}.ownershipPercentage`, {
                        required: "Ownership percentage is required",
                        min: { value: 10, message: "Must be at least 10%" },
                        max: { value: 100, message: "Cannot exceed 100%" }
                      })}
                      onFocus={() => handleInputFocus(`affiliates.${index}.ownershipPercentage`)}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`affiliates.${index}.businessRelationship`}>
                    Business Relationship <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id={`affiliates.${index}.businessRelationship`}
                    placeholder="Explain the business relationship with the affiliate."
                    {...register(`affiliates.${index}.businessRelationship`, { required: "Business relationship is required" })}
                    onFocus={() => handleInputFocus(`affiliates.${index}.businessRelationship`)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`affiliates.${index}.firmName`}>
                      Name of affiliate firm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`affiliates.${index}.firmName`}
                      {...register(`affiliates.${index}.firmName`, { required: "Affiliate firm name is required" })}
                      onFocus={() => handleInputFocus(`affiliates.${index}.firmName`)}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`affiliates.${index}.employeeCount`}>
                      Number of employees in affiliate firm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`affiliates.${index}.employeeCount`}
                      type="number"
                      min="0"
                      {...register(`affiliates.${index}.employeeCount`, { 
                        required: "Number of employees is required",
                        min: { value: 0, message: "Cannot be negative" }
                      })}
                      onFocus={() => handleInputFocus(`affiliates.${index}.employeeCount`)}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div>
                  <Label>Country <span className="text-red-500">*</span></Label>
                  <Controller
                    name={`affiliates.${index}.country`}
                    control={control}
                    defaultValue="US"
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryOptions.map(country => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`affiliates.${index}.address`}>
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`affiliates.${index}.address`}
                      placeholder="Enter to search"
                      {...register(`affiliates.${index}.address`, { required: "Address is required" })}
                      onFocus={() => handleInputFocus(`affiliates.${index}.address`)}
                      onBlur={handleInputBlur}
                    />
                    <p className="text-sm text-gray-500 mt-1">Use the above search to auto fill State, City and Zip</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`affiliates.${index}.zipCode`}>
                        ZIP / Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`affiliates.${index}.zipCode`}
                        {...register(`affiliates.${index}.zipCode`, { required: "ZIP code is required" })}
                        onFocus={() => handleInputFocus(`affiliates.${index}.zipCode`)}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`affiliates.${index}.city`}>
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`affiliates.${index}.city`}
                        {...register(`affiliates.${index}.city`, { required: "City is required" })}
                        onFocus={() => handleInputFocus(`affiliates.${index}.city`)}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`affiliates.${index}.state`}>
                        State / Province <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`affiliates.${index}.state`}
                        {...register(`affiliates.${index}.state`, { required: "State is required" })}
                        onFocus={() => handleInputFocus(`affiliates.${index}.state`)}
                        onBlur={handleInputBlur}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => appendAffiliate({})}
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Affiliates
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

