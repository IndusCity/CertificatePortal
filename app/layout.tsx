import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SBSD Certification Portal',
  description: 'Virginia Department of Small Business and Supplier Diversity Certification Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto px-4 pt-2 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

