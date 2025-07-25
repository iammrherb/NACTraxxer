import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" asChild>
            <Link href="/settings/users">User Management</Link>
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="general" disabled>
            General
          </TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
