export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      proyectos_maestros: {
        Row: {
          id: string
          nombre_cliente: string
          nombre_proyecto: string
          api_key_unica: string
          url_dominio: string
          status_servidor: 'active' | 'inactive' | 'maintenance' | 'error'
          descripcion: string | null
          logo_url: string | null
          color_marca: string | null
          created_at: string
          updated_at: string
          last_activity_at: string | null
        }
        Insert: {
          id?: string
          nombre_cliente: string
          nombre_proyecto: string
          api_key_unica: string
          url_dominio: string
          status_servidor?: 'active' | 'inactive' | 'maintenance' | 'error'
          descripcion?: string | null
          logo_url?: string | null
          color_marca?: string | null
          created_at?: string
          updated_at?: string
          last_activity_at?: string | null
        }
        Update: {
          id?: string
          nombre_cliente?: string
          nombre_proyecto?: string
          api_key_unica?: string
          url_dominio?: string
          status_servidor?: 'active' | 'inactive' | 'maintenance' | 'error'
          descripcion?: string | null
          logo_url?: string | null
          color_marca?: string | null
          created_at?: string
          updated_at?: string
          last_activity_at?: string | null
        }
      }
      actividad_centralizada: {
        Row: {
          id: string
          proyecto_id: string
          usuario_id: string | null
          usuario_nombre: string
          usuario_email: string | null
          modulo_visitado: string
          accion_realizada: string
          metadata: Json | null
          es_error: boolean
          error_mensaje: string | null
          error_stack: string | null
          ip_address: string | null
          user_agent: string | null
          duracion_ms: number | null
          timestamp: string
        }
        Insert: {
          id?: string
          proyecto_id: string
          usuario_id?: string | null
          usuario_nombre: string
          usuario_email?: string | null
          modulo_visitado: string
          accion_realizada: string
          metadata?: Json | null
          es_error?: boolean
          error_mensaje?: string | null
          error_stack?: string | null
          ip_address?: string | null
          user_agent?: string | null
          duracion_ms?: number | null
          timestamp?: string
        }
        Update: {
          id?: string
          proyecto_id?: string
          usuario_id?: string | null
          usuario_nombre?: string
          usuario_email?: string | null
          modulo_visitado?: string
          accion_realizada?: string
          metadata?: Json | null
          es_error?: boolean
          error_mensaje?: string | null
          error_stack?: string | null
          ip_address?: string | null
          user_agent?: string | null
          duracion_ms?: number | null
          timestamp?: string
        }
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
  }
}

// Helper types
export type ProyectoMaestro = Database['public']['Tables']['proyectos_maestros']['Row']
export type ActividadCentralizada = Database['public']['Tables']['actividad_centralizada']['Row']
export type InsertProyecto = Database['public']['Tables']['proyectos_maestros']['Insert']
export type InsertActividad = Database['public']['Tables']['actividad_centralizada']['Insert']

// Tickets
export type TicketEstado = 'creado' | 'replicando' | 'ajustando' | 'probando' | 'desplegando' | 'resuelto';

export interface Ticket {
  id: string
  numero: number // Número secuencial para mostrar al usuario (#001, #002...)
  proyecto_id: string | null
  proyecto_nombre: string
  modulo: string
  tienda: string
  titulo: string
  descripcion: string
  estado: TicketEstado
  creado_por_nombre: string
  creado_por_email: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export interface TicketComentario {
  id: string
  ticket_id: string
  mensaje: string
  autor_nombre: string
  es_admin: boolean
  created_at: string
}
