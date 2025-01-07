'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { signIn } from '@/lib/supabase-client'
import { supabase } from '@/lib/supabase-client'

const formSchema = z.object({
email: z.string().email({ message: "Please enter a valid email address." }),
password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
const [showPassword, setShowPassword] = useState(false)
const [isLoading, setIsLoading] = useState(true)
const [notification, setNotification] = useState<string | null>(null)
const router = useRouter()

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
})

useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/dashboard')
    } else {
      setIsLoading(false)
    }
  }
  checkSession()
}, [router])

const onSubmit = async (data: FormData) => {
  try {
    const { user, error } = await signIn(data.email, data.password)
    if (error) throw error
    setNotification('You have successfully logged in.')
    setTimeout(() => setNotification(null), 5000)
    router.push('/dashboard')
    window.location.href = '/dashboard'; // Force redirect client-side
  } catch (error: any) {
    setNotification(error.message || 'An error occurred during login.')
    setTimeout(() => setNotification(null), 5000)
  }
}

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

if (isLoading) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <motion.div
      className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-1/2 pr-8 flex flex-col justify-center">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/attari-datastore.appspot.com/o/test%2Fmedia_194e8f25be64b08b9ac9ffab16ada430b6a2d688b.webp?alt=media&token=8b606acf-85c5-4a7f-836e-344b8f4ec2c0"
          alt="Business Growth"
          width={500}
          height={500}
          className="rounded-lg object-cover"
        />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Empowering Small Businesses
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your success is our priority. Let's grow together.
        </p>
      </div>
      <div className="w-1/2 pl-8 border-l">
        <motion.div variants={itemVariants}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </motion.div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <motion.div variants={itemVariants}>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              {...register("email")} 
              className="mt-1"
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="mt-1"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </motion.div>
          {notification && (
            <div className="mt-4 text-center text-sm text-green-600" role="alert">
              {notification}
            </div>
          )}
        </form>
        <motion.div variants={itemVariants} className="text-center mt-4">
          <a href="/register" className="text-blue-600 hover:text-blue-800">
            Don't have an account? Sign up
          </a>
        </motion.div>
      </div>
    </motion.div>
  </div>
)
}