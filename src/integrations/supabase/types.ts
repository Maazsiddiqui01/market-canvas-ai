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
      agent_learnings: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          evidence: Json | null
          id: string
          lesson: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          evidence?: Json | null
          id?: string
          lesson: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          evidence?: Json | null
          id?: string
          lesson?: string
        }
        Relationships: []
      }
      agent_recommendations: {
        Row: {
          company: string | null
          conviction: number | null
          created_at: string
          current_price: number | null
          data_confidence: string | null
          entry_high: number | null
          entry_low: number | null
          horizon: string | null
          id: string
          market: string | null
          outcome: Json | null
          review_date: string | null
          risks: Json | null
          run_id: string | null
          sector: string | null
          sharia_checked_at: string | null
          sharia_source: string | null
          sharia_status: string | null
          signal: string
          sources: Json | null
          status: string
          stop_loss: number | null
          strategy: string | null
          suggested_pkr: number | null
          suggested_shares: number | null
          target_basis: string | null
          target_price: number | null
          target_weight_pct: number | null
          thesis: string | null
          ticker: string
        }
        Insert: {
          company?: string | null
          conviction?: number | null
          created_at?: string
          current_price?: number | null
          data_confidence?: string | null
          entry_high?: number | null
          entry_low?: number | null
          horizon?: string | null
          id?: string
          market?: string | null
          outcome?: Json | null
          review_date?: string | null
          risks?: Json | null
          run_id?: string | null
          sector?: string | null
          sharia_checked_at?: string | null
          sharia_source?: string | null
          sharia_status?: string | null
          signal: string
          sources?: Json | null
          status?: string
          stop_loss?: number | null
          strategy?: string | null
          suggested_pkr?: number | null
          suggested_shares?: number | null
          target_basis?: string | null
          target_price?: number | null
          target_weight_pct?: number | null
          thesis?: string | null
          ticker: string
        }
        Update: {
          company?: string | null
          conviction?: number | null
          created_at?: string
          current_price?: number | null
          data_confidence?: string | null
          entry_high?: number | null
          entry_low?: number | null
          horizon?: string | null
          id?: string
          market?: string | null
          outcome?: Json | null
          review_date?: string | null
          risks?: Json | null
          run_id?: string | null
          sector?: string | null
          sharia_checked_at?: string | null
          sharia_source?: string | null
          sharia_status?: string | null
          signal?: string
          sources?: Json | null
          status?: string
          stop_loss?: number | null
          strategy?: string | null
          suggested_pkr?: number | null
          suggested_shares?: number | null
          target_basis?: string | null
          target_price?: number | null
          target_weight_pct?: number | null
          thesis?: string | null
          ticker?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_recommendations_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          action_taken: boolean | null
          digest_html: string | null
          error: string | null
          finished_at: string | null
          hold_cash_reason: string | null
          id: string
          macro_tilt: number | null
          market: string | null
          market_summary: string | null
          num_recs: number | null
          run_type: string
          started_at: string
          status: string | null
          tokens_used: number | null
        }
        Insert: {
          action_taken?: boolean | null
          digest_html?: string | null
          error?: string | null
          finished_at?: string | null
          hold_cash_reason?: string | null
          id?: string
          macro_tilt?: number | null
          market?: string | null
          market_summary?: string | null
          num_recs?: number | null
          run_type: string
          started_at?: string
          status?: string | null
          tokens_used?: number | null
        }
        Update: {
          action_taken?: boolean | null
          digest_html?: string | null
          error?: string | null
          finished_at?: string | null
          hold_cash_reason?: string | null
          id?: string
          macro_tilt?: number | null
          market?: string | null
          market_summary?: string | null
          num_recs?: number | null
          run_type?: string
          started_at?: string
          status?: string | null
          tokens_used?: number | null
        }
        Relationships: []
      }
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
      analyst_playbook: {
        Row: {
          id: string
          principles: string
          scope: string | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          principles: string
          scope?: string | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          principles?: string
          scope?: string | null
          topic?: string
          updated_at?: string | null
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
      brain_daily_cards: {
        Row: {
          consumed: boolean
          conviction: number | null
          created_at: string
          data_confidence: string | null
          horizon: string | null
          id: number
          market: string
          opportunity: string | null
          raw: Json | null
          regime_label: string | null
          risks: Json | null
          run_date: string
          sharia_status: string | null
          signal: string | null
          stop_loss: number | null
          strategy: string | null
          target_basis: string | null
          target_price: number | null
          thesis: string | null
          ticker: string
        }
        Insert: {
          consumed?: boolean
          conviction?: number | null
          created_at?: string
          data_confidence?: string | null
          horizon?: string | null
          id?: never
          market: string
          opportunity?: string | null
          raw?: Json | null
          regime_label?: string | null
          risks?: Json | null
          run_date: string
          sharia_status?: string | null
          signal?: string | null
          stop_loss?: number | null
          strategy?: string | null
          target_basis?: string | null
          target_price?: number | null
          thesis?: string | null
          ticker: string
        }
        Update: {
          consumed?: boolean
          conviction?: number | null
          created_at?: string
          data_confidence?: string | null
          horizon?: string | null
          id?: never
          market?: string
          opportunity?: string | null
          raw?: Json | null
          regime_label?: string | null
          risks?: Json | null
          run_date?: string
          sharia_status?: string | null
          signal?: string | null
          stop_loss?: number | null
          strategy?: string | null
          target_basis?: string | null
          target_price?: number | null
          thesis?: string | null
          ticker?: string
        }
        Relationships: []
      }
      broker_targets: {
        Row: {
          broker: string
          id: string
          market: string
          rating: string | null
          report_date: string | null
          source_url: string | null
          target_price: number | null
          thesis: string | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          broker: string
          id?: string
          market: string
          rating?: string | null
          report_date?: string | null
          source_url?: string | null
          target_price?: number | null
          thesis?: string | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          broker?: string
          id?: string
          market?: string
          rating?: string | null
          report_date?: string | null
          source_url?: string | null
          target_price?: number | null
          thesis?: string | null
          ticker?: string
          updated_at?: string | null
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
      demo_voice_accounts: {
        Row: {
          account_number: string
          balance_due_usd: number
          created_at: string
          full_name: string
          id: string
          monthly_fee_usd: number
          notes: string | null
          outage_area: boolean
          plan: string
          status: string
        }
        Insert: {
          account_number: string
          balance_due_usd?: number
          created_at?: string
          full_name: string
          id?: string
          monthly_fee_usd: number
          notes?: string | null
          outage_area?: boolean
          plan: string
          status?: string
        }
        Update: {
          account_number?: string
          balance_due_usd?: number
          created_at?: string
          full_name?: string
          id?: string
          monthly_fee_usd?: number
          notes?: string | null
          outage_area?: boolean
          plan?: string
          status?: string
        }
        Relationships: []
      }
      demo_voice_appointments: {
        Row: {
          call_id: string | null
          confirmation_code: string
          created_at: string
          customer_name: string | null
          id: string
          service: string | null
          slot_start: string
          status: string
        }
        Insert: {
          call_id?: string | null
          confirmation_code?: string
          created_at?: string
          customer_name?: string | null
          id?: string
          service?: string | null
          slot_start: string
          status?: string
        }
        Update: {
          call_id?: string | null
          confirmation_code?: string
          created_at?: string
          customer_name?: string | null
          id?: string
          service?: string | null
          slot_start?: string
          status?: string
        }
        Relationships: []
      }
      demo_voice_calls: {
        Row: {
          agent_key: string | null
          call_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          sentiment: string | null
          successful: boolean | null
          summary: string | null
        }
        Insert: {
          agent_key?: string | null
          call_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          sentiment?: string | null
          successful?: boolean | null
          summary?: string | null
        }
        Update: {
          agent_key?: string | null
          call_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          sentiment?: string | null
          successful?: boolean | null
          summary?: string | null
        }
        Relationships: []
      }
      demo_voice_slots: {
        Row: {
          id: string
          is_booked: boolean
          slot_end: string
          slot_start: string
        }
        Insert: {
          id?: string
          is_booked?: boolean
          slot_end: string
          slot_start: string
        }
        Update: {
          id?: string
          is_booked?: boolean
          slot_end?: string
          slot_start?: string
        }
        Relationships: []
      }
      demo_voice_tickets: {
        Row: {
          account_number: string | null
          call_id: string | null
          category: string
          created_at: string
          id: string
          priority: string
          status: string
          summary: string | null
          ticket_number: string
        }
        Insert: {
          account_number?: string | null
          call_id?: string | null
          category?: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          summary?: string | null
          ticket_number?: string
        }
        Update: {
          account_number?: string | null
          call_id?: string | null
          category?: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          summary?: string | null
          ticket_number?: string
        }
        Relationships: []
      }
      digest_log: {
        Row: {
          body_preview: string | null
          channel: string
          delivered: boolean | null
          error: string | null
          id: string
          recipient: string | null
          run_id: string | null
          sent_at: string
          subject: string | null
        }
        Insert: {
          body_preview?: string | null
          channel: string
          delivered?: boolean | null
          error?: string | null
          id?: string
          recipient?: string | null
          run_id?: string | null
          sent_at?: string
          subject?: string | null
        }
        Update: {
          body_preview?: string | null
          channel?: string
          delivered?: boolean | null
          error?: string | null
          id?: string
          recipient?: string | null
          run_id?: string | null
          sent_at?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digest_log_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      listenup_books: {
        Row: {
          audio: string | null
          author: string | null
          batch: number | null
          blurb: string | null
          created_at: string | null
          duration: string | null
          genre: string | null
          slug: string
          sort: number | null
          status: string
          title: string
          voice: string | null
        }
        Insert: {
          audio?: string | null
          author?: string | null
          batch?: number | null
          blurb?: string | null
          created_at?: string | null
          duration?: string | null
          genre?: string | null
          slug: string
          sort?: number | null
          status?: string
          title: string
          voice?: string | null
        }
        Update: {
          audio?: string | null
          author?: string | null
          batch?: number | null
          blurb?: string | null
          created_at?: string | null
          duration?: string | null
          genre?: string | null
          slug?: string
          sort?: number | null
          status?: string
          title?: string
          voice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listenup_books_genre_fkey"
            columns: ["genre"]
            isOneToOne: false
            referencedRelation: "listenup_genres"
            referencedColumns: ["name"]
          },
        ]
      }
      listenup_genres: {
        Row: {
          color: string
          name: string
          soft: string | null
          sort: number | null
        }
        Insert: {
          color: string
          name: string
          soft?: string | null
          sort?: number | null
        }
        Update: {
          color?: string
          name?: string
          soft?: string | null
          sort?: number | null
        }
        Relationships: []
      }
      listenup_progress: {
        Row: {
          done: boolean | null
          dur: number | null
          slug: string
          t: number | null
          updated_at: string | null
          user_key: string
        }
        Insert: {
          done?: boolean | null
          dur?: number | null
          slug: string
          t?: number | null
          updated_at?: string | null
          user_key?: string
        }
        Update: {
          done?: boolean | null
          dur?: number | null
          slug?: string
          t?: number | null
          updated_at?: string | null
          user_key?: string
        }
        Relationships: []
      }
      material_events: {
        Row: {
          catalyst_type: string | null
          created_at: string | null
          dedup_key: string | null
          direction: string | null
          event_date: string | null
          headline: string
          id: string
          magnitude: string | null
          market: string
          rationale: string | null
          source_url: string | null
          ticker: string
        }
        Insert: {
          catalyst_type?: string | null
          created_at?: string | null
          dedup_key?: string | null
          direction?: string | null
          event_date?: string | null
          headline: string
          id?: string
          magnitude?: string | null
          market: string
          rationale?: string | null
          source_url?: string | null
          ticker: string
        }
        Update: {
          catalyst_type?: string | null
          created_at?: string | null
          dedup_key?: string | null
          direction?: string | null
          event_date?: string | null
          headline?: string
          id?: string
          magnitude?: string | null
          market?: string
          rationale?: string | null
          source_url?: string | null
          ticker?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          source: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          source?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_url: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_url: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_url?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      paper_book: {
        Row: {
          cash: number
          closed: Json
          market: string
          positions: Json
          realized_pnl: number
          started_at: string
          starting_capital: number
          updated_at: string
        }
        Insert: {
          cash: number
          closed?: Json
          market: string
          positions?: Json
          realized_pnl?: number
          started_at?: string
          starting_capital: number
          updated_at?: string
        }
        Update: {
          cash?: number
          closed?: Json
          market?: string
          positions?: Json
          realized_pnl?: number
          started_at?: string
          starting_capital?: number
          updated_at?: string
        }
        Relationships: []
      }
      paper_trades: {
        Row: {
          id: string
          market: string
          price: number
          realized_pnl: number | null
          reason: string | null
          rec_id: string | null
          shares: number
          side: string
          ticker: string
          ts: string
        }
        Insert: {
          id?: string
          market: string
          price: number
          realized_pnl?: number | null
          reason?: string | null
          rec_id?: string | null
          shares: number
          side: string
          ticker: string
          ts?: string
        }
        Update: {
          id?: string
          market?: string
          price?: number
          realized_pnl?: number | null
          reason?: string | null
          rec_id?: string | null
          shares?: number
          side?: string
          ticker?: string
          ts?: string
        }
        Relationships: []
      }
      pending_actions: {
        Row: {
          created_at: string
          decided_at: string | null
          id: string
          limit_price: number | null
          market: string
          note: string | null
          portfolio_id: string | null
          qty: number | null
          rec_id: string | null
          side: string
          status: string
          stop_loss: number | null
          target_price: number | null
          ticker: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          id?: string
          limit_price?: number | null
          market: string
          note?: string | null
          portfolio_id?: string | null
          qty?: number | null
          rec_id?: string | null
          side: string
          status?: string
          stop_loss?: number | null
          target_price?: number | null
          ticker: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          id?: string
          limit_price?: number | null
          market?: string
          note?: string | null
          portfolio_id?: string | null
          qty?: number | null
          rec_id?: string | null
          side?: string
          status?: string
          stop_loss?: number | null
          target_price?: number | null
          ticker?: string
        }
        Relationships: []
      }
      portfolio_history: {
        Row: {
          created_at: string
          holdings_snapshot: Json
          id: string
          pnl_percentage: number
          portfolio_id: string
          snapshot_date: string
          total_cost: number
          total_pnl: number
          total_value: number
        }
        Insert: {
          created_at?: string
          holdings_snapshot?: Json
          id?: string
          pnl_percentage: number
          portfolio_id: string
          snapshot_date: string
          total_cost: number
          total_pnl: number
          total_value: number
        }
        Update: {
          created_at?: string
          holdings_snapshot?: Json
          id?: string
          pnl_percentage?: number
          portfolio_id?: string
          snapshot_date?: string
          total_cost?: number
          total_pnl?: number
          total_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_history_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
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
      portfolio_positions: {
        Row: {
          buy_date: string | null
          buy_price: number
          created_at: string
          holding_id: string
          id: string
          notes: string | null
          shares: number
        }
        Insert: {
          buy_date?: string | null
          buy_price: number
          created_at?: string
          holding_id: string
          id?: string
          notes?: string | null
          shares: number
        }
        Update: {
          buy_date?: string | null
          buy_price?: number
          created_at?: string
          holding_id?: string
          id?: string
          notes?: string | null
          shares?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_positions_holding_id_fkey"
            columns: ["holding_id"]
            isOneToOne: false
            referencedRelation: "portfolio_holdings"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          id: string
          market: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          market?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          market?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_triggered: boolean
          n8n_notified: boolean
          stock_name: string | null
          target_price: number
          ticker: string
          triggered_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_triggered?: boolean
          n8n_notified?: boolean
          stock_name?: string | null
          target_price: number
          ticker: string
          triggered_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_triggered?: boolean
          n8n_notified?: boolean
          stock_name?: string | null
          target_price?: number
          ticker?: string
          triggered_at?: string | null
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
      stock_knowledge: {
        Row: {
          data: Json | null
          id: string
          market: string
          sources: Json | null
          summary: string | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          data?: Json | null
          id?: string
          market: string
          sources?: Json | null
          summary?: string | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          data?: Json | null
          id?: string
          market?: string
          sources?: Json | null
          summary?: string | null
          ticker?: string
          updated_at?: string | null
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
      testimonials: {
        Row: {
          approved: boolean
          category: string
          company: string | null
          created_at: string
          featured: boolean
          id: string
          name: string
          permission: boolean
          project: string | null
          quote: string
          rating: number
          title: string | null
        }
        Insert: {
          approved?: boolean
          category?: string
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          name: string
          permission?: boolean
          project?: string | null
          quote: string
          rating?: number
          title?: string | null
        }
        Update: {
          approved?: boolean
          category?: string
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          name?: string
          permission?: boolean
          project?: string | null
          quote?: string
          rating?: number
          title?: string | null
        }
        Relationships: []
      }
      tool_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string
          source_details: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source: string
          source_details?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string
          source_details?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      us_stocks: {
        Row: {
          created_at: string
          id: string
          name: string | null
          sector: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          sector?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          sector?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          description: string | null
          id: string
          ticker: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          ticker?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          ticker?: string | null
          user_id?: string
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
      public_recommendations: {
        Row: {
          company: string | null
          conviction: number | null
          created_at: string | null
          current_price: number | null
          data_confidence: string | null
          horizon: string | null
          id: string | null
          market: string | null
          sector: string | null
          sharia_status: string | null
          signal: string | null
          stop_loss: number | null
          strategy: string | null
          target_basis: string | null
          target_price: number | null
          thesis: string | null
          ticker: string | null
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
      voice_demo_reset: { Args: never; Returns: undefined }
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
