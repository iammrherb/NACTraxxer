"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/components/session-provider"
import { toast } from "@/hooks/use-toast"
import { Network } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useSession()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await login(email, password)
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      })
      navigate("/")
    } else {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl w-fit mb-4">
            <Network className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl gradient-text">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access the world's most advanced NAC Designer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              className="w-full bg-gradient-to-r from-primary to-primary-variant hover:shadow-primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@portnox.com / admin123</p>
              <p><strong>User:</strong> user@portnox.com / user123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}