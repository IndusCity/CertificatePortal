import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

function calculateCompletionPercentage(applicationData: Partial<Database['public']['Tables']['applications']['Insert']>): number {
  const requiredFields = [
    'business_name',
    'business_type',
    'legal_name',
    'physical_address',
    'city',
    'state',
    'zip_code',
    'business_phone',
    'business_email',
    'contact_name',
    'contact_title',
    'certification_type',
    'businessEstablishmentYear',
    'annualReceipts',
    'contacts',
    'affiliates',
    // Add more required fields as needed
  ];

  const documentFields = [
    'generalSubmissionDocuments',
    'businessFinancialDocuments',
    'personalDocuments',
    'businessOperationalDocuments',
    'corporateOrganizationalDocuments',
    'additionalDocuments',
    'swamBusinessFormationDocuments',
    'swamTaxDocuments',
    'swamEmploymentDocuments',
    'swamPersonalDocuments',
    'swamAdditionalDocuments'
  ];

  const totalFields = requiredFields.length + documentFields.length;
  const completedFields = requiredFields.filter(field => 
    applicationData[field] !== undefined && 
    applicationData[field] !== null && 
    applicationData[field] !== ''
  ).length;

  const completedDocuments = documentFields.filter(field => 
    Array.isArray(applicationData[field]) && 
    applicationData[field].length > 0
  ).length;

  return Math.round(((completedFields + completedDocuments) / totalFields) * 100);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        updated_at: new Date().toISOString(),
      })

    if (profileError) throw profileError
  }

  return data
}

export async function signIn(email: string, password: string) {
  console.log('Signing in with:', email)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error)
    throw error
  }

  console.log('Sign in successful:', data)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  return data
}

export async function updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)

  if (error) throw error

  return data
}

