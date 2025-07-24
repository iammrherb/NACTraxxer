# Technical Architecture: Portnox Deployment Tracker

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Load Balancer                            │
│                     (Cloudflare/AWS ALB)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────────┐
│                    API Gateway                                  │
│                  (Kong Enterprise)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Rate Limit  │ │ Auth/AuthZ  │ │ Monitoring  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────────┐
│                 Microservices Layer                             │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │   Project   │ │    Site     │ │    User     │ │ Integration ││
│ │  Service    │ │  Service    │ │  Service    │ │  Service    ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │ Reporting   │ │ Workflow    │ │    AI/ML    │ │ Notification││
│ │  Service    │ │  Service    │ │  Service    │ │  Service    ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────────┐
│                    Data Layer                                   │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │  Supabase   │ │    Redis    │ │Elasticsearch│ │   InfluxDB  ││
│ │(PostgreSQL) │ │   Cluster   │ │   Cluster   │ │   Cluster   ││
│ │             │ │             │ │             │ │             ││
│ │ Primary DB  │ │   Caching   │ │   Search    │ │Time Series  ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Design

### Core Tables
```sql
-- Enhanced Users table with enterprise features
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('project_manager', 'technical_owner', 'admin', 'viewer')),
  organization_id UUID REFERENCES organizations(id),
  department TEXT,
  manager_id UUID REFERENCES users(id),
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  availability_calendar JSONB DEFAULT '{}',
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Sites table with comprehensive tracking
CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  parent_site_id TEXT REFERENCES sites(id),
  site_hierarchy_path TEXT,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  address JSONB,
  timezone TEXT,
  priority TEXT CHECK (priority IN ('P0-Critical', 'P1-High', 'P2-Medium', 'P3-Low')),
  phase INTEGER NOT NULL DEFAULT 1,
  users_count INTEGER NOT NULL DEFAULT 0,
  project_manager_id UUID REFERENCES users(id),
  deployment_type TEXT CHECK (deployment_type IN ('poc', 'pilot', 'production', 'migration')),
  radsec_config TEXT NOT NULL,
  planned_start DATE NOT NULL,
  planned_end DATE NOT NULL,
  actual_start DATE,
  actual_end DATE,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'delayed', 'cancelled')),
  completion_percent INTEGER DEFAULT 0 CHECK (completion_percent >= 0 AND completion_percent <= 100),
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  budget_allocated DECIMAL(12,2),
  budget_spent DECIMAL(12,2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organizations table for multi-tenancy
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  size_category TEXT CHECK (size_category IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  headquarters_country TEXT,
  annual_revenue_range TEXT,
  employee_count_range TEXT,
  compliance_requirements TEXT[],
  branding_config JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'standard',
  features_enabled TEXT[],
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table for grouping sites
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  description TEXT,
  project_type TEXT CHECK (project_type IN ('poc', 'pilot', 'production', 'migration', 'expansion')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled', 'on_hold')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  project_manager_id UUID REFERENCES users(id),
  sponsor_id UUID REFERENCES users(id),
  health_score INTEGER DEFAULT 100,
  risk_level TEXT DEFAULT 'low',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Use Cases with comprehensive tracking
CREATE TABLE use_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  industry_specific BOOLEAN DEFAULT false,
  target_industries TEXT[],
  complexity_level TEXT CHECK (complexity_level IN ('low', 'medium', 'high', 'expert')),
  estimated_duration_weeks INTEGER,
  prerequisites TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  priority TEXT DEFAULT 'optional' CHECK (priority IN ('mandatory', 'recommended', 'optional', 'nice_to_have')),
  completion_percentage INTEGER DEFAULT 0,
  business_value_score INTEGER CHECK (business_value_score >= 1 AND business_value_score <= 10),
  technical_difficulty INTEGER CHECK (technical_difficulty >= 1 AND technical_difficulty <= 10),
  dependencies TEXT[],
  tags TEXT[],
  documentation_links JSONB DEFAULT '[]',
  vendor_specific_configs JSONB DEFAULT '{}',
  success_criteria JSONB DEFAULT '[]',
  notes TEXT,
  created_by UUID REFERENCES users(id),
  is_custom BOOLEAN DEFAULT false,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Comprehensive Test Cases
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  use_case_id TEXT REFERENCES use_cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  test_type TEXT CHECK (test_type IN ('functional', 'integration', 'performance', 'security', 'compliance')),
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  estimated_duration_minutes INTEGER,
  prerequisites TEXT[],
  test_steps JSONB NOT NULL,
  expected_outcome TEXT NOT NULL,
  automation_available BOOLEAN DEFAULT false,
  automation_script TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'passed', 'failed', 'blocked', 'skipped')),
  actual_outcome TEXT,
  test_date TIMESTAMPTZ,
  tester_id UUID REFERENCES users(id),
  execution_time_minutes INTEGER,
  screenshots JSONB DEFAULT '[]',
  logs JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vendor Configuration Library
CREATE TABLE vendor_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  product_line TEXT NOT NULL,
  model TEXT NOT NULL,
  firmware_version TEXT,
  config_type TEXT NOT NULL,
  config_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  validation_rules JSONB DEFAULT '[]',
  documentation_url TEXT,
  tested_versions TEXT[],
  known_issues JSONB DEFAULT '[]',
  best_practices JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Logging for Audit Trail
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  request_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Webhooks Configuration
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  retry_config JSONB DEFAULT '{}',
  headers JSONB DEFAULT '{}',
  last_triggered TIMESTAMPTZ,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## API Design Patterns

### RESTful API Structure
```typescript
// Consistent API response format
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: PaginationMeta
    filters?: FilterMeta
    sort?: SortMeta
  }
  links?: {
    self: string
    first?: string
    last?: string
    prev?: string
    next?: string
  }
}

// Standardized error codes
enum APIErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}
```

## Performance Optimization

### Caching Strategy
```typescript
interface CachingStrategy {
  levels: {
    cdn: "Cloudflare for static assets"
    application: "Redis for API responses"
    database: "PostgreSQL query cache"
    browser: "Service worker for offline capability"
  }
  
  cache_policies: {
    static_data: "24 hours (vendor configs, use cases)"
    dynamic_data: "5 minutes (site status, user data)"
    real_time_data: "No cache (live metrics, notifications)"
    reports: "1 hour (generated reports)"
  }
  
  invalidation: {
    strategies: ["Time-based", "Event-based", "Manual"]
    patterns: ["Tag-based", "Wildcard", "Dependency-based"]
  }
}
```

### Database Optimization
```typescript
interface DatabaseOptimization {
  indexing_strategy: {
    primary_indexes: "All foreign keys and frequently queried columns"
    composite_indexes: "Multi-column queries (org_id + status)"
    partial_indexes: "Filtered indexes for specific conditions"
    gin_indexes: "JSONB columns for metadata searches"
  }
  
  partitioning: {
    time_based: "Activity logs partitioned by month"
    tenant_based: "Large tables partitioned by organization"
    hybrid: "Combination of time and tenant partitioning"
  }
  
  query_optimization: {
    prepared_statements: "All parameterized queries"
    connection_pooling: "PgBouncer for connection management"
    read_replicas: "Read-only queries to replica databases"
    materialized_views: "Pre-computed aggregations"
  }
}
```

This enhanced PRD and technical architecture provides a solid foundation for building a truly enterprise-grade NAC deployment platform. The comprehensive feature set, detailed technical specifications, and clear implementation roadmap position this as a market-leading solution.