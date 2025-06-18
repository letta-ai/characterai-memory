import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LettaProvider } from "@/hooks/use-letta"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider" // Assuming you have this from shadcn/ui

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "CharacterPlus",
  description: "Chat with intelligent, stateful AI agents.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col font-sans ${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LettaProvider>
            <main className="flex-1">{children}</main>
            <footer className="p-6 text-center text-xs text-muted-foreground border-t border-border">
              CharacterPlus - Experience the Future of AI Conversations
            </footer>
            <Toaster />
          </LettaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
