import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldValues } from 'react-hook-form'
import { FormData } from './application-form-types'

interface CorporationLLCDetailsProps {
  register: UseFormRegister<FormData>
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function CorporationLLCDetails({
  register,
  watch,
  setValue,
  handleInputFocus,
  handleInputBlur
}: CorporationLLCDetailsProps) {
  const [verifyingAddress, setVerifyingAddress] = useState(false)

  const handleVerifyAddress = () => {
    setVerifyingAddress(true)
    // Implement address verification logic here
    setTimeout(() => {
      setVerifyingAddress(false)
      // Update address fields with verified data
    }, 1000)
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Corporation, LLC or LLP Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="yearBusinessIncorporated">Year Business Incorporated*</Label>
          <Select 
            onValueChange={(value) => setValue('yearBusinessIncorporated', value)}
            onOpenChange={() => handleInputFocus('yearBusinessIncorporated')}
          >
            <SelectTrigger id="yearBusinessIncorporated">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">During which year was your business officially incorporated?</p>
        </div>
        
        <div>
          <Label htmlFor="stateOfIncorporation">State*</Label>
          <Select 
            onValueChange={(value) => setValue('stateOfIncorporation', value)}
            onOpenChange={() => handleInputFocus('stateOfIncorporation')}
          >
            <SelectTrigger id="stateOfIncorporation">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {/* Add state options here */}
              <SelectItem value="VA">Virginia</SelectItem>
              {/* Add more states */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="registeredAgentName">Name of the Registered Agent*</Label>
          <Input
            id="registeredAgentName"
            {...register('registeredAgentName', { required: true })}
            onFocus={() => handleInputFocus('registeredAgentName')}
            onBlur={handleInputBlur}
          />
        </div>
        
        <div>
          <Label htmlFor="registeredAgentPhone">Registered Agent's Phone Number*</Label>
          <Input
            id="registeredAgentPhone"
            {...register('registeredAgentPhone', { required: true })}
            onFocus={() => handleInputFocus('registeredAgentPhone')}
            onBlur={handleInputBlur}
          />
          <p className="text-sm text-gray-500 mt-1">(XXX) XXX-XXXX</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Address of Registered Agent</h4>
        
        <div>
          <Label htmlFor="country">Country*</Label>
          <Select 
            onValueChange={(value) => setValue('country', value)}
            onOpenChange={() => handleInputFocus('country')}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              {/* Add more countries */}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Label htmlFor="address">Address*</Label>
          <Input
            id="address"
            {...register('address', { required: true })}
            onFocus={() => handleInputFocus('address')}
            onBlur={handleInputBlur}
            placeholder="Enter to search"
          />
          <Button 
            type="button" 
            onClick={handleVerifyAddress}
            disabled={verifyingAddress}
            className="absolute right-0 top-0 mt-6"
          >
            {verifyingAddress ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
        <p className="text-sm text-gray-500">Use the above search to auto fill State, City and Zip</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="zip">ZIP / Postal Code*</Label>
            <Input
              id="zip"
              {...register('zip', { required: true })}
              onFocus={() => handleInputFocus('zip')}
              onBlur={handleInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="city">City*</Label>
            <Input
              id="city"
              {...register('city', { required: true })}
              onFocus={() => handleInputFocus('city')}
              onBlur={handleInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="state">State / Province*</Label>
            <Input
              id="state"
              {...register('state', { required: true })}
              onFocus={() => handleInputFocus('state')}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

