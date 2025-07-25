// SEO utilities for internal linking and structured data

export interface PageMetadata {
  title: string
  description: string
  keywords: string[]
  canonicalUrl?: string
  breadcrumbs?: Array<{
    name: string
    url: string
  }>
}

export const pageMetadata: Record<string, PageMetadata> = {
  '/': {
    title: 'Dashboard - Portnox Deployment Tracker',
    description: 'Overview of your NAC deployment projects, sites, and performance metrics',
    keywords: ['NAC deployment', 'network security', 'dashboard', 'portnox'],
    breadcrumbs: [
      { name: 'Dashboard', url: '/' }
    ]
  },
  '/sites': {
    title: 'Sites Management - Portnox Deployment Tracker',
    description: 'Manage and monitor all your deployment sites with comprehensive tracking',
    keywords: ['site management', 'deployment sites', 'NAC sites', 'network deployment'],
    breadcrumbs: [
      { name: 'Dashboard', url: '/' },
      { name: 'Sites', url: '/sites' }
    ]
  },
  '/projects': {
    title: 'Project Management - Portnox Deployment Tracker',
    description: 'Track and manage NAC deployment projects from planning to completion',
    keywords: ['project management', 'NAC projects', 'deployment tracking', 'project lifecycle'],
    breadcrumbs: [
      { name: 'Dashboard', url: '/' },
      { name: 'Projects', url: '/projects' }
    ]
  },
  '/analytics': {
    title: 'Analytics & Reports - Portnox Deployment Tracker',
    description: 'Comprehensive analytics and reporting for your NAC deployment performance',
    keywords: ['analytics', 'reports', 'deployment metrics', 'performance tracking'],
    breadcrumbs: [
      { name: 'Dashboard', url: '/' },
      { name: 'Analytics', url: '/analytics' }
    ]
  }
}

export function generateStructuredData(page: string, additionalData?: any) {
  const metadata = pageMetadata[page]
  if (!metadata) return null

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metadata.title,
    "description": metadata.description,
    "url": `${window.location.origin}${page}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": metadata.breadcrumbs?.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${window.location.origin}${crumb.url}`
      }))
    },
    ...additionalData
  }
}

// URL structure utilities
export const urlPatterns = {
  sites: {
    list: '/sites',
    detail: '/sites/:id',
    create: '/sites/create',
    edit: '/sites/:id/edit',
    bulk: '/sites/bulk'
  },
  projects: {
    list: '/projects',
    detail: '/projects/:id',
    create: '/projects/create',
    edit: '/projects/:id/edit',
    templates: '/projects/templates'
  },
  analytics: {
    overview: '/analytics',
    performance: '/analytics/performance',
    financial: '/analytics/financial',
    reports: '/analytics/reports'
  }
}

// Generate canonical URLs
export function getCanonicalUrl(path: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}${path}`
}

// Link relationship utilities
export function getLinkRelationships(currentPage: string) {
  const relationships: Record<string, string[]> = {
    '/': ['/sites', '/projects', '/analytics'],
    '/sites': ['/', '/projects', '/analytics', '/library/use-cases'],
    '/projects': ['/', '/sites', '/analytics', '/library/requirements'],
    '/analytics': ['/', '/sites', '/projects', '/settings/integrations']
  }

  return relationships[currentPage] || []
}