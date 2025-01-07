'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getApplicationByTrackingId } from '@/lib/supabase-client'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertTriangle, Clock, Briefcase, Award, FileText, Users, Mail, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"

interface Application {
  designations: string[];
  businessType: string;
  tradeName: string | null;
  hasEIN: string;
  isRegisteredWithEVA: string;
  isRegisteredWithVASCC: string;
  isFranchise: string;
  receiveMarketingEmails: string;
  contacts: Array<{
    contactName: string;
    contactTitle: string;
    businessEmail: string;
    businessPhone: string;
    businessPhoneExt: string;
  }>;
  // Add other fields as needed
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const steps = [
  { title: 'Application Submitted', status: 'complete' },
  { title: 'Under Review', status: 'current' },
  { title: 'Final Decision', status: 'upcoming' },
]

const TrackApplicationPage = () => {
  const router = useRouter()
  const params = useParams()
  const trackingId = params.trackingId as string
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true)
      try {
        if (trackingId) {
          const app = await getApplicationByTrackingId(trackingId)
          if (app) {
            console.log('Fetched application:', app)
            setApplication(app as Application)
          } else {
            setApplication(null)
          }
        }
      } catch (error) {
        console.error('Error fetching application:', error)
        setApplication(null)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [trackingId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Not Found</h2>
        <p className="text-gray-600 mb-4">We couldn't find an application with the provided tracking ID.</p>
        <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
      </div>
    )
  }

  const completionPercentage = 60; // This should be calculated based on the application data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 space-y-8"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-3xl font-bold">Application Tracker</CardTitle>
          <CardDescription className="text-blue-100">
            Tracking ID: ...{trackingId?.slice(-6)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Trade Name:</strong> {application.tradeName || 'N/A'}</p>
                  <p><strong>Business Type:</strong> {application.businessType || 'N/A'}</p>
                  <p><strong>Has EIN:</strong> {application.hasEIN}</p>
                  <p><strong>Is Franchise:</strong> {application.isFranchise}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-500" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {application.designations && application.designations.length > 0 ? (
                      application.designations.map((type) => (
                        <Badge key={type} variant="secondary" className="bg-blue-100 text-blue-800">
                          {type.toUpperCase()}
                        </Badge>
                      ))
                    ) : (
                      <span>No certifications specified</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.contacts && application.contacts.length > 0 ? (
                    application.contacts.map((contact, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <h4 className="font-semibold mb-2">Contact {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p className="flex items-center"><Users className="w-4 h-4 mr-2" /> {contact.contactName || 'N/A'}</p>
                          <p className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> {contact.contactTitle || 'N/A'}</p>
                          <p className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {contact.businessEmail || 'N/A'}</p>
                          <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {contact.businessPhone || 'N/A'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No contact information available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Application Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={index} className="relative">
                        <div className={cn(
                          "absolute left-0 top-2 w-4 h-4 rounded-full border-2",
                          step.status === 'complete' ? "bg-green-500 border-green-500" :
                          step.status === 'current' ? "bg-blue-500 border-blue-500" :
                          "bg-gray-200 border-gray-300"
                        )}></div>
                        <div className="ml-8">
                          <h4 className={cn(
                            "font-semibold",
                            step.status === 'complete' ? "text-green-600" :
                            step.status === 'current' ? "text-blue-600" :
                            "text-gray-500"
                          )}>{step.title}</h4>
                          <p className="text-sm text-gray-500">
                            {step.status === 'complete' ? "Completed" :
                             step.status === 'current' ? "In Progress" :
                             "Pending"}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Completion</span>
                      <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="w-full h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white">
          Return to Dashboard
        </Button>
      </div>
    </motion.div>
  )
}

export default TrackApplicationPage

