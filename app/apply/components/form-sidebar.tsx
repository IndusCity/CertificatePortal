'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, ExternalLink, Info, CheckCircle2, Shield, FileText } from 'lucide-react'
import Image from 'next/image'

interface FormSidebarProps {
  currentStep: number
  currentSubstep: number
  focusedField: string | null
}

const guidelines = {
  1: {
    1: {
      welcome: {
        title: "Welcome to the Certification Process!",
        description: "We're here to guide you through each step of your certification application.",
        expectations: [
          "Select the certifications that match your business profile",
          "Provide accurate business structure information",
          "Get real-time guidance throughout the process"
        ]
      },
      details: {
        "Designations": "Choose all applicable certifications for your business. Note that ESO cannot be combined with other designations.",
        "Business Type": "Select the legal structure that best describes your business.",
      },
      why: {
        "Designations": "Helps us understand which certification programs your business qualifies for and ensures you receive the appropriate benefits.",
        "Business Type": "Determines the documentation requirements and verification process for your certification.",
      },
      links: [
        { text: "Certification Types Explained", url: "/resources/certification-types" },
        { text: "Business Structure Guide", url: "/resources/business-structures" }
      ]
    },
    2: {
      welcome: {
        title: "Let's Get Your Business Details",
        description: "This information helps us understand your business better.",
        expectations: [
          "Provide your official business information",
          "Enter tax identification details securely",
          "Share your business contact information"
        ]
      },
      details: {
        "Business Information": "Provide your official legal business name and any trade names used.",
        "Federal Tax Identification": "Enter your EIN if available, or SSN if not.",
        "Address Information": "Provide your physical business address and mailing address if different.",
        "Registration Details": "Indicate your business's registration status with various entities.",
        "Contact Information": "Provide details for the primary contact person for this application."
      },
      why: {
        "Business Information": "Ensures accurate identification and verification of your business entity.",
        "Federal Tax Identification": "Required for official verification and compliance purposes.",
        "Address Information": "Enables us to verify your business location and send important communications.",
        "Registration Details": "Helps determine your eligibility and compliance with state requirements.",
        "Contact Information": "Allows us to reach you regarding your application and certification status."
      },
      links: [
        { text: "EIN vs SSN for Businesses", url: "/resources/tax-identification" },
        { text: "Business Registration Guide", url: "/resources/business-registration" }
      ]
    },
    3: {
      welcome: {
        title: "Tax Information",
        description: "Let's gather important tax-related details about your business.",
        expectations: [
          "Provide your tax identification information",
          "Share your business start date and fiscal year end",
          "Enter your annual gross receipts and employee count"
        ]
      },
      details: {
        "Tax Identification": "Choose between EIN or SSN and provide the number.",
        "Business Timeline": "Enter your business start date and fiscal year end.",
        "Financial Information": "Provide your annual gross receipts and number of employees."
      },
      why: {
        "Tax Identification": "Necessary for tax compliance and verification purposes.",
        "Business Timeline": "Helps us understand your business's operational history and financial cycle.",
        "Financial Information": "Assists in determining your eligibility for certain certifications and programs."
      },
      links: [
        { text: "Understanding Business Taxes", url: "/resources/business-taxes" },
        { text: "Fiscal Year Guide", url: "/resources/fiscal-year-guide" }
      ]
    },
    4: {
      welcome: {
        title: "Ownership Information",
        description: "Let's gather details about your business ownership structure.",
        expectations: [
          "Select your business ownership structure",
          "Provide information about business owners",
          "Understand how ownership affects your certification"
        ]
      },
      details: {
        "Ownership Structure": "Select the type of ownership structure for your business.",
        "Owner Information": "Provide details about each owner, including their ownership percentage."
      },
      why: {
        "Ownership Structure": "Determines eligibility for certain certifications and affects legal and tax obligations.",
        "Owner Information": "Necessary to verify ownership claims and assess eligibility for minority-owned or women-owned business certifications."
      },
      links: [
        { text: "Business Ownership Structures Explained", url: "/resources/ownership-structures" },
        { text: "Ownership and Certification Eligibility", url: "/resources/ownership-eligibility" }
      ]
    },
    5: {
      welcome: {
        title: "Corporation, LLC, or LLP Details",
        description: "Let's gather specific information about your business entity.",
        expectations: [
          "Provide details specific to your business structure",
          "Enter incorporation or formation information",
          "Understand how these details affect your certification"
        ]
      },
      details: {
        "Entity-Specific Information": "Provide details relevant to your business structure (corporation, LLC, or LLP).",
        "Formation Details": "Enter information about when and where your business was formed or incorporated."
      },
      why: {
        "Entity-Specific Information": "Necessary for legal compliance and verification of your business structure.",
        "Formation Details": "Helps establish the history and legitimacy of your business entity."
      },
      links: [
        { text: "Understanding Business Entities", url: "/resources/business-entities" },
        { text: "Corporation vs LLC vs LLP", url: "/resources/entity-comparison" }
      ]
    },
    6: {
      welcome: {
        title: "NIGP Commodity Codes",
        description: "Let's identify the products or services your business offers.",
        expectations: [
          "Select relevant NIGP codes for your business",
          "Understand how these codes are used in government contracting",
          "Ensure accurate representation of your business offerings"
        ]
      },
      details: {
        "NIGP Code Selection": "Choose the NIGP codes that best represent your business's products or services.",
        "Code Relevance": "Ensure selected codes accurately reflect your business capabilities."
      },
      why: {
        "NIGP Code Selection": "Helps match your business with relevant government contracting opportunities.",
        "Code Relevance": "Ensures your business is considered for appropriate contracts and opportunities."
      },
      links: [
        { text: "Understanding NIGP Codes", url: "/resources/nigp-codes" },
        { text: "NIGP Codes and Government Contracting", url: "/resources/nigp-contracting" }
      ]
    },
    7: {
      welcome: {
        title: "Geographic Marketing Area",
        description: "Let's define the areas where your business operates.",
        expectations: [
          "Select the geographic areas where you conduct business",
          "Understand how this affects your certification",
          "Ensure accurate representation of your business reach"
        ]
      },
      details: {
        "Area Selection": "Choose the geographic areas where your business is active.",
        "Charge Card Acceptance": "Indicate whether your business accepts charge cards."
      },
      why: {
        "Area Selection": "Helps match your business with relevant local and regional opportunities.",
        "Charge Card Acceptance": "Informs potential clients about your payment options."
      },
      links: [
        { text: "Understanding Geographic Marketing Areas", url: "/resources/geographic-marketing" },
        { text: "Importance of Accepting Charge Cards", url: "/resources/charge-cards-business" }
      ]
    },
    8: {
      welcome: {
        title: "FOIA Exemption",
        description: "Understand your rights regarding information disclosure.",
        expectations: [
          "Learn about the Freedom of Information Act (FOIA)",
          "Decide if you want to request an exemption",
          "Provide a reason if requesting an exemption"
        ]
      },
      details: {
        "Exemption Request": "Indicate whether you're requesting an exemption from FOIA disclosure.",
        "Exemption Reason": "If requesting an exemption, provide a detailed explanation."
      },
      why: {
        "Exemption Request": "Protects sensitive business information from public disclosure.",
        "Exemption Reason": "Helps authorities evaluate the validity of your exemption request."
      },
      links: [
        { text: "Understanding FOIA", url: "/resources/foia-explained" },
        { text: "FOIA Exemptions for Businesses", url: "/resources/foia-business-exemptions" }
      ]
    }
  },
  2: {
    1: {
      welcome: {
        title: "DBE Required Documents - Part 1",
        description: "Let's begin gathering the necessary documents for your DBE certification.",
        expectations: [
          "Understand the required documents for DBE certification",
          "Prepare to upload or provide information about these documents",
          "Ensure all documents are current and accurate"
        ]
      },
      details: {
        "Document Checklist": "Review the list of required documents for DBE certification.",
        "Document Preparation": "Gather and prepare all necessary documents before proceeding."
      },
      why: {
        "Document Checklist": "Ensures you have all required documentation for a complete DBE application.",
        "Document Preparation": "Streamlines the application process and reduces delays due to missing information."
      },
      links: [
        { text: "DBE Certification Requirements", url: "/resources/dbe-requirements" },
        { text: "Preparing Your DBE Application", url: "/resources/preparing-dbe-application" }
      ]
    },
    2: {
      welcome: {
        title: "DBE Required Documents - Part 2",
        description: "Let's continue with the DBE certification document submission process.",
        expectations: [
          "Upload or provide information about required DBE documents",
          "Ensure all submitted information is accurate and up-to-date",
          "Understand the importance of each required document"
        ]
      },
      details: {
        "Document Submission": "Upload or provide details about each required document.",
        "Information Accuracy": "Double-check all submitted information for accuracy."
      },
      why: {
        "Document Submission": "Completes your DBE application with all necessary supporting documentation.",
        "Information Accuracy": "Prevents delays in processing due to incorrect or outdated information."
      },
      links: [
        { text: "DBE Document Guide", url: "/resources/dbe-document-guide" },
        { text: "Common DBE Application Mistakes", url: "/resources/dbe-application-mistakes" }
      ]
    },
    3: {
      welcome: {
        title: "DBE Required Documents - Part 3",
        description: "Let's finalize the DBE certification document submission process.",
        expectations: [
          "Complete any remaining document uploads or information provision",
          "Review all submitted documents for completeness",
          "Understand next steps in the DBE certification process"
        ]
      },
      details: {
        "Final Document Check": "Ensure all required documents have been submitted.",
        "Application Review": "Review your entire DBE application for completeness and accuracy."
      },
      why: {
        "Final Document Check": "Ensures your application is complete and ready for review.",
        "Application Review": "Helps identify any missing information or potential issues before submission."
      },
      links: [
        { text: "DBE Application Checklist", url: "/resources/dbe-application-checklist" },
        { text: "What Happens After DBE Submission", url: "/resources/after-dbe-submission" }
      ]
    }
  },
  3: {
    1: {
      welcome: {
        title: "SWaM Documents - Part 1",
        description: "Let's begin gathering the necessary documents for your SWaM certification.",
        expectations: [
          "Understand the required documents for SWaM certification",
          "Prepare to upload or provide information about these documents",
          "Ensure all documents are current and accurate"
        ]
      },
      details: {
        "SWaM Document Checklist": "Review the list of required documents for SWaM certification.",
        "Document Preparation": "Gather and prepare all necessary documents before proceeding."
      },
      why: {
        "SWaM Document Checklist": "Ensures you have all required documentation for a complete SWaM application.",
        "Document Preparation": "Streamlines the application process and reduces delays due to missing information."
      },
      links: [
        { text: "SWaM Certification Requirements", url: "/resources/swam-requirements" },
        { text: "Preparing Your SWaM Application", url: "/resources/preparing-swam-application" }
      ]
    },
    2: {
      welcome: {
        title: "SWaM Documents - Part 2",
        description: "Let's continue with the SWaM certification document submission process.",
        expectations: [
          "Upload or provide information about required SWaM documents",
          "Ensure all submitted information is accurate and up-to-date",
          "Understand the importance of each required document"
        ]
      },
      details: {
        "Document Submission": "Upload or provide details about each required SWaM document.",
        "Information Accuracy": "Double-check all submitted information for accuracy."
      },
      why: {
        "Document Submission": "Completes your SWaM application with all necessary supporting documentation.",
        "Information Accuracy": "Prevents delays in processing due to incorrect or outdated information."
      },
      links: [
        { text: "SWaM Document Guide", url: "/resources/swam-document-guide" },
        { text: "Common SWaM Application Mistakes", url: "/resources/swam-application-mistakes" }
      ]
    },
    3: {
      welcome: {
        title: "SWaM Documents - Part 3",
        description: "Let's finalize the SWaM certification document submission process.",
        expectations: [
          "Complete any remaining document uploads or information provision",
          "Review all submitted documents for completeness",
          "Understand next steps in the SWaM certification process"
        ]
      },
      details: {
        "Final Document Check": "Ensure all required SWaM documents have been submitted.",
        "Application Review": "Review your entire SWaM application for completeness and accuracy."
      },
      why: {
        "Final Document Check": "Ensures your SWaM application is complete and ready for review.",
        "Application Review": "Helps identify any missing information or potential issues before submission."
      },
      links: [
        { text: "SWaM Application Checklist", url: "/resources/swam-application-checklist" },
        { text: "What Happens After SWaM Submission", url: "/resources/after-swam-submission" }
      ]
    }
  },
  4: {
    1: {
      welcome: {
        title: "Review Your Application",
        description: "Let's review your entire application before submission.",
        expectations: [
          "Carefully review all provided information",
          "Ensure all required documents are attached",
          "Verify the accuracy of all entries"
        ]
      },
      details: {
        "Application Overview": "Review a summary of all information provided in your application.",
        "Document Verification": "Confirm that all required and optional documents are properly attached."
      },
      why: {
        "Application Overview": "Allows you to catch any errors or omissions before final submission.",
        "Document Verification": "Ensures your application is complete and ready for processing."
      },
      links: [
        { text: "Application Review Best Practices", url: "/resources/application-review-best-practices" },
        { text: "Common Application Errors to Avoid", url: "/resources/common-application-errors" }
      ]
    },
    2: {
      welcome: {
        title: "Certify Your Information",
        description: "Let's certify the accuracy of your application.",
        expectations: [
          "Read and understand the certification statement",
          "Confirm the truthfulness and accuracy of all provided information",
          "Understand the legal implications of certification"
        ]
      },
      details: {
        "Certification Statement": "Review and acknowledge the certification statement.",
        "Legal Implications": "Understand the legal responsibilities of certifying your application."
      },
      why: {
        "Certification Statement": "Ensures you understand and agree to the terms of the application.",
        "Legal Implications": "Protects both you and the certifying agency by establishing a legal basis for the application."
      },
      links: [
        { text: "Understanding Certification Statements", url: "/resources/certification-statements" },
        { text: "Legal Aspects of Business Certification", url: "/resources/certification-legal-aspects" }
      ]
    },
    3: {
      welcome: {
        title: "Submit Your Application",
        description: "You're ready to submit your certification application!",
        expectations: [
          "Confirm you're ready to submit",
          "Understand the submission process",
          "Know what to expect after submission"
        ]
      },
      details: {
        "Final Confirmation": "Confirm that you're ready to submit your application.",
        "Submission Process": "Understand how the submission process works and what happens to your application."
      },
      why: {
        "Final Confirmation": "Ensures you're fully prepared to move forward with the certification process.",
        "Submission Process": "Helps you understand the next steps and what to expect after submission."
      },
      links: [
        { text: "After Submission: What's Next?", url: "/resources/after-submission" },
        { text: "Tracking Your Application Status", url: "/resources/track-application" }
      ]
    }
  },
  5: {
    1: {
      welcome: {
        title: "Confirmation Details",
        description: "Your application has been successfully submitted!",
        expectations: [
          "Review your submission confirmation",
          "Understand the next steps in the process",
          "Know how to track your application status"
        ]
      },
      details: {
        "Submission Confirmation": "Review the details of your submitted application.",
        "Next Steps": "Understand what happens next in the certification process."
      },
      why: {
        "Submission Confirmation": "Provides assurance that your application was received and is being processed.",
        "Next Steps": "Helps you prepare for the upcoming stages of the certification process."
      },
      links: [
        { text: "Understanding the Review Process", url: "/resources/certification-review-process" },
        { text: "Frequently Asked Questions After Submission", url: "/resources/post-submission-faq" }
      ]
    },
    2: {
      welcome: {
        title: "Next Steps",
        description: "Let's go over what you can expect moving forward.",
        expectations: [
          "Understand the timeline for application review",
          "Know how to respond to any requests for additional information",
          "Learn about potential outcomes of the certification process"
        ]
      },
      details: {
        "Review Timeline": "Understand the expected timeline for your application review.",
        "Additional Information Requests": "Learn how to handle requests for additional information or clarification.",
        "Potential Outcomes": "Understand the possible outcomes of the certification process."
      },
      why: {
        "Review Timeline": "Helps you plan and set expectations for the certification process.",
        "Additional Information Requests": "Ensures you're prepared to respond promptly to any inquiries, avoiding delays.",
        "Potential Outcomes": "Helps you understand and prepare for all possible results of your application."
      },
      links: [
        { text: "Certification Process Timeline", url: "/resources/certification-timeline" },
        { text: "Responding to Information Requests", url: "/resources/information-requests" },
        { text: "Understanding Certification Outcomes", url: "/resources/certification-outcomes" }
      ]
    }
  }
};

