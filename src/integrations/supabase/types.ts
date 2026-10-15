export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          created_at: string
          id: string
          notes: string | null
          opportunity_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_jobs: {
        Row: {
          candidates: Json
          category: string | null
          completed_at: string | null
          error_summary: string | null
          events: Json
          id: string
          opportunity_ids: string[]
          region: string | null
          requested_by: string
          results_count: number
          search_query: string
          stage: string
          started_at: string
          status: string
        }
        Insert: {
          candidates?: Json
          category?: string | null
          completed_at?: string | null
          error_summary?: string | null
          events?: Json
          id?: string
          opportunity_ids?: string[]
          region?: string | null
          requested_by: string
          results_count?: number
          search_query: string
          stage?: string
          started_at?: string
          status?: string
        }
        Update: {
          candidates?: Json
          category?: string | null
          completed_at?: string | null
          error_summary?: string | null
          events?: Json
          id?: string
          opportunity_ids?: string[]
          region?: string | null
          requested_by?: string
          results_count?: number
          search_query?: string
          stage?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      document_checklist: {
        Row: {
          document_name: string
          id: string
          is_completed: boolean
          is_suggested: boolean
          opportunity_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          document_name: string
          id?: string
          is_completed?: boolean
          is_suggested?: boolean
          opportunity_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          document_name?: string
          id?: string
          is_completed?: boolean
          is_suggested?: boolean
          opportunity_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_checklist_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_reports: {
        Row: {
          created_at: string
          id: string
          message: string
          opportunity_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          opportunity_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          opportunity_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          application_instructions: string | null
          application_open_date: string | null
          application_status: string
          application_steps: string[]
          benefits: string | null
          category: string
          created_at: string
          deadline: string | null
          description: string | null
          discovered_by: string | null
          discovery_job_id: string | null
          eligibility_criteria: Json
          eligibility_text: string[]
          id: string
          is_demo: boolean
          last_checked_at: string | null
          location_or_region: string | null
          missing_fields: string[]
          normalized_key: string | null
          official_application_url: string | null
          official_source_url: string | null
          provider: string | null
          required_documents: string[]
          source_excerpt: string | null
          source_last_published_at: string | null
          title: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          application_instructions?: string | null
          application_open_date?: string | null
          application_status?: string
          application_steps?: string[]
          benefits?: string | null
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          discovered_by?: string | null
          discovery_job_id?: string | null
          eligibility_criteria?: Json
          eligibility_text?: string[]
          id?: string
          is_demo?: boolean
          last_checked_at?: string | null
          location_or_region?: string | null
          missing_fields?: string[]
          normalized_key?: string | null
          official_application_url?: string | null
          official_source_url?: string | null
          provider?: string | null
          required_documents?: string[]
          source_excerpt?: string | null
          source_last_published_at?: string | null
          title: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          application_instructions?: string | null
          application_open_date?: string | null
          application_status?: string
          application_steps?: string[]
          benefits?: string | null
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          discovered_by?: string | null
          discovery_job_id?: string | null
          eligibility_criteria?: Json
          eligibility_text?: string[]
          id?: string
          is_demo?: boolean
          last_checked_at?: string | null
          location_or_region?: string | null
          missing_fields?: string[]
          normalized_key?: string | null
          official_application_url?: string | null
          official_source_url?: string | null
          provider?: string | null
          required_documents?: string[]
          source_excerpt?: string | null
          source_last_published_at?: string | null
          title?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_score: number | null
          academic_year: number | null
          annual_family_income: number | null
          country: string | null
          course: string | null
          created_at: string
          education_level: string | null
          field_of_study: string | null
          full_name: string | null
          id: string
          institution: string | null
          interests: string[]
          onboarded: boolean
          preferred_opportunity_types: string[]
          region: string | null
          social_category: string | null
          updated_at: string
        }
        Insert: {
          academic_score?: number | null
          academic_year?: number | null
          annual_family_income?: number | null
          country?: string | null
          course?: string | null
          created_at?: string
          education_level?: string | null
          field_of_study?: string | null
          full_name?: string | null
          id: string
          institution?: string | null
          interests?: string[]
          onboarded?: boolean
          preferred_opportunity_types?: string[]
          region?: string | null
          social_category?: string | null
          updated_at?: string
        }
        Update: {
          academic_score?: number | null
          academic_year?: number | null
          annual_family_income?: number | null
          country?: string | null
          course?: string | null
          created_at?: string
          education_level?: string | null
          field_of_study?: string | null
          full_name?: string | null
          id?: string
          institution?: string | null
          interests?: string[]
          onboarded?: boolean
          preferred_opportunity_types?: string[]
          region?: string | null
          social_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          id: string
          opportunity_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      source_verification_history: {
        Row: {
          checked_at: string
          id: string
          notes: string | null
          observed_deadline: string | null
          opportunity_id: string
          previous_deadline: string | null
          source_url: string | null
          verification_result: string
        }
        Insert: {
          checked_at?: string
          id?: string
          notes?: string | null
          observed_deadline?: string | null
          opportunity_id: string
          previous_deadline?: string | null
          source_url?: string | null
          verification_result: string
        }
        Update: {
          checked_at?: string
          id?: string
          notes?: string | null
          observed_deadline?: string | null
          opportunity_id?: string
          previous_deadline?: string | null
          source_url?: string | null
          verification_result?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_verification_history_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
