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
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'architecture':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <ArchitectureDesigner />
              <ArchitectureLegend />
            </div>
            <div className="xl:col-span-2">
              <InteractiveDiagram />
            </div>
          </div>
        )
      case 'policies':
        return <PolicyEditor />
      case 'onboarding':
        return <OnboardingScenarios />
      case 'sites':
        return <SiteManagement onSiteSelect={setSelectedSite} />
      case 'progress':
        return <ProgressTracking />
      case 'workbook':
        return <SiteWorkbook siteId={selectedSite} />
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <ArchitectureDesigner />
              <ArchitectureLegend />
            </div>
            <div className="xl:col-span-2">
              <InteractiveDiagram />
            </div>
          </div>
        )
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header 
          onUserManagement={() => setShowUserModal(true)}
          onThemeCustomizer={() => setShowThemeCustomizer(true)}
        />
        
        <main className="container mx-auto px-4 py-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </main>

        <UserManagementModal 
          open={showUserModal}
          onOpenChange={setShowUserModal}
        />

        <ThemeCustomizer 
          open={showThemeCustomizer}
          onClose={() => setShowThemeCustomizer(false)}
        />
      </div>
    </ThemeProvider>
  )
}
