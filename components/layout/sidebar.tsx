import type React from "react"
import { LayoutDashboard, ListChecks, Settings, Library } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

interface SidebarProps {
  isCollapsed: boolean
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <div className="flex h-full w-60 flex-col border-r bg-secondary">
      <div className="flex-1 space-y-2 p-2">
        <Link to="/" className="grid h-12 place-items-center p-3">
          <h1 className="text-2xl font-bold">Taskify</h1>
        </Link>
        <Separator />
        <ScrollArea className="h-[calc(100vh-10rem)] pb-10">
          <div className="space-y-1">
            <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/projects" icon={<ListChecks size={18} />}>
              Projects
            </SidebarLink>
            <SidebarLink href="/library" icon={<Library size={18} />}>
              Library
            </SidebarLink>
          </div>
        </ScrollArea>
      </div>
      <div className="flex items-center border-t p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/01.png" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  icon: React.ReactNode
  href: string
  children: React.ReactNode
}

function SidebarLink({ icon, href, children }: SidebarLinkProps) {
  return (
    <Link to={href} className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
      {icon}
      <p>{children}</p>
    </Link>
  )
}