export default function FormSidebar({ currentStep, currentSubstep, focusedField }: FormSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [activeOption, setActiveOption] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const currentGuidelines = guidelines[currentStep as keyof typeof guidelines]?.[currentSubstep as keyof (typeof guidelines)[keyof typeof guidelines]]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (focusedField) {
      setActiveOption(focusedField)
      setExpandedSection(focusedField)
    } else {
      setActiveOption(null)
      setExpandedSection(null)
    }
  }, [focusedField])

  if (!currentGuidelines) {
    return null
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      <h3 className="text-lg font-semibold">Guidelines</h3>

      {/* Welcome Section with Avatar */}
      <div className="bg-white rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{currentGuidelines.welcome.title}</h2>
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 overflow-hidden">
          {isMounted && (
            <Image
              src="https://imageio.forbes.com/specials-images/imageserve/1040300704/Confidence-is-the-key-ingredient-for-small-business-success-/960x0.jpg?format=jpg&width=960"
              alt="Friendly certification guide"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="rounded-full"
            />
          )}
        </div>
        <p className="text-gray-600 mb-4">{currentGuidelines.welcome.description}</p>
        <div className="space-y-2">
          {currentGuidelines.welcome.expectations.map((expectation, index) => (
            <div key={index} className="flex items-center text-left text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{expectation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why We Need This Information */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Why We Need This Information
        </h4>
        <div className="space-y-2">
          {Object.entries(currentGuidelines.why).map(([key, value]) => (
            <motion.div
              key={key}
              className={`p-3 rounded-lg bg-white transition-colors ${
                activeOption === key ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <h5 className="font-medium text-sm text-blue-800">{key}</h5>
              <p className="text-sm text-gray-600">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Details */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Section Details
        </h4>
        {Object.entries(currentGuidelines.details).map(([key, value]) => (
          <div
            key={key}
            className="mb-2"
          >
            <button
              className={`flex justify-between items-center w-full text-left p-3 rounded-lg transition-colors ${
                expandedSection === key || activeOption === key
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-white'
              }`}
              onClick={() => !focusedField && setExpandedSection(expandedSection === key ? null : key)}
            >
              <span className="font-medium">{key}</span>
              {expandedSection === key ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <AnimatePresence>
              {expandedSection === key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-white rounded-b-lg text-sm text-gray-600"
                >
                  {value}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Resource Links */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Additional Resources
        </h4>
        <ul className="space-y-2">
          {currentGuidelines.links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                className="flex items-center text-blue-600 hover:underline text-sm p-2 rounded-lg hover:bg-blue-50 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
                <ExternalLink size={16} className="ml-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

