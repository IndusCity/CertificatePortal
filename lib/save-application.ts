import { supabase } from './supabase-client'

export async function saveApplication(userId: string, applicationData: any) {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      ...applicationData,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

