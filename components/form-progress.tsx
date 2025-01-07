'use client'

import { motion } from 'framer-motion'
import { mainSteps, subStepsByMainStep, totalSteps } from './application-form-types'
import { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'

interface FormProgressProps {
  currentStep: number
  currentSubstep: number
  toggleSidebar: () => void
}

export default function FormProgress({ currentStep, currentSubstep, toggleSidebar }: FormProgressProps) {
  // const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const currentMainStep = mainSteps[currentStep - 1]
  const currentSubSteps = subStepsByMainStep[currentStep as keyof typeof subStepsByMainStep] || [];

  // Ensure currentSubstep is always a number
  const safeCurrentSubstep = currentSubstep || 1;

  console.log('FormProgress - Current Step:', currentStep, 'Current Substep:', safeCurrentSubstep);

  useEffect(() => {
    console.log(`FormProgress Effect - Current Step: ${currentStep}, Current Substep: ${safeCurrentSubstep}`);
  }, [currentStep, safeCurrentSubstep]);

  const totalStepsCount = totalSteps.length; // Get the total number of steps dynamically

  // Remove this line:
  // const toggleSidebar = () => {
  //   setIsSidebarVisible(!isSidebarVisible)
  // }

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out",
      "w-64" //Always show sidebar
    )}>
      <div className="p-4">
        <Button
          variant="outline"
          size="sm"
          className="mb-4 w-full"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4 mr-2" />
          {'Hide Progress'} {/*Always show "Hide Progress" since sidebar is always visible*/}
        </Button>
        
        {/* Remove this:
        {isSidebarVisible && (
          <div className="bg-white shadow-md rounded-lg p-6">
            ...
          </div>
        )}
        */}
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Progress</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-lg font-semibold text-blue-700">{currentMainStep.title}</p>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {totalStepsCount} (Sub-step {safeCurrentSubstep} of {currentSubSteps.length})
              </p>
            </div>

            {/* Sub-steps */}
            <div className="mt-6 space-y-2">
              {currentSubSteps?.map((step, index) => {
                const stepNumber = index + 1;
                const isCurrentSubstep = stepNumber === safeCurrentSubstep;
                const isCompletedSubstep = stepNumber < safeCurrentSubstep;

                return (
                  <div
                    key={step}
                    className={cn(
                      "p-2 rounded-lg transition-colors flex items-center",
                      isCurrentSubstep
                        ? "bg-blue-100 text-blue-700 font-medium border-2 border-blue-500"
                        : isCompletedSubstep
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full mr-2 flex-shrink-0 flex items-center justify-center text-xs font-medium",
                      isCurrentSubstep
                        ? "bg-blue-500 text-white"
                        : isCompletedSubstep
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    )}>
                      {isCompletedSubstep ? "✓" : stepNumber}
                    </div>
                    <span className="flex-grow text-sm">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  )
}

