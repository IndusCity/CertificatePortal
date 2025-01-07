'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { useToast } from "@/components/ui/use-toast"
import { saveApplication, getApplicationByTrackingId } from '@/lib/supabase-client'
import { Database } from '@/types/supabase'
import { supabase } from '@/lib/supabase-client'
import { Building2, Briefcase, Users, UserCircle, Award, BadgeCheck, Building, Landmark, User, Users2, Scale, Handshake } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { DesignationsAndBusinessType } from './DesignationsAndBusinessType'
import { GeneralInformation } from './GeneralInformation'
import { TaxInformation } from './TaxInformation'
import { Ownership } from './Ownership'
import { CorporationLLCDetails } from './CorporationLLCDetails'
import { NIGPCommodityCodes } from './NIGPCommodityCodes'
import { NAICSCodes } from './NAICSCodes'
import { FOIAExemption } from './FOIAExemption'
import { formSchema, FormData, mainSteps, subStepsByMainStep, totalSteps } from './application-form-types'
import { BusinessDocuments } from './BusinessDocuments'
import { PersonalDocuments } from './PersonalDocuments'
import { UploadDocuments } from './UploadDocuments'
import { DBEChecklist } from './DBEChecklist'
import { SubmissionDocuments } from './SubmissionDocuments'
import { AdditionalDocuments } from './AdditionalDocuments'
import { GeographicMarketingArea } from './GeographicMarketingArea'
import { UploadInstructions } from './UploadInstructions'
import { GeneralSubmissionDocuments } from './GeneralSubmissionDocuments'
import { BusinessFinancialDocuments } from './BusinessFinancialDocuments'
import { BusinessOperationalDocuments } from './BusinessOperationalDocuments'
import { CorporateOrganizationalDocuments } from './CorporateOrganizationalDocuments'
import { SWaMUploadInstructions } from './SWaMUploadInstructions'
import { SWaMBusinessFormationDocuments } from './SWaMBusinessFormationDocuments'
import { SWaMTaxDocuments } from './SWaMTaxDocuments'
import { SWaMEmploymentDocuments } from './SWaMEmploymentDocuments'
import { SWaMPersonalDocuments } from './SWaMPersonalDocuments'
import { SWaMAdditionalDocuments } from './SWaMAdditionalDocuments'
import { ReviewApplication } from './ReviewApplication'
import { AffidavitAndDebarmentForm } from './AffidavitAndDebarmentForm'
import { FinalSubmission } from './FinalSubmission'
import debounce from 'lodash.debounce';
import { LiveChatAssistant } from '@/components/LiveChatAssistant'

interface ApplicationFormProps {
  currentStep: number
  currentSubstep: number
  onNext: () => void
  onBack: () => void
  onSubstepChange: (substep: number) => void
  onFieldFocus: (field: string | null) => void
}

type ApplicationInsert = Database['public']['Tables']['applications']['Insert']

type FormData = z.infer<typeof formSchema>

