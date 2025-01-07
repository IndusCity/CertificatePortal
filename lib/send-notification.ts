import { supabase } from './supabase-client'

export async function sendNotification(userId: string, message: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        { user_id: userId, message, read: false }
      ])

    if (error) throw error

    // Here you could also implement email notifications
    // using a service like SendGrid or Amazon SES

    return data
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

