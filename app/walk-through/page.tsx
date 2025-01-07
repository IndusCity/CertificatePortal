'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, CheckCircle2, Briefcase, Users, Shield, Check, Home, Upload, Send, FileCheck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils'


interface Step {
title: string;
content: React.ReactNode;
icon: React.ReactNode;
image?: string; // Make image optional
}

const steps: Step[] = [
{
title: 'Welcome to the Certification Portal',
content: (
<div>
<p className="mb-4">This portal is designed to guide you through the certification application process seamlessly. Whether you're a small business, a minority-owned business, or a woman-owned business, we're here to help you get certified.</p>
<p className="mb-4">This walkthrough will explain the steps involved in applying for certification. Let's get started!</p>
</div>
),
icon: <Briefcase className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Creating Your Account',
content: (
<div>
<p className="mb-4">If you haven't already, you'll need to create an account. This is a simple process that requires your basic information. Click the &quot;Register&quot; button on the homepage to begin.</p>

<Image src="/placeholder.svg?height=250&width=500" alt="Registration Example" width={500} height={250} />
</div>
),
icon: <Users className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Accessing the Application',
content: (
<div>
<p className="mb-4">Once you're logged in, you can access the application form from your dashboard. The dashboard provides a central hub for managing your applications and tracking their progress.</p>

<Image src="/placeholder.svg?height=250&width=500" alt="Dashboard Example" width={500} height={250} />
</div>
),
icon: <Home className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Navigating the Application',
content: (
<div>
<p className="mb-4">The application is divided into sections, each focusing on a specific aspect of your business. Use the progress bar or the navigation buttons to move between sections.</p>

<Image src="/placeholder.svg?height=250&width=500" alt="Application Example" width={500} height={250} />
</div>
),
icon: <FileText className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Providing Information',
content: (
<div>
<p className="mb-4">Each section requires specific information about your business. Ensure the information you provide is accurate and complete. You can save your progress and return later if needed.</p>
<p className="mb-4">Tips for completing the application:</p>
<ul className="list-disc list-inside mb-4">
<li>Gather all necessary documents beforehand.</li>
<li>Review the guidelines for each section.</li>
<li>Double-check your entries for accuracy.</li>
</ul>
</div>
),
icon: <Check className="w-8 h-8 text-blue-500" />
},
{
title: 'Uploading Documents',
content: (
<div>
<p className="mb-4">You'll need to upload supporting documents for your application. Accepted file formats include PDF, JPG, and PNG. Make sure your files are less than 50MB each.</p>

<Image src="/placeholder.svg?height=250&width=500" alt="Upload Example" width={500} height={250} />
</div>
),
icon: <Upload className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Submitting Your Application',
content: (
<div>
<p className="mb-4">Once you've completed all sections and uploaded the necessary documents, review your application and click &quot;Submit&quot;.</p>

<Image src="/placeholder.svg?height=250&width=500" alt="Submit Example" width={500} height={250} />
</div>
),
icon: <Send className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Tracking Your Application',
content: (
<div>
<p className="mb-4">After submitting, you can track your application's status on your dashboard. We'll also send you email notifications about any updates or requests for additional information.</p>

<Image src="/placeholder.svg?height=250&width=500" alt="Tracking Example" width={500} height={250} />
</div>
),
icon: <FileCheck className="w-8 h-8 text-blue-500" />,
image: '/placeholder.svg?height=250&width=500'
},
{
title: 'Getting Help',
content: (
<div>
<p className="mb-4">If you have any questions or need assistance, our support team is here to help. You can access helpful resources and contact information on the &quot;Resources&quot; and &quot;Support&quot; pages.</p>
</div>
),
icon: <Shield className="w-8 h-8 text-blue-500" />
}
];

const WalkThrough: React.FC = () => {
const [currentStep, setCurrentStep] = useState(0);

const handleNext = () => {
setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
};

const handleBack = () => {
setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
};

return (
<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
<Card className="w-full max-w-3xl">
<CardHeader>
<CardTitle className="text-2xl font-bold">Guided Walk Through</CardTitle>
<CardDescription>Learn how to navigate the certification process.</CardDescription>
</CardHeader>
<CardContent>
<div className="space-y-6">
{/* Steps Overview */}
<div className="flex items-center space-x-4 overflow-x-auto">
{steps.map((step, index) => (
<motion.div
key={index}
className={cn(
'flex flex-col items-center shrink-0 w-24 cursor-pointer',
index === currentStep && "text-blue-500"
)}
onClick={() => setCurrentStep(index)}
whileHover={{ scale: index !== currentStep ? 1.1 : 1 }}
>
<div
className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
${index < currentStep ? 'bg-green-500 text-white' :
index === currentStep ? 'bg-blue-500 text-white' :
'bg-gray-200 text-gray-500'}`}
>
{index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
</div>
<p className="text-xs text-center">{step.title.split(' ').slice(0, 2).join(' ')}</p>
</motion.div>
))}
</div>

<AnimatePresence mode="wait" initial={false}>
<motion.div
key={currentStep}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}
className="space-y-4"
>
{/* Step Content */}
<div className="flex flex-col md:flex-row md:space-x-6">
{steps[currentStep].icon && (
<div className="shrink-0 mb-4 md:mb-0">
{steps[currentStep].icon}
</div>
)}
<div>
<h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
{steps[currentStep].content}
</div>
</div>
{steps[currentStep].image && (
<div className="relative mt-4 rounded-lg overflow-hidden">
<Image src={steps[currentStep].image} alt={steps[currentStep].title} width={500} height={250} />
</div>
)}
</motion.div>
</AnimatePresence>

{/* Navigation Buttons */}
<div className="flex justify-between mt-4">
<Button onClick={handleBack} disabled={currentStep === 0} variant="outline">
<ChevronLeft className="mr-2 h-4 w-4" />
Back
</Button>
<Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
Next
<ChevronRight className="ml-2 h-4 w-4" />
</Button>
</div>
</div>
</CardContent>
</Card>
</div>
);
};

export default WalkThrough;