export default function ApplicationForm({ 
  currentStep,
  currentSubstep,
  onNext,
  onBack,
  onSubstepChange,
  onFieldFocus
}: ApplicationFormProps) {
  // const { toast } = useToast()
  const [notification, setNotification] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const router = useRouter()
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designations: [] as string[],
      businessType: '',
      legalName: '',
      tradeName: '',
      hasEIN: '',
      ein: '',
      ssn: '',
      physicalAddress: '',
      zipCode: '',
      city: '',
      state: '',
      isMailingSameAsPhysical: false,
      mailingAddress: '',
      isRegisteredWithEVA: '',
      isRegisteredWithVASCC: '',
      isFranchise: '',
      contactName: '',
      contactTitle: '',
      businessPhone: '',
      businessPhoneExt: '',
      businessFax: '',
      businessEmail: '',
      receiveMarketingEmails: '',
      taxIdentificationType: '',
      taxIdentificationNumber: '',
      businessStartDate: '',
      fiscalYearEnd: '',
      annualGrossReceipts: '',
      numEmployees: '',
      ownershipStructure: '',
      ownersInfo: [],
      nigpCodes: [],
      naicsCodes: [],
      exemptionRequested: '',
      exemptionReason: '',
      contacts: []
    },
    mode: 'onBlur',
  })

  const handleInputFocus = (fieldName: string) => {
    onFieldFocus(fieldName);
  }

  const handleInputBlur = () => {
    onFieldFocus(null);
  }

  const handleDesignationChange = (designation: string) => {
    const currentDesignations = watch('designations');
    let updatedDesignations: string[];

    if (designation === 'eso') {
      updatedDesignations = ['eso'];
    } else if (currentDesignations.includes('eso')) {
      updatedDesignations = currentDesignations.filter(d => d !== 'eso');
      updatedDesignations.push(designation);
    } else {
      updatedDesignations = currentDesignations.includes(designation)
        ? currentDesignations.filter(d => d !== designation)
        : [...currentDesignations, designation];
    }

    setValue('designations', updatedDesignations);
  }

  const { fields: contactFields, remove: removeContact, append: appendContact } = useFieldArray({
    control,
    name: "contacts"
  });

  const [contacts, setContacts] = useState([{ id: 1 }]);

  const addContact = () => {
    appendContact({}); // Append to react-hook-form's field array
    setContacts(prev => [...prev, { id: prev.length + 1 }]); // Update state for rendering
  };

  const removeContactHandler = (id: number) => {
    const indexToRemove = contactFields.findIndex(field => parseInt(field.id, 10) === id);
    if (indexToRemove !== -1) {
      removeContact(indexToRemove);
    }

    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const renderCurrentSubstep = () => {
    switch (currentStep) {
      case 1: // Application
        switch (currentSubstep) {
          case 1:
            return <DesignationsAndBusinessType
              watch={watch}
              setValue={setValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              handleDesignationChange={handleDesignationChange}
            />
          case 2:
            return <GeneralInformation
              register={register}
              watch={watch}
              setValue={setValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              control={control}
              removeContact={removeContactHandler}
              addContact={addContact}
              contacts={contacts}
            />
          case 3:
            return <TaxInformation
              register={register}
              setValue={setValue}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 4:
            return <Ownership
              register={register}
              watch={watch}
              setValue={setValue}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 5:
            return <CorporationLLCDetails
              register={register}
              watch={watch}
              setValue={setValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 6:
            return <NIGPCommodityCodes
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 7:
            return <NAICSCodes
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 8:
            return <FOIAExemption
              control={control}
              register={register}
              watch={watch}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          default:
            return <div>No content for this substep</div>
        }
      case 2: // DBE Required Documents
        switch (currentSubstep) {
          case 1:
            return <UploadInstructions
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 2:
            return <DBEChecklist
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 3:
            return <GeneralSubmissionDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 4:
            return <BusinessFinancialDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 5:
            return <PersonalDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 6:
            return <BusinessOperationalDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 7:
            return <CorporateOrganizationalDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 8:
            return <AdditionalDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          default:
            return <div>No content for this substep</div>
        }
      case 3: // SWaM Documents
        switch (currentSubstep) {
          case 1:
            return <SWaMUploadInstructions
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 2:
            return <SWaMBusinessFormationDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 3:
            return <SWaMTaxDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 4:
            return <SWaMEmploymentDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 5:
            return <SWaMPersonalDocuments
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 6:
            return <SWaMAdditionalDocuments
              register={register}
              watch={watch}
              control={control}
              setValue={setValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          default:
            return <div>No content for this substep</div>
        }
      case 4: // Submit
        switch (currentSubstep) {
          case 1:
            return <ReviewApplication
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 2:
            return <AffidavitAndDebarmentForm
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          case 3:
            return <FinalSubmission
              register={register}
              watch={watch}
              control={control}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              onSubmit={handleSubmit(onSubmit)}
            />
          default:
            return <div>No content for this substep</div>
        }
      case 5: // Final Confirmation
        switch (currentSubstep) {
          case 1:
            return <div>Confirmation Details</div>
          case 2:
            return <div>Next Steps</div>
          default:
            return <div>No content for this substep</div>
        }
      default:
        return <div>Invalid step</div>
    }
  }

  const saveApplicationData = useCallback(
    debounce(async (data: Partial<FormData>) => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          throw new Error('User not authenticated')
        }

        if (!trackingId) {
          throw new Error('Tracking ID is not set')
        }

        const cleanedData = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
        ) as FormData

        await saveApplication(user.id, cleanedData, trackingId)
        setNotification('Application saved successfully.') // Set success notification
        setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
      } catch (error) {
        console.error('Error saving application:', error)
        setNotification('Error saving application. Please try again.') // Set error notification
        setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
      }
    }, 1000),
    [trackingId]
  )

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const urlTrackingId = searchParams.get('tracking_id')
    if (urlTrackingId) {
      setTrackingId(urlTrackingId)
    } else if (!trackingId) {
      const newTrackingId = uuidv4()
      setTrackingId(newTrackingId)
      router.push(`/apply?tracking_id=${newTrackingId}`, undefined, { shallow: true })
    }
  }, [trackingId, router])

  useEffect(() => {
    const subscription = watch((data) => {
      saveApplicationData(data);
    });

    return () => subscription.unsubscribe();
  }, [watch, saveApplicationData]);

  useEffect(() => {
    const loadSavedApplication = async () => {
      if (trackingId) {
        try {
          const savedApplication = await getApplicationByTrackingId(trackingId)
          if (savedApplication) {
            Object.entries(savedApplication).forEach(([key, value]) => {
              setValue(key as keyof FormData, value)
            })
          }
        } catch (error) {
          console.error('Error loading saved application:', error)
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadSavedApplication()
  }, [trackingId, setValue])

  useEffect(() => {
    console.log(`Effect triggered. Current Step: ${currentStep}, Current Substep: ${currentSubstep}`);
  }, [currentStep, currentSubstep]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }
      await saveApplication(user.id, data, trackingId || undefined)
      setNotification('Application submitted successfully.') // Set success notification
      setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
      onNext()
    } catch (error) {
      console.error('Error submitting application:', error)
      setNotification('Error submitting application. Please try again.') // Set error notification
      setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
    }
  }

  const handleContinue = () => {
    const currentSubSteps = subStepsByMainStep[currentStep as keyof typeof subStepsByMainStep];
    
    if (currentSubstep < currentSubSteps.length) {
      onSubstepChange(currentSubstep + 1);
    } else {
      const nextStep = currentStep + 1;
      if (nextStep <= totalSteps) {
        onNext();
        // Ensure currentSubstep is set to 1 when moving to the next main step
        onSubstepChange(1);
      } else {
        // Handle form submission if it's the last step
        onSubmit(watch());
      }
    }
    
    // Log the updated step and substep
    console.log(`handleContinue called. New Step: ${currentStep}, New Substep: ${currentSubstep}`);
  };

  return (
    <div>
      <Card className="p-6 w-full">
        {renderCurrentSubstep()}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (currentSubstep > 1) {
                onSubstepChange(currentSubstep - 1)
              } else {
                onBack()
              }
            }}
          >
            Back
          </Button>
          <Button type="button" onClick={handleContinue}>
            {currentStep === totalSteps && currentSubstep === subStepsByMainStep[currentStep as keyof typeof subStepsByMainStep].length ? 'Submit' : 'Continue'}
          </Button>
        </div>
      </Card>
      <div className="fixed bottom-4 left-4">
        {/* Display notification if it exists */}
        {notification && (
          <div className="bg-green-500 text-white p-3 rounded-md" role="alert">
            {notification}
          </div>
        )}
      </div>
      <LiveChatAssistant />
    </div>
  )
}

