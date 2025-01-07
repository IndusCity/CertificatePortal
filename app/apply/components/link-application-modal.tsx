'use client'

import { useState } from 'react'
import { X, Briefcase, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

interface LinkApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (type: 'ein' | 'ssn', value: string) => void
}

export function LinkApplicationModal({ isOpen, onClose, onSubmit }: LinkApplicationModalProps) {
  const [identificationType, setIdentificationType] = useState<'ein' | 'ssn'>('ssn')
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const formatValue = (input: string) => {
    // Remove all non-digits
    const numbers = input.replace(/\D/g, '')
    
    if (identificationType === 'ssn') {
      // Format as SSN (XXX-XX-XXXX)
      if (numbers.length <= 3) return numbers
      if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
    } else {
      // Format as EIN (XX-XXXXXXX)
      if (numbers.length <= 2) return numbers
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 9)}`
    }
  }

  const validateInput = (input: string) => {
    const numbers = input.replace(/\D/g, '')
    if (identificationType === 'ssn') {
      return numbers.length === 9
    } else {
      return numbers.length === 9
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatValue(e.target.value)
    setValue(formatted)
    setError(null)
  }

  const handleSubmit = () => {
    if (!validateInput(value)) {
      setError(`Please enter a valid ${identificationType.toUpperCase()}`)
      return
    }
    onSubmit(identificationType, value)
    router.push('/apply')
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Link Application</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Select Identification Type</Label>
            <RadioGroup
              value={identificationType}
              onValueChange={(value: 'ein' | 'ssn') => {
                setIdentificationType(value)
                setValue('')
                setError(null)
              }}
              className="grid grid-cols-1 gap-4"
            >
              <div className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer ${identificationType === 'ein' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="ein" id="ein" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                    <Label htmlFor="ein" className="font-medium">Federal EIN</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Use your Federal Employer Identification Number if you have registered your business with the IRS.
                  </p>
                </div>
              </div>
              <div className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer ${identificationType === 'ssn' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="ssn" id="ssn" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <Label htmlFor="ssn" className="font-medium">SSN</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Use your Social Security Number if you're a sole proprietor or haven't obtained an EIN yet.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identifier">
              {identificationType === 'ssn' ? 'Social Security Number' : 'Federal Employer Identification Number'}
            </Label>
            <Input
              id="identifier"
              value={value}
              onChange={handleInputChange}
              placeholder={identificationType === 'ssn' ? '123-45-6789' : '12-3456789'}
              className="font-mono"
              maxLength={identificationType === 'ssn' ? 11 : 10}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

