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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_search_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          query: string
          response: Json
          ticker: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          query: string
          response: Json
          ticker?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          query?: string
          response?: Json
          ticker?: string | null
        }
        Relationships: []
      }
      automation_leads: {
        Row: {
          created_at: string
          email: string
          generated_workflow: Json | null
          id: string
          name: string
          updated_at: string
          workflow_description: string
        }
        Insert: {
          created_at?: string
          email: string
          generated_workflow?: Json | null
          id?: string
          name: string
          updated_at?: string
          workflow_description: string
        }
        Update: {
          created_at?: string
          email?: string
          generated_workflow?: Json | null
          id?: string
          name?: string
          updated_at?: string
          workflow_description?: string
        }
        Relationships: []
      }
      demo_leads: {
        Row: {
          company: string | null
          created_at: string
          demo_type: string
          email: string
          id: string
          name: string
          processed_data: Json | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          demo_type: string
          email: string
          id?: string
          name: string
          processed_data?: Json | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          demo_type?: string
          email?: string
          id?: string
          name?: string
          processed_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_holdings: {
        Row: {
          added_at: string
          avg_buy_price: number | null
          id: string
          portfolio_id: string
          shares: number
          stock_name: string | null
          ticker: string
          updated_at: string
        }
        Insert: {
          added_at?: string
          avg_buy_price?: number | null
          id?: string
          portfolio_id: string
          shares: number
          stock_name?: string | null
          ticker: string
          updated_at?: string
        }
        Update: {
          added_at?: string
          avg_buy_price?: number | null
          id?: string
          portfolio_id?: string
          shares?: number
          stock_name?: string | null
          ticker?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          id: string
          searched_at: string
          sector: string | null
          stock_name: string | null
          ticker: string
          user_id: string
        }
        Insert: {
          id?: string
          searched_at?: string
          sector?: string | null
          stock_name?: string | null
          ticker: string
          user_id: string
        }
        Update: {
          id?: string
          searched_at?: string
          sector?: string | null
          stock_name?: string | null
          ticker?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_monitoring_results: {
        Row: {
          canonical_url: string | null
          created_at: string
          has_h1: boolean | null
          id: string
          issues: Json | null
          last_checked_at: string
          meta_description: string | null
          page_title: string | null
          page_url: string
          status: string
          updated_at: string
          warnings: Json | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          has_h1?: boolean | null
          id?: string
          issues?: Json | null
          last_checked_at?: string
          meta_description?: string | null
          page_title?: string | null
          page_url: string
          status?: string
          updated_at?: string
          warnings?: Json | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          has_h1?: boolean | null
          id?: string
          issues?: Json | null
          last_checked_at?: string
          meta_description?: string | null
          page_title?: string | null
          page_url?: string
          status?: string
          updated_at?: string
          warnings?: Json | null
        }
        Relationships: []
      }
      stg_ghl_contacts: {
        Row: {
          contact_id: string | null
          created: string | null
          days_since_last_purchase: number | null
          email: string | null
          email_norm: string | null
          first_name: string | null
          firstname_norm: string | null
          globalcustomerid: string | null
          globalcustomerid_norm: string | null
          id: number
          last_name: string | null
          last_purchase_date: string | null
          lastname_norm: string | null
          name: string | null
          phone: string | null
          phone_norm: string | null
          tags: string | null
          total_spend: number | null
        }
        Insert: {
          contact_id?: string | null
          created?: string | null
          days_since_last_purchase?: number | null
          email?: string | null
          email_norm?: string | null
          first_name?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number
          last_name?: string | null
          last_purchase_date?: string | null
          lastname_norm?: string | null
          name?: string | null
          phone?: string | null
          phone_norm?: string | null
          tags?: string | null
          total_spend?: number | null
        }
        Update: {
          contact_id?: string | null
          created?: string | null
          days_since_last_purchase?: number | null
          email?: string | null
          email_norm?: string | null
          first_name?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number
          last_name?: string | null
          last_purchase_date?: string | null
          lastname_norm?: string | null
          name?: string | null
          phone?: string | null
          phone_norm?: string | null
          tags?: string | null
          total_spend?: number | null
        }
        Relationships: []
      }
      stg_ghl_contacts_clean: {
        Row: {
          contact_id: string | null
          created: string | null
          days_since_last_purchase: number | null
          email: string | null
          email_norm: string | null
          first_name: string | null
          firstname_norm: string | null
          globalcustomerid: string | null
          globalcustomerid_norm: string | null
          id: number | null
          last_name: string | null
          last_purchase_date: string | null
          lastname_norm: string | null
          name: string | null
          phone: string | null
          phone_norm: string | null
          rn: number | null
          tags: string | null
          total_spend: number | null
        }
        Insert: {
          contact_id?: string | null
          created?: string | null
          days_since_last_purchase?: number | null
          email?: string | null
          email_norm?: string | null
          first_name?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number | null
          last_name?: string | null
          last_purchase_date?: string | null
          lastname_norm?: string | null
          name?: string | null
          phone?: string | null
          phone_norm?: string | null
          rn?: number | null
          tags?: string | null
          total_spend?: number | null
        }
        Update: {
          contact_id?: string | null
          created?: string | null
          days_since_last_purchase?: number | null
          email?: string | null
          email_norm?: string | null
          first_name?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number | null
          last_name?: string | null
          last_purchase_date?: string | null
          lastname_norm?: string | null
          name?: string | null
          phone?: string | null
          phone_norm?: string | null
          rn?: number | null
          tags?: string | null
          total_spend?: number | null
        }
        Relationships: []
      }
      stg_loyalty_contacts: {
        Row: {
          birthday: number | null
          birthmonth: number | null
          email: string | null
          email_norm: string | null
          firstname: string | null
          firstname_norm: string | null
          globalcustomerid: string | null
          globalcustomerid_norm: string | null
          id: number
          joindate: string | null
          lastname: string | null
          lastname_norm: string | null
          phone: string | null
          phone_norm: string | null
          zipcode: string | null
        }
        Insert: {
          birthday?: number | null
          birthmonth?: number | null
          email?: string | null
          email_norm?: string | null
          firstname?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number
          joindate?: string | null
          lastname?: string | null
          lastname_norm?: string | null
          phone?: string | null
          phone_norm?: string | null
          zipcode?: string | null
        }
        Update: {
          birthday?: number | null
          birthmonth?: number | null
          email?: string | null
          email_norm?: string | null
          firstname?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number
          joindate?: string | null
          lastname?: string | null
          lastname_norm?: string | null
          phone?: string | null
          phone_norm?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      stg_loyalty_contacts_clean: {
        Row: {
          birthday: number | null
          birthmonth: number | null
          email: string | null
          email_norm: string | null
          firstname: string | null
          firstname_norm: string | null
          globalcustomerid: string | null
          globalcustomerid_norm: string | null
          id: number | null
          joindate: string | null
          lastname: string | null
          lastname_norm: string | null
          phone: string | null
          phone_norm: string | null
          rn: number | null
          zipcode: string | null
        }
        Insert: {
          birthday?: number | null
          birthmonth?: number | null
          email?: string | null
          email_norm?: string | null
          firstname?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number | null
          joindate?: string | null
          lastname?: string | null
          lastname_norm?: string | null
          phone?: string | null
          phone_norm?: string | null
          rn?: number | null
          zipcode?: string | null
        }
        Update: {
          birthday?: number | null
          birthmonth?: number | null
          email?: string | null
          email_norm?: string | null
          firstname?: string | null
          firstname_norm?: string | null
          globalcustomerid?: string | null
          globalcustomerid_norm?: string | null
          id?: number | null
          joindate?: string | null
          lastname?: string | null
          lastname_norm?: string | null
          phone?: string | null
          phone_norm?: string | null
          rn?: number | null
          zipcode?: string | null
        }
        Relationships: []
      }
      Stocks: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          sector: string | null
          symbol: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          sector?: string | null
          symbol?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          sector?: string | null
          symbol?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          added_at: string
          id: string
          stock_name: string | null
          ticker: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          stock_name?: string | null
          ticker: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          stock_name?: string | null
          ticker?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_contacts_to_create: {
        Row: {
          birthday: number | null
          birthmonth: number | null
          email: string | null
          email_norm: string | null
          firstname: string | null
          firstname_norm: string | null
          globalcustomerid: string | null
          globalcustomerid_norm: string | null
          id: number | null
          joindate: string | null
          lastname: string | null
          lastname_norm: string | null
          phone: string | null
          phone_norm: string | null
          rn: number | null
          zipcode: string | null
        }
        Relationships: []
      }
      v_contacts_to_update: {
        Row: {
          birthday: number | null
          birthmonth: number | null
          email: string | null
          email_norm: string | null
          firstname: string | null
          firstname_norm: string | null
          ghl_contact_id: string | null
          globalcustomerid: string | null
          globalcustomerid_norm: string | null
          id: number | null
          joindate: string | null
          lastname: string | null
          lastname_norm: string | null
          match_method: string | null
          phone: string | null
          phone_norm: string | null
          rn: number | null
          zipcode: string | null
        }
        Relationships: []
      }
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
      app_role: "user" | "premium" | "admin"
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
      app_role: ["user", "premium", "admin"],
    },
  },
} as const
