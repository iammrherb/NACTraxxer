'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import ArchitectureDesigner from '@/components/ArchitectureDesigner'
import InteractiveDiagram from '@/components/InteractiveDiagram'
import ArchitectureLegend from '@/components/ArchitectureLegend'
import PolicyEditor from '@/components/PolicyEditor'
import OnboardingScenarios from '@/components/OnboardingScenarios'
import { ThemeProvider } from '@/components/theme-provider'
import MasterSiteList from '@/components/MasterSiteList'
import SiteWorkbook from '@/components/SiteWorkbook'
import RolloutProgress from '@/components/RolloutProgress'
import UserManagementModal from '@/components/UserManagementModal'
import ThemeCustomizer from '@/components/ThemeCustomizer'

export default function Home() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [currentView, setCurrentView] = useState('complete')
  const [animationSpeed, setAnimationSpeed] = useState(2)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  const [config, setConfig] = useState({
    cloudProvider: 'portnox-cloud',
    networkVendor: 'cisco',
    connectivityType: 'wired-wireless',
    deploymentType: 'hybrid',
    authMethod: 'certificate',
    mdmIntegration: 'microsoft-intune'
  })

  const renderTabContent = () => {
    switch (activeTab) {
      case 'architecture':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ArchitectureDesigner 
                config={config} 
                setConfig={setConfig}
                currentView={currentView}
                setCurrentView={setCurrentView}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <InteractiveDiagram 
                config={config} 
                currentView={currentView}
                animationSpeed={animationSpeed}
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
        return <MasterSiteList />
      case 'workbook':
        return <SiteWorkbook />
      case 'progress':
        return <RolloutProgress />
      default:
        return null
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Header 
          onUserManagement={() => setShowUserModal(true)}
          onThemeCustomizer={() => setShowThemeCustomizer(true)}
        />
        
        <main className="container mx-auto px-4 py-6">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </main>

        {showUserModal && (
          <UserManagementModal onClose={() => setShowUserModal(false)} />
        )}

        {showThemeCustomizer && (
          <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
        )}
      </div>
    </ThemeProvider>
  )
}
