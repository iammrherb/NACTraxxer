"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [allParams, setAllParams] = useState<any>({})

  useEffect(() => {
    // Capture all URL parameters
    const params = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    setAllParams(params)

    // Run debug tests
    runDebugTests()
  }, [searchParams])

  const runDebugTests = async () => {
    try {
      // Test if our debug API works
      const debugResponse = await fetch("/api/debug")
      const debugData = await debugResponse.json()
      setDebugInfo(debugData)
    } catch (error) {
      setDebugInfo({ error: "Debug API failed", message: error.message })
    }
  }

  const testNextAuthDirectly = async () => {
    try {
      console.log("Testing NextAuth providers endpoint...")
      const response = await fetch("/api/auth/providers")
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log("Providers data:", data)
        alert(`NextAuth providers working: ${JSON.stringify(data, null, 2)}`)
      } else {
        const text = await response.text()
        console.log("Error response text:", text)
        alert(`NextAuth providers failed: ${response.status}\n${text}`)
      }
    } catch (error) {
      console.error("NextAuth test error:", error)
      alert(`NextAuth test exception: ${error.message}`)
    }
  }

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "Default":
        return "An error occurred during authentication."
      case null:
        return "Unknown authentication error occurred."
      default:
        return `Authentication error: ${error}`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-4xl space-y-8 p-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/placeholder.svg?height=60&width=200&text=Portnox"
            alt="Portnox Logo"
            width={200}
            height={60}
            className="mx-auto mb-4"
          />
        </div>

        {/* Error Information */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-white">Authentication Error</CardTitle>
            <CardDescription className="text-slate-300">{getErrorMessage(error)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* All URL Parameters */}
            <div className="bg-black/20 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Error Details:</h3>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap">{JSON.stringify(allParams, null, 2)}</pre>
            </div>

            {/* Debug Information */}
            {debugInfo && (
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">System Debug Info:</h3>
                <pre className="text-xs text-slate-300 whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signin" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </Link>

              <Button onClick={testNextAuthDirectly} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Test NextAuth
              </Button>

              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Debug Information */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-2">
            <p>1. Check if NEXTAUTH_URL and NEXTAUTH_SECRET are set in environment variables</p>
            <p>2. Verify NextAuth configuration in app/api/auth/[...nextauth]/route.ts</p>
            <p>3. Check browser console and server logs for detailed error messages</p>
            <p>4. Test the NextAuth providers endpoint directly</p>
            <p>5. Ensure all NextAuth dependencies are properly installed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
