'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import ArchitectureDesigner from '@/components/ArchitectureDesigner'
import MasterSiteList from '@/components/MasterSiteList'
import SiteWorkbook from '@/components/SiteWorkbook'
import RolloutProgress from '@/components/RolloutProgress'
import { Server, Building2, Book, BarChart3 } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('architecture')
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)

  const tabs = [
    {
      id: 'architecture',
      label: 'Architecture Designer',
      icon: Server,
      component: ArchitectureDesigner
    },
    {
      id: 'sites',
      label: 'Master Site List',
      icon: Building2,
      component: () => <MasterSiteList onSiteSelect={setSelectedSiteId} />
    },
    {
      id: 'workbook',
      label: 'Site Workbook',
      icon: Book,
      component: () => <SiteWorkbook siteId={selectedSiteId} />
    },
    {
      id: 'progress',
      label: 'Rollout Progress',
      icon: BarChart3,
      component: RolloutProgress
    }
  ]

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="h-[calc(100vh-4rem)]">
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>
      </div>
    </ThemeProvider>
  )
}
