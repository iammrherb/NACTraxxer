"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface PermissionGuardProps {
  permission?: string
  permissions?: string[]
  role?: string
  roles?: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  permissions,
  role,
  roles,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { data: session, status } = useSession()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      if (status === "loading") {
        setLoading(true)
        return
      }

      if (!session?.user?.email) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      try {
        const checkData: any = {}

        if (permission) checkData.permission = permission
        if (permissions) checkData.permissions = permissions
        if (role) checkData.role = role
        if (roles) checkData.roles = roles

        const response = await fetch("/api/rbac/check-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkData),
        })

        if (response.ok) {
          const result = await response.json()
          setHasAccess(result.hasAccess)
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error("Error checking permissions:", error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [session, status, permission, permissions, role, roles])

  if (loading || status === "loading") {
    return <Skeleton className="h-8 w-full" />
  }

  if (!session) {
    return fallback
  }

  if (hasAccess === false) {
    return fallback
  }

  return <>{children}</>
}
