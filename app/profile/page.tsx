'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase-client'
import { User, Mail, Briefcase, Award, Lock } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  email: string
  business_name?: string
  business_type?: string
  certifications?: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
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

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const router = useRouter()
  // const { toast } = useToast()

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) throw error

          setProfile(data)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setNotification("Failed to load profile data. Please try again.")
        setTimeout(() => setNotification(null), 5000)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleEdit = () => {
    setEditing(true)
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile?.id)

      if (error) throw error

      setEditing(false)
      setNotification("Profile updated successfully.")
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setNotification("Failed to update profile. Please try again.")
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-800">No profile data available. Please log in.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account details and preferences</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              {!editing ? (
                <Button onClick={handleEdit}>Edit Profile</Button>
              ) : (
                <Button onClick={handleSave}>Save Changes</Button>
              )}
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={profile.full_name} />
                  <AvatarFallback>{profile.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      name="business_name"
                      value={profile.business_name || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Business Type</Label>
                    <Input
                      id="business_type"
                      name="business_type"
                      value={profile.business_type || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Certifications</CardTitle>
              <CardDescription>Your current certifications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.certifications?.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {cert}
                  </Badge>
                )) || <p className="text-gray-500">No certifications yet</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        {notification && (
          <div className="fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-md" role="alert">
            {notification}
          </div>
        )}
      </motion.div>
    </div>
  )
}

