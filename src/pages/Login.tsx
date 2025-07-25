import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'sonner'
import { Building2, Lock, Mail, Zap, Shield, Globe, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Login() {
  const [email, setEmail] = useState('demo@portnox.com')
  const [password, setPassword] = useState('demo123')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back! Login successful.')
      navigate('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption'
    },
    {
      icon: Globe,
      title: 'Global Deployment',
      description: 'Manage deployments across multiple regions'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Live insights and performance monitoring'
    }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div 
          className="w-full max-w-md space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo and Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 relative">
              <Zap className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portnox Deployment Tracker
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your deployment command center
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                <p className="text-center text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="h-4 w-4" />}
                    placeholder="Enter your email"
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    placeholder="Enter your password"
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5"
                    loading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Demo Credentials
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Email:</strong> demo@portnox.com</p>
                    <p><strong>Password:</strong> demo123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 h-20 w-20 bg-blue-500/20 rounded-full animate-float" />
        <div className="absolute top-40 right-32 h-16 w-16 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-32 h-12 w-12 bg-indigo-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="flex-1 flex items-center justify-center p-12">
          <motion.div 
            className="max-w-lg text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Deploy with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Confidence
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Streamline your NAC deployments with intelligent automation, 
                real-time monitoring, and comprehensive analytics.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Deployments</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-2xl font-bold text-indigo-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}