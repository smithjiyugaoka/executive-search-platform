import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header"
import { SessionProvider } from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Executive Search Platform",
  description: "Connect search firms with client companies seeking executive talent",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}

