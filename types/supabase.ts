export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          legal_name: string | null
          trade_name: string | null
          federal_ein: string | null
          ssn: string | null
          physical_address: string | null
          mailing_address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          business_phone: string | null
          business_fax: string | null
          business_email: string | null
          contact_name: string | null
          contact_title: string | null
          website: string | null
          is_franchise: boolean | null
          is_registered_eva: boolean | null
          is_registered_va_scc: boolean | null
          receive_marketing_emails: boolean | null
          certification_type: string[]
          status: string
          submitted_at: string
          updated_at: string
          tracking_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type: string
          legal_name?: string | null
          trade_name?: string | null
          federal_ein?: string | null
          ssn?: string | null
          physical_address?: string | null
          mailing_address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          business_phone?: string | null
          business_fax?: string | null
          business_email?: string | null
          contact_name?: string | null
          contact_title?: string | null
          website?: string | null
          is_franchise?: boolean | null
          is_registered_eva?: boolean | null
          is_registered_va_scc?: boolean | null
          receive_marketing_emails?: boolean | null
          certification_type: string[]
          status?: string
          submitted_at?: string
          updated_at?: string
          tracking_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string
          legal_name?: string | null
          trade_name?: string | null
          federal_ein?: string | null
          ssn?: string | null
          physical_address?: string | null
          mailing_address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          business_phone?: string | null
          business_fax?: string | null
          business_email?: string | null
          contact_name?: string | null
          contact_title?: string | null
          website?: string | null
          is_franchise?: boolean | null
          is_registered_eva?: boolean | null
          is_registered_va_scc?: boolean | null
          receive_marketing_emails?: boolean | null
          certification_type?: string[]
          status?: string
          submitted_at?: string
          updated_at?: string
          tracking_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

