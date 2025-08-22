"use client"

import { useState } from "react"
import TabNavigation from "./TabNavigation"
import SitesManagement from "./SitesManagement"
import RolloutProgress from "./RolloutProgress"
import SiteWorkbook from "./SiteWorkbook"
import ArchitectureDesigner from "./ArchitectureDesigner"
import TimelineSchedule from "./TimelineSchedule"
import PolicyManagement from "./PolicyManagement"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Shield, LogOut, Settings, User } from "lucide-react"

interface DashboardProps {
  userEmail: string
  onLogout: () => void
}

export default function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("sites")

  const getUserInitials = (email: string) => {
    const parts = email.split('@')[0].split('.')
    return parts.map(part => part[0]).join('').toUpperCase().slice(0, 2)
  }

  const isAdmin = userEmail.includes("admin")

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "sites":
        return <SitesManagement />
      case "progress":
        return <RolloutProgress />
      case "workbook":
        return <SiteWorkbook />
      case "architecture":
        return <ArchitectureDesigner />
      case "timeline":
        return <TimelineSchedule />
      case "policies":
        return <PolicyManagement />
      default:
        return <SitesManagement />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Portnox NAC Designer</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {isAdmin ? "Administrator" : "User"} Portal
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userEmail} />
                    <AvatarFallback>{getUserInitials(userEmail)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isAdmin ? "Admin User" : "Standard User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          userRole={isAdmin ? "admin" : "user"}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {renderActiveComponent()}
      </main>
    </div>
  )
}