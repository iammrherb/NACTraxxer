"use client"

import { useState } from "react"
import ArchitectureDesigner from "@/components/ArchitectureDesigner"
import ThemeCustomizer from "@/components/ThemeCustomizer"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  const [showTheme, setShowTheme] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-md p-2">
                <img
                  src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png"
                  alt="Portnox Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/40" />
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Zero Trust NAC Architecture Designer</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setShowTheme(true)}>
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">
        <ArchitectureDesigner />
      </main>

      {/* Modals */}
      <ThemeCustomizer open={showTheme} onOpenChange={setShowTheme} />
    </div>
  )
}
