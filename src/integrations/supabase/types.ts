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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          customer_address: string | null
          customer_id: string
          customer_lat: number | null
          customer_lng: number | null
          estimated_price: number
          eta_minutes: number | null
          final_price: number | null
          id: string
          is_emergency: boolean
          notes: string | null
          provider_id: string | null
          service_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          surge_multiplier: number | null
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          customer_address?: string | null
          customer_id: string
          customer_lat?: number | null
          customer_lng?: number | null
          estimated_price?: number
          eta_minutes?: number | null
          final_price?: number | null
          id?: string
          is_emergency?: boolean
          notes?: string | null
          provider_id?: string | null
          service_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          surge_multiplier?: number | null
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          customer_address?: string | null
          customer_id?: string
          customer_lat?: number | null
          customer_lng?: number | null
          estimated_price?: number
          eta_minutes?: number | null
          final_price?: number | null
          id?: string
          is_emergency?: boolean
          notes?: string | null
          provider_id?: string | null
          service_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          surge_multiplier?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      location_logs: {
        Row: {
          booking_id: string | null
          id: string
          lat: number
          lng: number
          provider_id: string
          recorded_at: string
        }
        Insert: {
          booking_id?: string | null
          id?: string
          lat: number
          lng: number
          provider_id: string
          recorded_at?: string
        }
        Update: {
          booking_id?: string | null
          id?: string
          lat?: number
          lng?: number
          provider_id?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_logs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          payment_method: string | null
          payment_status: string
          platform_commission: number
          provider_payout: number
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          platform_commission?: number
          provider_payout?: number
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          platform_commission?: number
          provider_payout?: number
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          created_at: string
          current_lat: number | null
          current_lng: number | null
          experience_years: number | null
          id: string
          is_online: boolean
          kyc_document_url: string | null
          rating: number | null
          service_categories: Database["public"]["Enums"]["service_category"][]
          service_radius_km: number | null
          status: Database["public"]["Enums"]["provider_status"]
          total_jobs: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          experience_years?: number | null
          id?: string
          is_online?: boolean
          kyc_document_url?: string | null
          rating?: number | null
          service_categories?: Database["public"]["Enums"]["service_category"][]
          service_radius_km?: number | null
          status?: Database["public"]["Enums"]["provider_status"]
          total_jobs?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          experience_years?: number | null
          id?: string
          is_online?: boolean
          kyc_document_url?: string | null
          rating?: number | null
          service_categories?: Database["public"]["Enums"]["service_category"][]
          service_radius_km?: number | null
          status?: Database["public"]["Enums"]["provider_status"]
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          provider_id: string
          rating: number
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          provider_id: string
          rating: number
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          provider_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          avg_eta_minutes: number
          base_price: number
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean
          is_emergency: boolean
          name: string
          surge_multiplier: number
        }
        Insert: {
          avg_eta_minutes?: number
          base_price?: number
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          is_emergency?: boolean
          name: string
          surge_multiplier?: number
        }
        Update: {
          avg_eta_minutes?: number
          base_price?: number
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          is_emergency?: boolean
          name?: string
          surge_multiplier?: number
        }
        Relationships: []
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
      app_role: "admin" | "provider" | "customer"
      booking_status:
        | "pending"
        | "accepted"
        | "en_route"
        | "in_progress"
        | "completed"
        | "cancelled"
      provider_status: "pending_kyc" | "approved" | "rejected" | "suspended"
      service_category:
        | "plumbing"
        | "electrical"
        | "cleaning"
        | "painting"
        | "fuel_delivery"
        | "battery_jump"
        | "flat_tire"
        | "urgent_repair"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "provider", "customer"],
      booking_status: [
        "pending",
        "accepted",
        "en_route",
        "in_progress",
        "completed",
        "cancelled",
      ],
      provider_status: ["pending_kyc", "approved", "rejected", "suspended"],
      service_category: [
        "plumbing",
        "electrical",
        "cleaning",
        "painting",
        "fuel_delivery",
        "battery_jump",
        "flat_tire",
        "urgent_repair",
      ],
    },
  },
} as const