export async function saveApplication(
  userId: string, 
  applicationData: Omit<FormData, 'id' | 'user_id' | 'updated_at'>,
  trackingId?: string
) {
  // Remove null values
  const cleanedData = Object.fromEntries(
    Object.entries(applicationData).filter(([_, value]) => value != null)
  );

  // Map form fields to database columns
  const mappedData = {
    business_name: cleanedData.legalName,
    business_type: cleanedData.businessType,
    legal_name: cleanedData.legalName,
    trade_name: cleanedData.tradeName,
    federal_ein: cleanedData.ein,
    ssn: cleanedData.ssn,
    physical_address: cleanedData.physicalAddress,
    mailing_address: cleanedData.mailingAddress,
    city: cleanedData.city,
    state: cleanedData.state,
    zip_code: cleanedData.zipCode,
    business_phone: cleanedData.businessPhone,
    business_fax: cleanedData.businessFax,
    business_email: cleanedData.businessEmail,
    contact_name: cleanedData.contactName,
    contact_title: cleanedData.contactTitle,
    website: cleanedData.website,
    is_franchise: cleanedData.isFranchise === 'yes',
    is_registered_eva: cleanedData.isRegisteredWithEVA === 'yes',
    is_registered_va_scc: cleanedData.isRegisteredWithVASCC === 'yes',
    certification_type: cleanedData.designations,
    naics_codes: cleanedData.naicsCodes,
    business_establishment_year: cleanedData.businessEstablishmentYear,
    annual_receipts: cleanedData.annualReceipts,
    owners_have_10pct_ownership_in_other_firms: cleanedData.doOwnersHave10PctOwnershipInOtherFirms,
    has_ein: cleanedData.hasEIN === 'yes',
    is_mailing_same_as_physical: cleanedData.isMailingSameAsPhysical,
    receive_marketing_emails: cleanedData.receiveMarketingEmails === 'yes',
    tax_identification_type: cleanedData.taxIdentificationType,
    owners: cleanedData.owners,
    contacts: cleanedData.contacts,
    affiliates: cleanedData.affiliates,
    corporation_info: cleanedData.corporationInfo,
    llc_info: cleanedData.llcInfo,
    geographic_marketing_areas: cleanedData.geographicMarketingAreas,
    accepts_charge_cards: cleanedData.acceptsChargeCards,
    is_confidential: cleanedData.isConfidential,
    confidentiality_reason: cleanedData.confidentialityReason,
    affidavit_agreement: cleanedData.affidavitAgreement,
    signature_name: cleanedData.signatureName,
    signature_date: cleanedData.signatureDate,
    signature_title: cleanedData.signatureTitle,
    general_submission_documents: cleanedData.generalSubmissionDocuments,
    business_financial_documents: cleanedData.businessFinancialDocuments,
    personal_documents: cleanedData.personalDocuments,
    business_operational_documents: cleanedData.businessOperationalDocuments,
    corporate_organizational_documents: cleanedData.corporateOrganizationalDocuments,
    additional_documents: cleanedData.additionalDocuments,
    swam_business_formation_documents: cleanedData.swamBusinessFormationDocuments,
    swam_tax_documents: cleanedData.swamTaxDocuments,
    swam_employment_documents: cleanedData.swamEmploymentDocuments,
    swam_personal_documents: cleanedData.swamPersonalDocuments,
    swam_additional_documents: cleanedData.swamAdditionalDocuments,
    business_phone_ext: cleanedData.businessPhoneExt,
    website: cleanedData.website,
    country: cleanedData.country,
    numEmployees: cleanedData.numEmployees,
  };

  // Calculate completion percentage
  const completionPercentage = calculateCompletionPercentage(mappedData);

  const { data, error } = await supabase
    .from('applications')
    .upsert({
      ...mappedData,
      user_id: userId,
      tracking_id: trackingId,
      updated_at: new Date().toISOString(),
      completion_percentage: completionPercentage,
    }, {
      onConflict: 'tracking_id',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getApplications(userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error

  return data
}

export async function getApplication(applicationId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (error) throw error

  return data
}

export async function getApplicationByTrackingId(trackingId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('tracking_id', trackingId)
    .single()

  if (error) throw error

  if (data) {
    // Map database fields to form fields
    const formData = {
      designations: data.certification_type,
      businessType: data.business_type,
      legalName: data.legal_name,
      tradeName: data.trade_name,
      hasEIN: data.has_ein ? 'yes' : 'no',
      ein: data.federal_ein,
      ssn: data.ssn,
      physicalAddress: data.physical_address,
      zipCode: data.zip_code,
      city: data.city,
      state: data.state,
      isMailingSameAsPhysical: data.is_mailing_same_as_physical,
      mailingAddress: data.mailing_address,
      isRegisteredWithEVA: data.is_registered_eva ? 'yes' : 'no',
      isRegisteredWithVASCC: data.is_registered_va_scc ? 'yes' : 'no',
      isFranchise: data.is_franchise ? 'yes' : 'no',
      contactName: data.contact_name,
      contactTitle: data.contact_title,
      businessPhone: data.business_phone,
      businessPhoneExt: data.business_phone_ext,
      businessFax: data.business_fax,
      businessEmail: data.business_email,
      receiveMarketingEmails: data.receive_marketing_emails ? 'yes' : 'no',
      taxIdentificationType: data.tax_identification_type,
      taxIdentificationNumber: data.tax_identification_number,
      businessStartDate: data.business_establishment_year,
      fiscalYearEnd: data.fiscal_year_end,
      annualGrossReceipts: data.annual_receipts,
      numEmployees: data.numEmployees,
      ownershipStructure: data.ownership_structure,
      ownersInfo: data.owners,
      nigpCodes: data.nigp_codes,
      naicsCodes: data.naics_codes,
      exemptionRequested: data.is_confidential ? 'yes' : 'no',
      exemptionReason: data.confidentiality_reason,
      businessEstablishmentYear: data.business_establishment_year,
      annualReceipts: data.annual_receipts,
      owners: data.owners,
      contacts: data.contacts,
      affiliates: data.affiliates,
      corporationInfo: data.corporation_info,
      llcInfo: data.llc_info,
      geographicMarketingAreas: data.geographic_marketing_areas,
      acceptsChargeCards: data.accepts_charge_cards,
      isConfidential: data.is_confidential,
      confidentialityReason: data.confidentiality_reason,
      affidavitAgreement: data.affidavit_agreement,
      signatureName: data.signature_name,
      signatureDate: data.signature_date,
      signatureTitle: data.signature_title,
      generalSubmissionDocuments: data.general_submission_documents,
      businessFinancialDocuments: data.business_financial_documents,
      personalDocuments: data.personal_documents,
      businessOperationalDocuments: data.business_operational_documents,
      corporateOrganizationalDocuments: data.corporate_organizational_documents,
      additionalDocuments: data.additional_documents,
      swamBusinessFormationDocuments: data.swam_business_formation_documents,
      swamTaxDocuments: data.swam_tax_documents,
      swamEmploymentDocuments: data.swam_employment_documents,
      swamPersonalDocuments: data.swam_personal_documents,
      swamAdditionalDocuments: data.swam_additional_documents,
      businessPhoneExt : data.business_phone_ext,
      website: data.website,
      country: data.country,
      doOwnersHave10PctOwnershipInOtherFirms:  data.owners_have_10pct_ownership_in_other_firms,
      
    }

    return formData
  }

  return null
}

export async function updateApplication(applicationId: string, updates: Partial<Database['public']['Tables']['applications']['Update']>) {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)

  if (error) throw error

  return data
}


export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }

  return data || []
}

export async function updateNotification(notificationId: string, updates: { read: boolean }) {
  const { error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', notificationId)

  if (error) {
    console.error('Error updating notification:', error)
    throw error
  }
}

