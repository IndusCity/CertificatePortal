import { z } from 'zod'
import { Building2, Briefcase, Users, UserCircle, Award, BadgeCheck, Building, Landmark, User, Users2, Scale, Handshake, FileText, FileCheck, FileInput, FileSearch, Send, CheckCircle } from 'lucide-react'

export const formSchema = z.object({
  designations: z.array(z.string()),
  businessType: z.string(),
  legalName: z.string(),
  tradeName: z.string().optional(),
  hasEIN: z.string(),
  ein: z.string().optional(),
  ssn: z.string().optional(),
  physicalAddress: z.string(),
  zipCode: z.string(),
  city: z.string(),
  state: z.string(),
  isMailingSameAsPhysical: z.boolean(),
  mailingAddress: z.string().optional(),
  isRegisteredWithEVA: z.string(),
  isRegisteredWithVASCC: z.string(),
  isFranchise: z.string(),
  contactName: z.string(),
  contactTitle: z.string(),
  businessPhone: z.string(),
  businessPhoneExt: z.string().optional(),
  businessFax: z.string().optional(),
  businessEmail: z.string(),
  receiveMarketingEmails: z.string(),
  taxIdentificationType: z.string(),
  taxIdentificationNumber: z.string(),
  businessStartDate: z.string(),
  fiscalYearEnd: z.string(),
  annualGrossReceipts: z.string().transform((val) => (val === '' ? null : parseFloat(val))),
  numEmployees: z.string(),
  ownershipStructure: z.string(),
  ownersInfo: z.array(z.object({
    name: z.string(),
    title: z.string(),
    ownership: z.string(),
  })),
  owners: z.array(z.object({
    fullName: z.string(),
    ownershipPercentage: z.number().min(0).max(100),
    ethnicity: z.string(),
    gender: z.string(),
    address: z.string(),
    title: z.string(),
    email: z.string().email().optional(),
  })),
  doOwnersHave10PctOwnershipInOtherFirms: z.boolean(),
  corporationInfo: z.object({
    stateOfIncorporation: z.string(),
    dateOfIncorporation: z.string(),
    corporationType: z.string(),
  }).optional(),
  llcInfo: z.object({
    stateOfFormation: z.string(),
    dateOfFormation: z.string(),
    llcType: z.string(),
  }).optional(),
  nigpCodes: z.array(z.string()),
  naicsCodes: z.array(z.object({
    description: z.string(),
    code: z.string().regex(/^\d{6}$/, "NAICS code must be a 6-digit number")
  })),
  isConfidential: z.boolean(),
  confidentialityReason: z.string().optional(),
  exemptionRequested: z.string(),
  exemptionReason: z.string().optional(),
  businessEstablishmentYear: z.string(),
  annualReceipts: z.object({
    mostRecent: z.object({
      amount: z.string(),
      year: z.string()
    }),
    twoYearsAgo: z.object({
      amount: z.string(),
      year: z.string()
    }),
    threeYearsAgo: z.object({
      amount: z.string(),
      year: z.string()
    })
  }),
  contacts: z.array(z.object({
    contactName: z.string(),
    contactTitle: z.string(),
    businessPhone: z.string(),
    businessPhoneExt: z.string().optional(),
    businessEmail: z.string().email()
  })),
  affiliates: z.array(z.object({
    ownerName: z.string(),
    title: z.string(),
    ownershipPercentage: z.number().min(10).max(100),
    businessRelationship: z.string(),
    firmName: z.string(),
    employeeCount: z.number().min(0),
    country: z.string(),
    address: z.string(),
    zipCode: z.string(),
    city: z.string(),
    state: z.string()
  })),
  generalSubmissionDocuments: z.array(z.string()),
  businessFinancialDocuments: z.array(z.string()),
  personalDocuments: z.array(z.string()),
  businessOperationalDocuments: z.array(z.string()),
  corporateOrganizationalDocuments: z.array(z.string()),
  additionalDocuments: z.array(z.string()),
  swamBusinessFormationDocuments: z.array(z.string()),
  swamTaxDocuments: z.array(z.string()),
  swamEmploymentDocuments: z.array(z.string()),
  swamPersonalDocuments: z.array(z.string()),
  swamAdditionalDocuments: z.array(z.string())
})

