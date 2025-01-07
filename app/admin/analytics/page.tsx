'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase-client'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface AnalyticsData {
  totalApplications: number
  applicationsByType: Record<string, number>
  applicationsByStatus: Record<string, number>
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: applications, error } = await supabase
          .from('applications')
          .select('certification_type, status')

        if (error) throw error

        const analyticsData: AnalyticsData = {
          totalApplications: applications.length,
          applicationsByType: {},
          applicationsByStatus: {}
        }

        applications.forEach((app) => {
          analyticsData.applicationsByType[app.certification_type] = (analyticsData.applicationsByType[app.certification_type] || 0) + 1
          analyticsData.applicationsByStatus[app.status] = (analyticsData.applicationsByStatus[app.status] || 0) + 1
        })

        setAnalyticsData(analyticsData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!analyticsData) return <div>No data available</div>

  const typeChartData = {
    labels: Object.keys(analyticsData.applicationsByType),
    datasets: [
      {
        label: 'Applications by Type',
        data: Object.values(analyticsData.applicationsByType),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const statusChartData = {
    labels: Object.keys(analyticsData.applicationsByStatus),
    datasets: [
      {
        label: 'Applications by Status',
        data: Object.values(analyticsData.applicationsByStatus),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Total Applications: {analyticsData.totalApplications}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Applications by Type</h2>
          <Bar data={typeChartData} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Applications by Status</h2>
          <Bar data={statusChartData} />
        </div>
      </div>
    </div>
  )
}

