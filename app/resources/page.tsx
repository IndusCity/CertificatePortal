'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, HelpCircle, Video, Search, ExternalLink } from 'lucide-react'

const resources = [
  { 
    title: 'SWaM Certification Guide', 
    description: 'Comprehensive guide to Small, Women-owned, and Minority-owned Business certification process.',
    icon: BookOpen,
    link: '/resources/swam-guide' 
  },
  { 
    title: 'DBE Certification Requirements', 
    description: 'Detailed requirements for Disadvantaged Business Enterprise certification.',
    icon: FileText,
    link: '/resources/dbe-requirements' 
  },
  { 
    title: 'ESO Certification Process', 
    description: 'Step-by-step process for Employment Services Organization certification.',
    icon: BookOpen,
    link: '/resources/eso-process' 
  },
  { 
    title: 'SDV Certification Checklist', 
    description: 'Checklist for Service Disabled Veteran-owned businesses seeking certification.',
    icon: FileText,
    link: '/resources/sdv-checklist' 
  },
  { 
    title: 'Required Documents for Certification', 
    description: 'List of all necessary documents for various certification types.',
    icon: FileText,
    link: '/resources/required-documents' 
  },
  { 
    title: 'Certification FAQ', 
    description: 'Frequently asked questions about the certification process and benefits.',
    icon: HelpCircle,
    link: '/resources/faq' 
  },
  { 
    title: 'Video Tutorials', 
    description: 'Visual guides to help you navigate the certification application process.',
    icon: Video,
    link: '/resources/video-tutorials' 
  },
  { 
    title: 'Certification Benefits Guide', 
    description: 'Explore the advantages of obtaining various certifications for your business.',
    icon: BookOpen,
    link: '/resources/certification-benefits' 
  },
]

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Certification Resources</h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Explore our comprehensive collection of guides and information to support your certification journey.
        </p>
      </motion.div>

      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {filteredResources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                  <resource.icon className="mr-2 text-blue-600" size={24} />
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href={resource.link} className="flex items-center justify-center">
                    View Resource
                    <ExternalLink className="ml-2" size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-600 mt-8"
        >
          No resources found matching your search. Please try a different term.
        </motion.div>
      )}
    </div>
  )
}

