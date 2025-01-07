'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getProfile, getApplications, getNotifications, updateNotification } from '@/lib/supabase-client'
import { Database } from '@/types/supabase'
import { supabase } from '@/lib/supabase-client'
import { FileText, Home, Settings, Bell, PlusCircle, Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight, Users, Calendar, Search, Briefcase, BarChart3, Shield, Award, Menu, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { LinkApplicationModal } from '@/components/link-application-modal'
import Link from 'next/link'
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Profile = Database['public']['Tables']['profiles']['Row']
type Application = Database['public']['Tables']['applications']['Row'] & {
completion_percentage?: number;
};

const certificationTypes = [
{ code: 'S', label: 'Small Business' },
{ code: 'MIC', label: 'Micro Business' },
{ code: 'W', label: 'Women-Owned' },
{ code: 'MIN', label: 'Minority-Owned' },
{ code: 'SDV', label: 'Service Disabled Veteran' },
{ code: 'ESO', label: 'Employment Services Organization' },
{ code: 'DBE', label: 'Disadvantaged Business Enterprise' },
{ code: 'ACDBE', label: 'Airport Concessionaire DBE' },
{ code: '8(a)', label: '8(a) Business Development' },
{ code: 'FSDV', label: 'Federal Service Disabled Veteran' },
{ code: 'EDW', label: 'Economically Disadvantaged Women' },
{ code: 'WOSB', label: 'Women-Owned Small Business' },
]

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

const quickActions = [
{ 
label: 'Start New Application', 
href: '/apply', 
icon: PlusCircle,
description: 'Begin your certification process'
},
{ 
label: 'View Resources', 
href: '/resources',
icon: FileText,
description: 'Access helpful documentation'
},
{ 
label: 'Update Profile', 
href: '/profile',
icon: Users,
description: 'Manage your account details'
},
{ 
label: 'Contact Support', 
href: '/support',
icon: Shield,
description: 'Get help with your application'
},
]

export default function Dashboard() {
const [user, setUser] = useState<Profile | null>(null)
const [applications, setApplications] = useState<Application[]>([])
const [loading, setLoading] = useState(true)
const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
const [notification, setNotification] = useState<string | null>(null)
const [searchTerm, setSearchTerm] = useState('')
const router = useRouter()
const [notifications, setNotifications] = useState<Database['public']['Tables']['notifications']['Row'][]>([]);
const [loadingNotifications, setLoadingNotifications] = useState(true);

useEffect(() => {
async function fetchData() {
try {
setLoading(true)
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError) throw authError

if (user) {
  const profile = await getProfile(user.id)
  setUser(profile)
  const apps = await getApplications(user.id)
  setApplications(apps)
} else {
  router.push('/login')
}
} catch (error) {
console.error("Error fetching data:", error)
setNotification('Failed to load dashboard data. Please try again.')
setTimeout(() => setNotification(null), 5000)
} finally {
setLoading(false)
}
}

fetchData()
}, [router])

useEffect(() => {
const fetchNotifications = async () => {
setLoadingNotifications(true);
try {
  const userNotifications = await getNotifications(user?.id || '');
  setNotifications(userNotifications);
} catch (error) {
  console.error('Error fetching notifications:', error);
  // Handle error, e.g., display a notification
} finally {
  setLoadingNotifications(false);
}
};

if (user) {
  fetchNotifications();
}
}, [user]);

if (loading) {
return (
<div className="flex justify-center items-center h-screen bg-gray-50">
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
</div>
)
}

if (!user) {
return <div className="flex justify-center items-center h-screen bg-gray-50">No user data available. Please log in.</div>
}

const getStatusColor = (status: string) => {
switch (status?.toLowerCase()) {
case 'approved':
return 'bg-green-500'
case 'rejected':
return 'bg-red-500'
case 'pending':
return 'bg-yellow-500'
default:
return 'bg-gray-500'
}
}

const getProgressValue = (status: string) => {
switch (status?.toLowerCase()) {
case 'approved':
return 100
case 'rejected':
return 100
case 'pending':
return 60
default:
return 30
}
}

const ApplicationCard = ({ app }: { app: Application }) => {
  const statusColors = {
    pending: 'from-yellow-500 to-orange-500',
    approved: 'from-green-500 to-emerald-500',
    rejected: 'from-red-500 to-rose-500',
    draft: 'from-blue-500 to-indigo-500',
    default: 'from-gray-500 to-gray-600'
  }

  const statusColor = statusColors[app.status?.toLowerCase() || 'default']
  const truncatedTrackingId = app.tracking_id ? app.tracking_id.slice(-6) : 'N/A'
  const [isApplying, setIsApplying] = useState(false)

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl border border-gray-200"
    >
      <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-blue-400 to-blue-600" />
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 rounded-full p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tracking ID</p>
              <p className="text-lg font-bold text-gray-900">...{truncatedTrackingId}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`capitalize ${
              app.status === 'approved' ? 'border-green-500 text-green-700 bg-green-50' :
              app.status === 'rejected' ? 'border-red-500 text-red-700 bg-red-50' :
              app.status === 'draft' ? 'border-blue-500 text-blue-700 bg-blue-50' :
              'border-yellow-500 text-yellow-700 bg-yellow-50'
            }`}
          >
            {app.status}
          </Badge>
        </div>
        <h3 className="font-semibold text-xl text-gray-900 mb-2">{app.business_name}</h3>
        <div className="flex-grow space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Completion</span>
              <span className="font-medium text-gray-900">{app.completion_percentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${app.completion_percentage || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {app.certification_type?.slice(0, 3).map((type) => (
              <Badge 
                key={type}
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {type}
              </Badge>
            ))}
            {app.certification_type && app.certification_type.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                +{app.certification_type.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            onClick={() => router.push(`/track/${app.tracking_id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Progress
          </Button>
          {app.status === 'draft' ? (
            <Button 
              variant="outline"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              onClick={() => {
                setIsApplying(true);
                router.push(`/apply?tracking_id=${app.tracking_id}`);
              }}
              disabled={isApplying}
            >
              {isApplying ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  Applying...
                </div>
              ) : (
                "Complete Application"
              )}
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              onClick={() => router.push(`/application/${app.id}`)}
            >
              View Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-end">
          <Clock className="mr-1 h-3 w-3" />
          Updated {format(new Date(app.updated_at), 'MMM d, yyyy HH:mm')}
        </div>
      </div>
    </motion.div>
  )
}

const handleLinkApplication = (type: 'ein' | 'ssn', value: string) => {
// Handle the submission here
console.log('Linking application with:', type, value)
setIsLinkModalOpen(false)
// Add your logic to link the application
}

const filteredApplications = applications.filter(app =>
app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
app.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
app.certification_type?.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
)

return (
<div className="min-h-screen bg-gray-100 flex flex-col">
{/* Header */}
<header className="bg-white border-b border-gray-200 z-20 sticky top-0">
<div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
  <div className="flex items-center">
    <h1 className="text-2xl font-semibold text-gray-900">
      Welcome, {user?.full_name?.split(' ')[0]}!
    </h1>
  </div>
  <div className="flex items-center space-x-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input 
        className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
        placeholder="Search applications..." 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
    <Button 
      onClick={() => setIsLinkModalOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      New Application
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative hover:bg-gray-50 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
          )}
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        {loadingNotifications ? (
          <DropdownMenuItem className="cursor-default">
            Loading notifications...
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem className="cursor-default">
            No notifications yet.
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "py-2 px-3 text-sm",
                !notification.read && "bg-blue-50 font-medium"
              )}
              onClick={async () => {
                if (!notification.read) {
                  try {
                    await updateNotification(notification.id, { read: true });
                    setNotifications(prev => prev.map(n => 
                      n.id === notification.id ? { ...n, read: true } : n
                    ));
                  } catch (error) {
                    console.error('Error updating notification:', error);
                    // Handle error
                  }
                }
              }}
            >
              {notification.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
</header>

{/* Main Content */}
<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-8"
  >
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Applications
          </CardTitle>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {applications.length}
            </span>
            <span className="text-sm text-gray-500">applications</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending Review
          </CardTitle>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'pending').length}
            </span>
            <span className="text-sm text-gray-500">pending</span>
          </div>
        </CardHeader>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Approved
          </CardTitle>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-green-600">
              {applications.filter(app => app.status === 'approved').length}
            </span>
            <span className="text-sm text-gray-500">approved</span>
          </div>
        </CardHeader>
      </Card>
    </div>

    {/* Applications and Quick Actions */}
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Track your certification applications</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredApplications.length === 0 ? (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-12"
                  >
                    <div className="rounded-full bg-blue-50 p-3 w-12 h-12 mx-auto mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                    <p className="mt-2 text-gray-500">Get started by creating your first application</p>
                    <Button 
                      onClick={() => setIsLinkModalOpen(true)}
                      className="mt-6 bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Application
                    </Button>
                  </motion.div>
                ) : (
                  filteredApplications.map((app) => (
                    <ApplicationCard key={app.id} app={app} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-50 transition-colors group"
                  onClick={() => router.push(action.href)}
                >
                  <action.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <div className="text-left">
                    <div className="font-medium truncate">{action.label}</div>
                    <div className="text-xs text-gray-500 truncate">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Resources and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start hover:bg-blue-50 transition-colors" 
              variant="outline"
              onClick={() => router.push('/resources')}
            >
              <FileText className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
            <Button 
              className="w-full justify-start hover:bg-blue-50 transition-colors" 
              variant="outline"
              onClick={() => router.push('/support')}
            >
              <Shield className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
            <Button
              className="w-full justify-start hover:bg-blue-50 transition-colors"
              variant="outline"
              onClick={() => router.push('/walk-through')}
            >
              <Award className="mr-2 h-5 w-5" />
              Guided Walk Through
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </motion.div>
</div>
</main>
<LinkApplicationModal
isOpen={isLinkModalOpen}
onClose={() => setIsLinkModalOpen(false)}
onSubmit={handleLinkApplication}
/>
{notification && (
<div className="mt-4 text-center text-sm text-red-500" role="alert">
  {notification}
</div>
)}
</div>
)
}

