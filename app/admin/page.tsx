'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase-client'

interface Application {
  id: number
  business_name: string
  certification_type: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Check if the user is an admin (you'll need to implement this logic)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || !profile.is_admin) {
        router.push('/dashboard')
        return
      }

      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setApplications(data)
      } catch (error) {
        setError("  Failed to fetch applications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [router])

  const updateApplicationStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ))
    } catch (error) {
      setError("error.message.")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Business Name</th>
            <th className="p-2 text-left">Certification Type</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b">
              <td className="p-2">{app.business_name}</td>
              <td className="p-2">{app.certification_type}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">
                <select
                  value={app.status}
                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="more_info_needed">More Info Needed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

