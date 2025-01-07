'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import ApplicationForm from './components/application-form'
import FormSidebar from './components/form-sidebar'
import FormProgress from './components/form-progress'
import { FileText, FileCheck, FileInput, FileSearch, Send, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { TypeIcon as type, type LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { saveApplication } from '../../lib/save-application'
import { supabase } from '@/lib/supabase-client' // Updated import path
import { cn } from "@/lib/utils"

const formSchema = z.object({
  business_name: z.string().min(2, { message: "Business name is required" }),
  business_type: z.string().min(2, { message: "Business type is required" }),
  legal_name: z.string().min(2, { message: "Legal name is required" }),
  trade_name: z.string().optional(),
  federal_ein: z.string().optional(),
  ssn: z.string().optional(),
  physical_address: z.string().min(2, { message: "Physical address is required" }),
  mailing_address: z.string().optional(),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zip_code: z.string().min(5, { message: "Valid ZIP code is required" }),
  business_phone: z.string().min(10, { message: "Valid phone number is required" }),
  business_fax: z.string().optional(),
  business_email: z.string().email({ message: "Valid email is required" }),
  contact_name: z.string().min(2, { message: "Contact name is required" }),
  contact_title: z.string().min(2, { message: "Contact title is required" }),
  website: z.string().url().optional(),
  is_franchise: z.boolean(),
  is_registered_eva: z.boolean(),
  is_registered_va_scc: z.boolean(),
  receive_marketing_emails: z.boolean(),
  certification_type: z.array(z.string()).min(1, { message: "Select at least one certification type" }),
})

type FormData = z.infer<typeof formSchema>

function StepTiles({ steps, currentStep, stepIcons }: { steps: string[], currentStep: number, stepIcons: Record<string, LucideIcon> }) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => {
        const Icon = stepIcons[step as keyof typeof stepIcons];
        const isCompleted = index + 1 < currentStep;
        const isCurrent = index + 1 === currentStep;
        return (
          <motion.div 
            key={step} 
            className={`flex flex-col items-center p-2 rounded-lg ${
              isCurrent 
                ? 'bg-blue-100 text-blue-700' 
                : isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {Icon && <Icon className="w-6 h-6 mb-1" />}
            <span className="text-xs text-center">{step}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentSubstep, setCurrentSubstep] = useState(1)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const totalSteps = 5 // Updated total steps

  const steps = [
    'Application',
    'DBE Required Documents',
    'SWaM Documents',
    'Submit',
    'Final Confirmation'
  ]

  const stepIcons = {
    'Application': FileText,
    'DBE Required Documents': FileCheck,
    'SWaM Documents': FileSearch,
    'Submit': Send,
    'Final Confirmation': CheckCircle
  }

  const applicationSubsteps = [
    'Designations and Business Types',
    'General Information',
    'Tax Information', 
    'Ownership',
    'Corporation LLC or LLP Details',
    'NIGP Commodity Codes',
    'Geographic Marketing Area',
    'FOIA Exemption'
  ]

  const subStepsByMainStep = {
    1: applicationSubsteps,
    2: ['Business Documents', 'Personal Documents', 'Additional Documents'],
    3: ['SWaM Business Documents', 'SWaM Ownership Documents', 'SWaM Certification Statement'],
    4: ['Review Application', 'Certify Information', 'Submit Application'],
    5: ['Confirmation Details', 'Next Steps']
  };

  const { handleSubmit } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_franchise: false,
      is_registered_eva: false,
      is_registered_va_scc: false,
      receive_marketing_emails: false,
      certification_type: [],
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    // Add your form submission logic here
  }

  const handleNext = () => {
    const currentSubSteps = subStepsByMainStep[currentStep as keyof typeof subStepsByMainStep] || [];

    if (currentSubstep < currentSubSteps.length) {
      setCurrentSubstep(prev => prev + 1);
    } else {
      const nextStep = currentStep + 1;
      if (nextStep <= totalSteps) {
        setCurrentStep(nextStep);
        setCurrentSubstep(1);
      } else {
        // Handle form submission if it's the last step
        handleSubmit(onSubmit)();
      }
    }

    console.log(`handleNext called. New Step: ${currentStep}, New Substep: ${currentSubstep}`);
  };

  const handleBack = () => {
    if (currentStep === 1 && currentSubstep > 1) {
      setCurrentSubstep(prev => prev - 1)
    } else if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setCurrentSubstep(applicationSubsteps.length)
    }
  }

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

  useEffect(() => {
    console.log(`Effect triggered. Current Step: ${currentStep}, Current Substep: ${currentSubstep}`);
  }, [currentStep, currentSubstep]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarVisible ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </button>
      {/* Left Sidebar - Progress Steps */}
      {isSidebarVisible && (
        <div className="w-64 bg-white border-r">
          <FormProgress 
            currentStep={currentStep}
            currentSubstep={currentSubstep}
            toggleSidebar={toggleSidebar}
          />
        </div>
      )}

      {/* Main Form Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarVisible ? '' : 'ml-0'}`}>
        <div className="p-8">
          {/* Top Progress Bar */}
          <div className="mb-8">
            <StepTiles steps={steps} currentStep={currentStep} stepIcons={stepIcons} />
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
  <div
    className={cn(
      "h-full transition-all duration-500 ease-in-out",
      "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600",
      "rounded-full shadow-lg shadow-blue-500/50"
    )}
    style={{
      width: `${((currentStep - 1 + currentSubstep / subStepsByMainStep[currentStep as keyof typeof subStepsByMainStep].length) / totalSteps) * 100}%`
    }}
  />
  <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
    {steps.map((step, index) => {
      const stepProgress = index + 1 < currentStep ? 1 : 
                           index + 1 > currentStep ? 0 :
                           currentSubstep / subStepsByMainStep[currentStep as keyof typeof subStepsByMainStep].length;
      return (
        <div key={index} className="relative flex items-center justify-center">
          <div
            className={cn(
              "w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center",
              stepProgress > 0 ? "bg-blue-600" : "bg-gray-400",
              index + 1 === currentStep && "ring-4 ring-blue-200"
            )}
          >
            {stepProgress === 1 && <CheckCircle className="w-3 h-3 text-white" />}
          </div>
          {index < steps.length - 1 && (
            <div 
              className="absolute w-full h-1 bg-gray-300 left-5"
              style={{
                width: `${100 / (steps.length - 1)}%`,
                background: `linear-gradient(to right, ${stepProgress > 0 ? '#2563eb' : '#d1d5db'} ${stepProgress * 100}%, #d1d5db ${stepProgress * 100}%)`
              }}
            />
          )}
        </div>
      );
    })}
  </div>
</div> {/* Updated Progress component */}
          </div>

          {/* Main Form and Sidebar */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3">
              <ApplicationForm 
                currentStep={currentStep}
                currentSubstep={currentSubstep}
                onNext={handleNext}
                onBack={handleBack}
                onSubstepChange={setCurrentSubstep}
                onFieldFocus={setFocusedField} 
              />
            </div>

            {/* Right Sidebar - Help/Guidelines */}
            <div className="w-full md:w-1/3">
              <FormSidebar currentStep={currentStep} currentSubstep={currentSubstep} focusedField={focusedField} /> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FormProgressProps {
  currentStep: number
  currentSubstep: number
  toggleSidebar: () => void
}

