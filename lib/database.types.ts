export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      checklist_items: {
        Row: {
          category: string
          id: string
          name: string
        }
        Insert: {
          category: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      device_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          customer: string
          id: string
          name: string
          settings: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer: string
          id?: string
          name: string
          settings?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer?: string
          id?: string
          name?: string
          settings?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      scoping_questionnaires: {
        Row: {
          country: string
          created_at: string
          id: string
          industry: string
          mdm_vendors: string[]
          organization_name: string
          region: string
          site_count: number
          status: "Draft" | "Completed"
          total_users: number
          updated_at: string
          wired_vendors: string[]
          wireless_vendors: string[]
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          industry: string
          mdm_vendors: string[]
          organization_name: string
          region: string
          site_count: number
          status?: "Draft" | "Completed"
          total_users: number
          updated_at?: string
          wired_vendors: string[]
          wireless_vendors: string[]
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          industry?: string
          mdm_vendors?: string[]
          organization_name?: string
          region?: string
          site_count?: number
          status?: "Draft" | "Completed"
          total_users?: number
          updated_at?: string
          wired_vendors?: string[]
          wireless_vendors?: string[]
        }
        Relationships: []
      }
      sites: {
        Row: {
          completion_percentage: number
          config: Json | null
          country: string
          created_at: string
          details: Json | null
          go_live_date: string | null
          id: string
          mdm_vendor_ids: string[] | null
          name: string
          pm_id: string | null
          progress: Json | null
          project_id: string
          region: string
          status: "Planning" | "In Progress" | "Completed" | "On Hold"
          tech_owner_ids: string[] | null
          updated_at: string
          users_count: number
          vendor_ids: string[] | null
        }
        Insert: {
          completion_percentage?: number
          config?: Json | null
          country: string
          created_at?: string
          details?: Json | null
          go_live_date?: string | null
          id?: string
          mdm_vendor_ids?: string[] | null
          name: string
          pm_id?: string | null
          progress?: Json | null
          project_id: string
          region: string
          status?: "Planning" | "In Progress" | "Completed" | "On Hold"
          tech_owner_ids?: string[] | null
          updated_at?: string
          users_count: number
          vendor_ids?: string[] | null
        }
        Update: {
          completion_percentage?: number
          config?: Json | null
          country?: string
          created_at?: string
          details?: Json | null
          go_live_date?: string | null
          id?: string
          mdm_vendor_ids?: string[] | null
          name?: string
          pm_id?: string | null
          progress?: Json | null
          project_id?: string
          region?: string
          status?: "Planning" | "In Progress" | "Completed" | "On Hold"
          tech_owner_ids?: string[] | null
          updated_at?: string
          users_count?: number
          vendor_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      use_cases: {
        Row: {
          description: string
          id: string
          name: string
        }
        Insert: {
          description: string
          id?: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          role: "Admin" | "Project Manager" | "Technical Owner" | "Read-Only"
        }
        Insert: {
          id?: string
          name: string
          role: "Admin" | "Project Manager" | "Technical Owner" | "Read-Only"
        }
        Update: {
          id?: string
          name?: string
          role?: "Admin" | "Project Manager" | "Technical Owner" | "Read-Only"
        }
        Relationships: []
      }
      vendors: {
        Row: {
          id: string
          name: string
          type: "wired" | "wireless" | "firewall" | "vpn" | "edr_xdr" | "siem" | "mdm"
        }
        Insert: {
          id?: string
          name: string
          type: "wired" | "wireless" | "firewall" | "vpn" | "edr_xdr" | "siem" | "mdm"
        }
        Update: {
          id?: string
          name?: string
          type?: "wired" | "wireless" | "firewall" | "vpn" | "edr_xdr" | "siem" | "mdm"
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
