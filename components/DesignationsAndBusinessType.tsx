import { motion } from 'framer-motion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { certificationTypes, businessTypes, FormData } from './application-form-types'
import { UseFormWatch, UseFormSetValue } from 'react-hook-form'

interface DesignationsAndBusinessTypeProps {
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
  handleDesignationChange: (designation: string) => void
}

export function DesignationsAndBusinessType({
  watch,
  setValue,
  handleInputFocus,
  handleInputBlur,
  handleDesignationChange
}: DesignationsAndBusinessTypeProps) {
  return (
    <div className="space-y-6" onFocus={() => handleInputFocus('Designations')} onBlur={handleInputBlur}>
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Select the designations you are applying for:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificationTypes.map((cert) => (
            <motion.div 
              key={cert.id} 
              className={`border rounded-lg p-4 flex flex-col items-start space-y-2 cursor-pointer ${
                watch('designations')?.includes(cert.id) ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDesignationChange(cert.id)}
            >
              <div className="flex items-center space-x-2">
                <cert.icon className="w-5 h-5" />
                <span className="font-medium">{cert.label}</span>
              </div>
              <p className="text-sm text-gray-600">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Which of the following describes your business?
        </h3>
        <RadioGroup
          value={watch().businessType}
          onValueChange={(value) => setValue('businessType', value)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {businessTypes.map((type) => (
            <motion.div
              key={type.id}
              className={`border rounded-lg p-4 flex items-start space-x-2 cursor-pointer ${
                watch().businessType === type.id ? 'bg-blue-50 border-blue-500' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onFocus={() => handleInputFocus(type.id)}
              onBlur={handleInputBlur}
            >
              <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
              <Label htmlFor={type.id} className="flex-grow cursor-pointer">
                <div className="flex items-center space-x-2">
                  <type.icon className="w-5 h-5" />
                  <span className="font-medium">{type.label}</span>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

