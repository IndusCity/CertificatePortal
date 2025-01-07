'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { User, LogIn, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  
  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkLoginStatus()
  }, [])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-0.5">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/attari-datastore.appspot.com/o/test%2Flogo.png?alt=media&token=834b7cea-0972-454b-a6a2-3e9aa2b4a5d8"
                alt="SBSD Certification Portal Logo"
                width={80}
                height={20}
               
              />
              <div className="ml-2">
                <p className="text-sm font-semibold leading-tight">Department of Small Business and Supplier Diversity</p>
                <p className="text-xs text-gray-300">An official website of the Commonwealth of Virginia</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full text-white hover:text-blue-200">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-200 text-xs p-1" onClick={handleLogin}>
                  <LogIn className="mr-1 h-2 w-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-white text-blue-800 hover:bg-blue-100 text-xs p-1" onClick={handleRegister}>
                  Register
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-blue-200 p-0.5">
              <Menu className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

