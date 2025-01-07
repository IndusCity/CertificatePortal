import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormRegister, UseFormWatch, UseFormSetValue, Control, Controller } from 'react-hook-form'
import { FormData } from './application-form-types'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { searchAddress } from '@/lib/nominatim-api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  // Add more countries as needed
]

interface GeneralInformationProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
  control: Control<FormData>
  removeContact: (id: number) => void
}

export function GeneralInformation({
  register,
  watch,
  setValue,
  handleInputFocus,
  handleInputBlur,
  control,
  removeContact
}: GeneralInformationProps) {
  const [einInput, setEinInput] = useState('')
  const [ssnInput, setSsnInput] = useState('')
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [contacts, setContacts] = useState([{ id: 1 }]);

  const addContact = () => {
    setContacts([...contacts, { id: contacts.length + 1 }]);
  };

  const removeContactHandler = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);

    // Remove the contact from the form data
    const existingContacts = watch('contacts') || [];
    const updatedFormContacts = existingContacts.filter((_, index) => index + 1 !== id);
    setValue('contacts', updatedFormContacts);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  })

  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    // You might want to add some UI feedback here
  }

  const formatEIN = (input: string) => {
    const numbers = input.replace(/[^\d]/g, '')
    if (numbers.length <= 2) return numbers
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 9)}`
  }

  const formatSSN = (input: string) => {
    const numbers = input.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
  }

  const handleEINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value)
    setEinInput(formatted)
    setValue('ein', formatted)
  }

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value)
    setSsnInput(formatted)
    setValue('ssn', formatted)
  }

  const handleAddressSearch = async (query: string) => {
    if (query.length < 3) return
    setIsSearching(true)
    try {
      const suggestions = await searchAddress(query)
      setAddressSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddressSelect = (selected: any) => {
    setValue('physicalAddress', selected.display_name);
    setValue('city', selected.address.city || selected.address.town || '');
    setValue('state', selected.address.state || '');
    setValue('zipCode', selected.address.postcode || '');
    setValue('country', selected.address.country_code?.toUpperCase() || '');
    if (watch('isMailingSameAsPhysical')) {
      setValue('mailingAddress', selected.display_name);
    }
    setAddressSuggestions([]);
  };

  useEffect(() => {
    setEinInput(watch('ein') || '')
    setSsnInput(watch('ssn') || '')

    // Load existing contacts from form data
    const existingContacts = watch('contacts') || [];
    if (existingContacts.length === 0) {
      setContacts([{ id: 1 }]); // Initialize with one contact if none exist
    } else {
      setContacts(existingContacts.map((contact, index) => ({ ...contact, id: index + 1 })));
    }
  }, [watch])

  useEffect(() => {
    if (watch('isMailingSameAsPhysical')) {
      setValue('mailingAddress', watch('physicalAddress'));
    }
  }, [watch('physicalAddress'), watch('isMailingSameAsPhysical'), setValue]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Business Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="legalName">Legal Business Name*</Label>
            <Input 
              {...register('legalName', { required: true })}
              id="legalName"
              onFocus={() => handleInputFocus('legalName')}
              onBlur={handleInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="tradeName">Trade name, if different from legal business name</Label>
            <Input 
              {...register('tradeName')}
              id="tradeName"
              onFocus={() => handleInputFocus('tradeName')}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Do you have a Federal EIN? *</Label>
          <Controller
            name="hasEIN"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value === 'no') {
                    setValue('ein', '')
                    setEinInput('')
                  } else {
                    setValue('ssn', '')
                    setSsnInput('')
                  }
                }}
                defaultValue={field.value}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="ein-yes" />
                  <Label htmlFor="ein-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="ein-no" />
                  <Label htmlFor="ein-no">No</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        {watch('hasEIN') === 'yes' && (
          <div>
            <Label htmlFor="ein">Federal EIN *</Label>
            <Input
              id="ein"
              value={einInput}
              onChange={handleEINChange}
              maxLength={10}
              placeholder="XX-XXXXXXX"
              onFocus={() => handleInputFocus('ein')}
              onBlur={handleInputBlur}
            />
            {einInput && !/^\d{2}-\d{7}$/.test(einInput) && (
              <p className="text-red-500 text-sm mt-1">EIN must be in the format XX-XXXXXXX</p>
            )}
          </div>
        )}
        {watch('hasEIN') === 'no' && (
          <div>
            <Label htmlFor="ssn">Social Security Number *</Label>
            <Input
              id="ssn"
              value={ssnInput}
              onChange={handleSSNChange}
              maxLength={11}
              placeholder="XXX-XX-XXXX"
              onFocus={() => handleInputFocus('ssn')}
              onBlur={handleInputBlur}
            />
            {ssnInput && !/^\d{3}-\d{2}-\d{4}$/.test(ssnInput) && (
              <p className="text-red-500 text-sm mt-1">SSN must be in the format XXX-XX-XXXX</p>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Address Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="country">Country*</Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="physicalAddress">Physical Address*</Label>
            <div className="relative">
              <Input 
                {...register('physicalAddress', { required: true })}
                id="physicalAddress"
                onFocus={() => handleInputFocus('physicalAddress')}
                onBlur={() => {
                  handleInputBlur()
                  setTimeout(() => setAddressSuggestions([]), 200)
                }}
                onChange={(e) => handleAddressSearch(e.target.value)}
              />
              {isSearching && <p className="text-sm text-gray-500 mt-1">Searching...</p>}
              {addressSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleAddressSelect(suggestion)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP / Postal Code*</Label>
              <Input 
                {...register('zipCode', { required: true })}
                id="zipCode"
                onFocus={() => handleInputFocus('zipCode')}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="city">City*</Label>
              <Input 
                {...register('city', { required: true })}
                id="city"
                onFocus={() => handleInputFocus('city')}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="state">State / Province*</Label>
            <Input 
              {...register('state', { required: true })}
              id="state"
              onFocus={() => handleInputFocus('state')}
              onBlur={handleInputBlur}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isMailingSameAsPhysical" 
              checked={watch('isMailingSameAsPhysical')}
              onCheckedChange={(checked) => {
                setValue('isMailingSameAsPhysical', checked === true);
                if (checked) {
                  setValue('mailingAddress', watch('physicalAddress'));
                } else {
                  setValue('mailingAddress', '');
                }
              }}
            />
            <Label htmlFor="isMailingSameAsPhysical">Mailing Address same as Physical Address</Label>
          </div>
          {!watch('isMailingSameAsPhysical') && (
            <div>
              <Label htmlFor="mailingAddress">Mailing Address</Label>
              <Input 
                {...register('mailingAddress')}
                id="mailingAddress"
                onFocus={() => handleInputFocus('mailingAddress')}
                onBlur={handleInputBlur}
                readOnly={watch('isMailingSameAsPhysical')}
                className={watch('isMailingSameAsPhysical') ? 'bg-gray-100' : ''}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        {contacts.map((contact, index) => (
          <div key={contact.id} className="border-t pt-4 mt-4">
            {index > 0 && <h4 className="text-md font-medium mb-4">Additional Contact {index}</h4>}
            <div className="space-y-4">
              <div>
                <Label htmlFor={`contactName-${contact.id}`}>Contact Person Name{index === 0 && '*'}</Label>
                <Input 
                  {...register(`contacts.${index}.contactName`, { required: index === 0 })}
                  id={`contactName-${contact.id}`}
                  onFocus={() => handleInputFocus(`contacts.${index}.contactName`)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor={`contactTitle-${contact.id}`}>Title{index === 0 && '*'}</Label>
                <Input 
                  {...register(`contacts.${index}.contactTitle`, { required: index === 0 })}
                  id={`contactTitle-${contact.id}`}
                  onFocus={() => handleInputFocus(`contacts.${index}.contactTitle`)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor={`businessPhone-${contact.id}`}>Business Phone{index === 0 && '*'}</Label>
                <Input 
                  {...register(`contacts.${index}.businessPhone`, { required: index === 0 })}
                  id={`businessPhone-${contact.id}`}
                  onFocus={() => handleInputFocus(`contacts.${index}.businessPhone`)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor={`businessPhoneExt-${contact.id}`}>Business Phone Extension</Label>
                <Input 
                  {...register(`contacts.${index}.businessPhoneExt`)}
                  id={`businessPhoneExt-${contact.id}`}
                  onFocus={() => handleInputFocus(`contacts.${index}.businessPhoneExt`)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor={`businessEmail-${contact.id}`}>Business Email{index === 0 && '*'}</Label>
                <Input 
                  {...register(`contacts.${index}.businessEmail`, { required: index === 0 })}
                  type="email"
                  id={`businessEmail-${contact.id}`}
                  onFocus={() => handleInputFocus(`contacts.${index}.businessEmail`)}
                  onBlur={handleInputBlur}
                />
              </div>
              {index > 0 && (
                <Button variant="destructive" onClick={() => removeContactHandler(contact.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Contact
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addContact}
          className="mt-4"
        >
          Add Another Contact
        </Button>
      </div>
    </div>
  )
}

