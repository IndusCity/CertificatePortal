'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 text-white bg-pattern">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="w-12 h-12 bg-blue-200"
          />
        </div>
      ) : (
        <motion.div
          className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-20 px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto space-y-20">
            <motion.div 
              className="text-center space-y-8"
              variants={itemVariants}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                Welcome to the SBSD Certification Portal
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
                Empowering businesses through streamlined certification processes for Small, Women-owned, and Minority-owned (SWaM) enterprises.
              </p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-12" variants={itemVariants}>
              {/* Apply for Certification Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-200">Apply for Certification</CardTitle>
                  <CardDescription className="text-blue-100">Start your journey towards official recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-200">Our streamlined process guides you through every step:</p>
                  <ul className="space-y-2">
                    {['Complete your profile', 'Submit required documents', 'Track your application status'].map((step, index) => (
                      <li key={index} className="flex items-center text-gray-200">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300" asChild>
                    <Link href="/apply">
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Certification Resources Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-200">Certification Resources</CardTitle>
                  <CardDescription className="text-blue-100">Everything you need to succeed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-200">Access a wealth of information to support your certification journey:</p>
                  <ul className="space-y-2">
                    {['Certification guides', 'Document checklists', 'FAQ section', 'Video tutorials'].map((resource, index) => (
                      <li key={index} className="flex items-center text-gray-200">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-6 border-blue-400 text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-300" asChild>
                    <Link href="/resources">
                      Explore Resources <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="text-center bg-white/5 backdrop-blur-lg p-12 rounded-2xl shadow-2xl"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-200">Ready to get started?</h2>
              <p className="text-xl text-blue-100 mb-8">Join our community of certified businesses today!</p>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 font-semibold px-8 py-3 rounded-full shadow-md" 
                asChild
              >
                <Link href="/register">
                  Create an Account <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}

