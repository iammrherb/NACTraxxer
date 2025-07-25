"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface ProjectTabsProps {
  projectId: string
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname()

  const tabs = [
    { name: "Overview", href: `/projects/${projectId}` },
    { name: "Scoping", href: `/projects/${projectId}/scoping` },
    { name: "Timeline", href: `/projects/${projectId}/timeline` },
  ]

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              pathname.startsWith(tab.href) &&
                (tab.href.length > `/projects/${projectId}`.length || pathname === tab.href)
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300",
              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
            )}
            aria-current={pathname.startsWith(tab.href) ? "page" : undefined}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
