'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/Header'
import { TabNavigation } from '@/components/TabNavigation'
import { ArchitectureDesigner } from '@/components/ArchitectureDesigner'
import { InteractiveDiagram } from '@/components/InteractiveDiagram'
import { ArchitectureLegend } from '@/components/ArchitectureLegend'
import { MasterSiteList } from '@/components/MasterSiteList'
import { RolloutProgress } from '@/components/RolloutProgress'
import { SiteWorkbook } from '@/components/SiteWorkbook'
import { PolicyEditor } from '@/components/PolicyEditor'
import { OnboardingScenarios } from '@/components/OnboardingScenarios'
import { UserManagementModal } from '@/components/UserManagementModal'
import { ThemeCustomizer } from '@/components/ThemeCustomizer'
import EnhancedArchitectureDiagrams from '@/components/enhanced-architecture-diagrams'

export default function Home() {
  const [activeTab, setActiveTab] = useState('architecture-designer')
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'architecture-designer':
        return (
          <div className="space-y-6">
            <ArchitectureDesigner />
            <EnhancedArchitectureDiagrams />
          </div>
        )
      case 'interactive-diagram':
        return <InteractiveDiagram />
      case 'architecture-legend':
        return <ArchitectureLegend />
      case 'master-site-list':
        return <MasterSiteList onSiteSelect={setSelectedSite} />
      case 'rollout-progress':
        return <RolloutProgress />
      case 'site-workbook':
        return <SiteWorkbook selectedSite={selectedSite} />
      case 'policy-editor':
        return <PolicyEditor />
      case 'onboarding-scenarios':
        return <OnboardingScenarios />
      default:
        return (
          <div className="space-y-6">
            <ArchitectureDesigner />
            <EnhancedArchitectureDiagrams />
          </div>
        )
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </main>
        <UserManagementModal />
        <ThemeCustomizer />
      </div>
    </ThemeProvider>
  )
}
