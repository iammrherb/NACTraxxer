'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Book, FileText, Network, Users, Settings, Download, Save, Edit, Plus, Trash2 } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

interface WorkbookSection {
  id: string
  title: string
  content: string
  lastModified: string
  author: string
  status: 'draft' | 'review' | 'approved'
}

interface SiteConfiguration {
  networkDetails: {
    primaryVLAN: string
    guestVLAN: string
    iotVLAN: string
    managementVLAN: string
    subnets: string[]
    dnsServers: string[]
    ntpServers: string[]
  }
  authentication: {
    radiusServers: string[]
    ldapServers: string[]
    certificateAuthority: string
    authenticationMethods: string[]
  }
  policies: {
    userPolicies: string[]
    devicePolicies: string[]
    guestPolicies: string[]
    compliancePolicies: string[]
  }
  contacts: {
    projectManager: string
    technicalLead: string
    networkAdmin: string
    securityContact: string
  }
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [activeSection, setActiveSection] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSite, setSelectedSite] = useState('1') // Default to first site

  const [workbookSections, setWorkbookSections] = useState<WorkbookSection[]>([
    {
      id: 'overview',
      title: 'Site Overview',
      content: `# New York Headquarters - Site Overview

## Location Details
- **Address**: 123 Corporate Plaza, New York, NY 10001
- **Building Type**: Corporate Headquarters
- **Floors**: 25 floors
- **Square Footage**: 500,000 sq ft
- **Occupancy**: 2,500 employees

## Network Infrastructure
- **Primary ISP**: Verizon Business (1Gbps)
- **Backup ISP**: AT&T Business (500Mbps)
- **Internal Backbone**: 10Gbps fiber
- **Wireless Coverage**: 95% building coverage
- **Wired Ports**: 5,000 active ports

## Current State
- Legacy 802.1X implementation with Windows NPS
- Mixed vendor environment (Cisco/Aruba)
- Limited guest access capabilities
- Manual device onboarding processes

## Project Scope
- Implement Portnox Cloud NAC solution
- Certificate-based authentication for all devices
- Automated guest access portal
- IoT device segmentation and control
- Integration with Azure AD and Intune`,
      lastModified: '2024-02-15',
      author: 'Alex Rivera',
      status: 'approved'
    },
    {
      id: 'network-design',
      title: 'Network Design',
      content: `# Network Architecture Design

## VLAN Structure
- **VLAN 100**: Corporate Users (192.168.100.0/24)
- **VLAN 200**: Guest Access (192.168.200.0/24)
- **VLAN 300**: IoT Devices (192.168.300.0/24)
- **VLAN 400**: BYOD Devices (192.168.400.0/24)
- **VLAN 999**: Quarantine (192.168.999.0/24)

## Network Segmentation
- Corporate users have full access to internal resources
- Guest users limited to internet access only
- IoT devices restricted to specific services
- BYOD devices have limited corporate access

## Security Zones
- **Trusted Zone**: Corporate devices with certificates
- **Guest Zone**: Temporary access with time limits
- **IoT Zone**: Device-specific access controls
- **Quarantine Zone**: Non-compliant devices

## Access Control Lists
- Detailed ACLs for each VLAN
- Application-based filtering
- Time-based access restrictions
- Bandwidth limitations per device type`,
      lastModified: '2024-02-10',
      author: 'John Smith',
      status: 'approved'
    },
    {
      id: 'implementation-plan',
      title: 'Implementation Plan',
      content: `# Implementation Timeline

## Phase 1: Infrastructure Preparation (Weeks 1-2)
- [ ] Network assessment and documentation
- [ ] Portnox Cloud tenant setup
- [ ] Certificate Authority configuration
- [ ] RADIUS integration testing

## Phase 2: Pilot Deployment (Weeks 3-4)
- [ ] Select pilot user group (50 users)
- [ ] Deploy certificates to pilot devices
- [ ] Configure initial policies
- [ ] Test authentication flows

## Phase 3: Gradual Rollout (Weeks 5-8)
- [ ] Department-by-department rollout
- [ ] User training and communication
- [ ] Issue tracking and resolution
- [ ] Policy refinement

## Phase 4: Full Production (Weeks 9-12)
- [ ] Complete user migration
- [ ] Guest access portal activation
- [ ] IoT device onboarding
- [ ] Final testing and validation

## Risk Mitigation
- Maintain parallel legacy system during transition
- 24/7 support during critical phases
- Rollback procedures documented
- Emergency contact procedures established`,
      lastModified: '2024-02-08',
      author: 'Alex Rivera',
      status: 'review'
    },
    {
      id: 'testing-procedures',
      title: 'Testing Procedures',
      content: `# Testing and Validation Procedures

## Pre-Deployment Testing
1. **Certificate Validation**
   - Verify certificate chain trust
   - Test certificate revocation
   - Validate SCEP enrollment process

2. **Authentication Testing**
   - EAP-TLS authentication flows
   - RADIUS server connectivity
   - Policy evaluation accuracy

3. **Network Connectivity**
   - VLAN assignment verification
   - ACL enforcement testing
   - Internet connectivity validation

## User Acceptance Testing
- Test with representative device types
- Validate user experience flows
- Performance and reliability testing
- Guest access portal functionality

## Rollback Procedures
- Document rollback triggers
- Maintain legacy system readiness
