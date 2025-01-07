'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PaperclipIcon as PaperAirplane } from 'lucide-react';

export default function Support() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [submitted, setSubmitted] = useState(false);

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
// Here you would typically integrate with a backend service or email provider
// to send the contact information.
console.log('Contact form submitted:', { name, email, message });
setSubmitted(true);
};

return (
<div className="container mx-auto px-4 py-12">
<Card>
  <CardHeader>
    <CardTitle className="text-2xl font-bold">Contact Support</CardTitle>
    <CardDescription>We're here to help!</CardDescription>
  </CardHeader>
  <CardContent>
    {submitted ? (
      <div className="text-center">
        <p className="text-xl font-semibold text-green-600 mb-4">Thank you for your message!</p>
        <p className="text-gray-600">We'll get back to you as soon as possible.</p>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Your Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="message">Your Message</Label>
          <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">
          Send <PaperAirplane className="ml-2 h-4 w-4" />
        </Button>
      </form>
    )}
  </CardContent>
</Card>
</div>
);
}

