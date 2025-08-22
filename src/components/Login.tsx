"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Shield } from "lucide-react"

interface LoginProps {
  onLogin: (email: string, password: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onLogin(email, password)
    setIsLoading(false)
  }

  const useDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in to your account</h1>
          <p className="text-muted-foreground">Access the Portnox NAC Designer</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-center">Demo Credentials</h4>
              <p className="text-xs text-muted-foreground text-center">
                Use these credentials to login:
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <p><strong>Email:</strong> admin@portnox.com</p>
                  <p><strong>Password:</strong> admin123</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => useDemoCredentials("admin@portnox.com", "admin123")}
                  >
                    Use Admin Credentials
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground">Or:</div>
                
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <p><strong>Email:</strong> user@portnox.com</p>
                  <p><strong>Password:</strong> user123</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => useDemoCredentials("user@portnox.com", "user123")}
                  >
                    Use User Credentials
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}