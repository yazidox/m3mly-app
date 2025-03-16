export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      factories: {
        Row: {
          capacity: string | null
          certifications: string[] | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          lead_time: string | null
          location: string
          min_order_quantity: number
          name: string
          rating: number | null
          specialties: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          capacity?: string | null
          certifications?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          lead_time?: string | null
          location: string
          min_order_quantity: number
          name: string
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: string | null
          certifications?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          lead_time?: string | null
          location?: string
          min_order_quantity?: number
          name?: string
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          factory_id: string | null
          id: string
          invoice_number: string
          notes: string | null
          order_id: string | null
          payment_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          factory_id?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          factory_id?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          color: string | null
          company: string | null
          created_at: string | null
          email: string
          estimated_delivery: string | null
          factory_id: string | null
          factory_notes: string | null
          full_name: string
          id: string
          material: string | null
          notes: string | null
          payment_status: string | null
          phone: string | null
          product_id: string | null
          quantity: number
          shipping_address: string
          size: string | null
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          estimated_delivery?: string | null
          factory_id?: string | null
          factory_notes?: string | null
          full_name: string
          id?: string
          material?: string | null
          notes?: string | null
          payment_status?: string | null
          phone?: string | null
          product_id?: string | null
          quantity: number
          shipping_address: string
          size?: string | null
          status?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          estimated_delivery?: string | null
          factory_id?: string | null
          factory_notes?: string | null
          full_name?: string
          id?: string
          material?: string | null
          notes?: string | null
          payment_status?: string | null
          phone?: string | null
          product_id?: string | null
          quantity?: number
          shipping_address?: string
          size?: string | null
          status?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string | null
          created_at: string | null
          details: string | null
          id: string
          is_default: boolean | null
          reference: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          is_default?: boolean | null
          reference?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          is_default?: boolean | null
          reference?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          details: string | null
          id: string
          invoice_id: string
          payment_method_id: string | null
          payment_method_type: string
          reference: string | null
          status: string
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          details?: string | null
          id?: string
          invoice_id: string
          payment_method_id?: string | null
          payment_method_type: string
          reference?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          details?: string | null
          id?: string
          invoice_id?: string
          payment_method_id?: string | null
          payment_method_type?: string
          reference?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          factory_id: string | null
          features: string[] | null
          id: string
          image: string | null
          lead_time: number | null
          min_order_quantity: number | null
          name: string
          price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          factory_id?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          lead_time?: number | null
          min_order_quantity?: number | null
          name: string
          price: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          factory_id?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          lead_time?: number | null
          min_order_quantity?: number | null
          name?: string
          price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_requests: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          estimated_delivery: string | null
          factory_id: string | null
          factory_notes: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          product_id: string | null
          quantity: number
          shipping_address: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          estimated_delivery?: string | null
          factory_id?: string | null
          factory_notes?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          product_id?: string | null
          quantity: number
          shipping_address: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          estimated_delivery?: string | null
          factory_id?: string | null
          factory_notes?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          product_id?: string | null
          quantity?: number
          shipping_address?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sample_requests_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          cin: string | null
          created_at: string
          credits: string | null
          email: string | null
          factory_id: string | null
          full_name: string | null
          id: string
          image: string | null
          is_approved: boolean | null
          name: string | null
          phone: string | null
          referral_source: string | null
          role: string | null
          store_name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          cin?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          factory_id?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          is_approved?: boolean | null
          name?: string | null
          phone?: string | null
          referral_source?: string | null
          role?: string | null
          store_name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          cin?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          factory_id?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          is_approved?: boolean | null
          name?: string | null
          phone?: string | null
          referral_source?: string | null
          role?: string | null
          store_name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
