'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import ArchitectureDesigner from '@/components/ArchitectureDesigner'
import InteractiveDiagram from '@/components/InteractiveDiagram'
import ArchitectureLegend from '@/components/ArchitectureLegend'
import PolicyEditor from '@/components/PolicyEditor'
import OnboardingScenarios from '@/components/OnboardingScenarios'
import SiteManagement from '@/components/site-management'
import ProgressTracking from '@/components/progress-tracking'
import SiteWorkbook from '@/components/site-workbook'
import UserManagementModal from '@/components/user-management-modal'
import ThemeCustomizer from '@/components/theme-customizer'

export default function Home() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [currentView, setCurrentView] = useState('complete')
  const [config, setConfig] = useState({
    cloudProvider: 'aws',
    wiredVendor: 'cisco',
    wirelessVendor: 'cisco',
    connectivity: 'standard',
    animationSpeed: 'medium',
    showLabels: true,
    showPorts: true
  })

  const handleConfigChange = (newConfig: any) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'architecture':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <ArchitectureDesigner 
                config={config} 
                onConfigChange={handleConfigChange}
                currentView={currentView}
                onViewChange={setCurrentView}
              />
            </div>
            <div className="xl:col-span-2 space-y-6">
              <InteractiveDiagram 
                config={config} 
                currentView={currentView}
              />
              <ArchitectureLegend currentView={currentView} />
            </div>
          </div>
        )
      case 'policies':
        return <PolicyEditor />
      case 'onboarding':
        return <OnboardingScenarios />
      case 'sites':
        return <SiteManagement />
      case 'progress':
        return <ProgressTracking />
      case 'workbook':
        return <SiteWorkbook />
      case 'users':
        return <UserManagementModal />
      case 'themes':
        return <ThemeCustomizer />
      default:
        return null
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
