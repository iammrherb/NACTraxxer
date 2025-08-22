'use client'

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import ArchitectureDesigner from "@/components/ArchitectureDesigner"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ArchitectureDesigner />
      </main>
    </div>
  )
}