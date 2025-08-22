"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, Shield, BarChart3, Settings, Zap, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text">
          World's Most Advanced NAC Designer
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Design, visualize, and simulate comprehensive Network Access Control architectures
          with mind-blowing interactive diagrams, real-time policy testing, and industry-specific templates.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-variant hover:shadow-primary">
            <Link to="/architecture">
              <Network className="mr-2 h-5 w-5" />
              Start Designing
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <BarChart3 className="mr-2 h-5 w-5" />
            View Demo
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader>
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl w-fit">
              <Network className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">Interactive Architecture</CardTitle>
            <CardDescription>
              Design complex NAC architectures with drag-and-drop components, real-time connections, and dynamic visualizations.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader>
            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl w-fit">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">Policy Management</CardTitle>
            <CardDescription>
              Create, test, and simulate security policies with advanced rule engines and compliance frameworks.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader>
            <div className="p-3 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl w-fit">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">Real-time Simulation</CardTitle>
            <CardDescription>
              Test network scenarios with live metrics, device behavior simulation, and comprehensive analytics.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-100">
          <CardHeader>
            <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl w-fit">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">Industry Templates</CardTitle>
            <CardDescription>
              Pre-built architectures for healthcare, finance, education, and enterprise environments with compliance built-in.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-rose-100">
          <CardHeader>
            <div className="p-3 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl w-fit">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">Advanced Animations</CardTitle>
            <CardDescription>
              Beautiful animations showing data flow, policy enforcement, and network traffic patterns in real-time.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-cyan-100">
          <CardHeader>
            <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl w-fit">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">Full Customization</CardTitle>
            <CardDescription>
              Customize every aspect from colors and themes to component behavior and integration points.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary-variant/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build the Future of NAC?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of network architects who trust our platform to design, simulate, and deploy 
            world-class Network Access Control solutions.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-variant hover:shadow-primary">
            <Link to="/architecture">
              <Network className="mr-2 h-5 w-5" />
              Start Your Architecture
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}