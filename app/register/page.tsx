'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { signUp } from '@/lib/supabase-client'
import { supabase } from '@/lib/supabase-client'

const formSchema = z.object({
fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
email: z.string().email({ message: "Please enter a valid email address." }),
password: z.string()
  .min(8, { message: "Password must be at least 8 characters." })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  }),
confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
message: "Passwords don't match",
path: ["confirmPassword"],
})

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)
const [notification, setNotification] = useState<string | null>(null)
const router = useRouter()

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  watch,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
})

const password = watch("password")

const onSubmit = async (data: FormData) => {
  try {
    const result = await signUp(data.email, data.password, data.fullName)
  
    if (result.user) {
      setNotification('Account created. Please check your email to verify your account.')
      setTimeout(() => setNotification(null), 5000)
    } else {
      throw new Error('Failed to create user')
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    setNotification(error.message || 'An error occurred during registration.')
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
          Join Our Business Community
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Start your journey towards certification and growth.
        </p>
      </div>
      <div className="w-1/2 pl-8 border-l">
        <motion.div variants={itemVariants}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </motion.div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <motion.div variants={itemVariants}>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" type="text" {...register("fullName")} className="mt-1" />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} className="mt-1" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="mt-1"
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
            {password && (
              <div className="mt-2">
                <p className="text-sm">Password strength:</p>
                <div className="flex items-center mt-1">
                  {password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password) ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <p className="text-sm">
                    {password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)
                      ? "Strong password"
                      : "Weak password"}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="mt-1"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Creating account...</span>
                  <span className="animate-spin">⚪</span>
                </>
              ) : (
                'Register'
              )}
            </Button>
          </motion.div>
        </form>
        <motion.div variants={itemVariants} className="text-center mt-4">
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Already have an account? Sign in
          </a>
        </motion.div>
        {notification && (
          <div className="mt-4 text-center text-sm text-green-600" role="alert">
            {notification}
          </div>
        )}
      </div>
    </motion.div>
  </div>
)
}

