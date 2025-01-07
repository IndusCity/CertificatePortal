'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
}

export function LiveChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you with your application today?", sender: 'assistant' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const simulateResponse = (question: string) => {
    // In a real implementation, this would call an AI service
    const responses = [
      "I'm here to help! Could you please provide more details about your question?",
      "That's a great question. Let me find the information for you.",
      "I understand your concern. Here's what you need to know about that part of the application.",
      "Thank you for asking. The process for that is as follows...",
      "I'm sorry, but I'm not sure about that. Let me check with our certification experts and get back to you."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' }
      setMessages(prev => [...prev, newMessage])
      setInput('')
      
      // Simulate AI response
      setTimeout(() => {
        const response: Message = { 
          id: messages.length + 2, 
          text: simulateResponse(input), 
          sender: 'assistant' 
        }
        setMessages(prev => [...prev, response])
      }, 1000)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <MessageCircle />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Chat Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-80 p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
                      {message.sender === 'assistant' && (
                        <AvatarImage src="/assistant-avatar.png" alt="Assistant" />
                      )}
                    </Avatar>
                    <div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your question..."
                  className="flex-grow mr-2"
                />
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