export type FormData = z.infer<typeof formSchema>

export const certificationTypes = [
  { id: 'small', label: 'Small', icon: Building2, description: 'For businesses with limited revenue and employees.' },
  { id: 'micro', label: 'Micro', icon: Briefcase, description: 'For very small businesses with few employees.' },
  { id: 'women', label: 'Women-Owned', icon: Users, description: 'For businesses primarily owned by women.' },
  { id: 'minority', label: 'Minority-Owned', icon: UserCircle, description: 'For businesses owned by minority individuals.' },
  { id: 'veteran', label: 'Service-Disabled Veteran-Owned', icon: Award, description: 'For businesses owned by service-disabled veterans.' },
  { id: 'eso', label: 'Employment Services Organization (ESO)', icon: Users2, description: 'For organizations providing employment services.' },
  { id: 'dbe', label: 'Disadvantaged Business Enterprise (DBE)', icon: BadgeCheck, description: 'For socially and economically disadvantaged businesses.' },
  { id: 'acdbe', label: 'Airport Concessionaire DBE (ACDBE)', icon: Briefcase, description: 'For disadvantaged businesses operating airport concessions.' },
  { id: '8a', label: 'Federal 8(a)', icon: Building, description: 'For socially and economically disadvantaged businesses in federal contracting.' },
  { id: 'fedsdvosb', label: 'Federal Service-Disabled Veteran-Owned Small Business', icon: Award, description: 'For service-disabled veteran-owned small businesses in federal contracting.' },
  { id: 'edwosb', label: 'Economically Disadvantaged Women-Owned Small Business', icon: Users, description: 'For economically disadvantaged women-owned small businesses.' },
  { id: 'wosb', label: 'Women-Owned Small Business (WOSB)', icon: Users, description: 'For women-owned small businesses in federal contracting.' }
]

export const businessTypes = [
  { id: 'LLC', label: 'LLC', icon: Building, description: 'Limited Liability Company' },
  { id: 'Corporation', label: 'Corporation', icon: Landmark, description: 'Separate legal entity' },
  { id: 'SoleProprietorship', label: 'Sole Proprietorship', icon: User, description: 'Single owner business' },
  { id: 'Partnership', label: 'Partnership', icon: Users2, description: 'Business with multiple owners' },
  { id: 'LLP', label: 'LLP', icon: Scale, description: 'Limited Liability Partnership' },
  { id: 'JointVentures', label: 'Joint Ventures', icon: Handshake, description: 'Temporary partnership' }
]

export const mainSteps = [
  { id: 1, title: 'Application', icon: FileText },
  { id: 2, title: 'DBE Required Documents', icon: FileCheck },
  { id: 3, title: 'SWaM Documents', icon: FileSearch },
  { id: 4, title: 'Submit', icon: Send },
  { id: 5, title: 'Final Confirmation', icon: CheckCircle }
] as const

export const subStepsByMainStep = {
  1: [ // Application
    'Designations and Business Types',
    'General Information',
    'Tax Information',
    'Ownership',
    'Corporation LLC or LLP Details',
    'NIGP Commodity Codes',
    'Geographic Marketing Area',
    'FOIA Exemption'
  ],
  2: [ // DBE Required Documents
    'Upload Instructions',
    'DBE Checklist',
    'General Submission Documents',
    'Business Financial Documents',
    'Personal Documents',
    'Business Operational Documents',
    'Corporate/Organizational Documents',
    'Additional Documents'
  ],
  3: [ // SWaM Documents
    'Upload Instructions',
    'Business Formation Documents',
    'Tax Documents',
    'Employment Documents',
    'Personal Documents',
    'Additional Documents'
  ],
  4: [ // Submit
    'Review Application',
    'Affidavit and Debarment Form',
    'Final Submission'
  ],
  5: [ // Final Confirmation
    'Confirmation Details',
    'Next Steps'
  ]
} as const;

export const totalSteps = mainSteps.length

