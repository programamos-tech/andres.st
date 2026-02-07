'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ProyectoMaestro, ActividadCentralizada } from '@/types/database';
import { MOCK_PROYECTOS } from '@/lib/mock-data';

export interface ProyectoConEstadisticas extends ProyectoMaestro {
  actividad_ultima_hora: number;
  errores_ultima_hora: number;
  usuarios_activos: number;
  ultimo_error?: ActividadCentralizada | null;
  top_modulos: { modulo: string; total_usos: number }[];
  status_visual: 'active' | 'inactive' | 'error';
}

// Verificar si Supabase está configurado
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Crear cliente de Supabase de forma lazy
function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function useProyectos(refreshInterval = 30000) {
  const [proyectos, setProyectos] = useState<ProyectoConEstadisticas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchProyectos = useCallback(async () => {
    // Si no está configurado Supabase, usar datos mock
    if (!isSupabaseConfigured()) {
      setProyectos(MOCK_PROYECTOS);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    
    if (!supabase) {
      setProyectos(MOCK_PROYECTOS);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    try {
      // Obtener todos los proyectos
      const { data: proyectosData, error: proyectosError } = await supabase
        .from('proyectos_maestros')
        .select('*')
        .order('last_activity_at', { ascending: false, nullsFirst: false });

      if (proyectosError) throw proyectosError;

      if (!proyectosData || proyectosData.length === 0) {
        setProyectos([]);
        setLoading(false);
        return;
      }

      // Para cada proyecto, obtener estadísticas
      const proyectosConStats = await Promise.all(
        proyectosData.map(async (proyecto) => {
          const ahora = new Date();
          const hace1Hora = new Date(ahora.getTime() - 60 * 60 * 1000);
          const hace5Min = new Date(ahora.getTime() - 5 * 60 * 1000);

          // Obtener actividad de la última hora
          const { data: actividad } = await supabase
            .from('actividad_centralizada')
            .select('*')
            .eq('proyecto_id', proyecto.id)
            .gte('timestamp', hace1Hora.toISOString())
            .order('timestamp', { ascending: false });

          // Obtener el último error
          const { data: ultimoError } = await supabase
            .from('actividad_centralizada')
            .select('*')
            .eq('proyecto_id', proyecto.id)
            .eq('es_error', true)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

          // Calcular estadísticas
          const actividades = actividad || [];
          const errores = actividades.filter((a: ActividadCentralizada) => a.es_error);
          const usuariosUnicos = new Set(actividades.map((a: ActividadCentralizada) => a.usuario_nombre)).size;

          // Calcular top módulos
          const modulosCount: Record<string, number> = {};
          actividades.forEach((a: ActividadCentralizada) => {
            if (!a.es_error) {
              modulosCount[a.modulo_visitado] = (modulosCount[a.modulo_visitado] || 0) + 1;
            }
          });
          const topModulos = Object.entries(modulosCount)
            .map(([modulo, total_usos]) => ({ modulo, total_usos }))
            .sort((a, b) => b.total_usos - a.total_usos)
            .slice(0, 3);

          // Determinar estado visual
          let status_visual: 'active' | 'inactive' | 'error' = 'inactive';
          
          if (proyecto.last_activity_at) {
            const lastActivity = new Date(proyecto.last_activity_at);
            
            if (lastActivity >= hace5Min) {
              if (actividades.length > 0 && actividades[0].es_error) {
                status_visual = 'error';
              } else {
                status_visual = 'active';
              }
            }
          }

          if (errores.length > 0) {
            const ultimoErrorTime = new Date(errores[0].timestamp);
            if (ultimoErrorTime >= hace5Min) {
              status_visual = 'error';
            }
          }

          return {
            ...proyecto,
            actividad_ultima_hora: actividades.length,
            errores_ultima_hora: errores.length,
            usuarios_activos: usuariosUnicos,
            ultimo_error: ultimoError || null,
            top_modulos: topModulos,
            status_visual
          } as ProyectoConEstadisticas;
        })
      );

      setProyectos(proyectosConStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching proyectos:', err);
      // En caso de error, usar datos mock
      setProyectos(MOCK_PROYECTOS);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let loadingStuck = true;
    const fallbackTimer = setTimeout(() => {
      if (loadingStuck) {
        loadingStuck = false;
        setProyectos(MOCK_PROYECTOS);
        setIsDemo(true);
        setLoading(false);
      }
    }, 12000);

    fetchProyectos().then(() => {
      loadingStuck = false;
    });

    const interval = setInterval(fetchProyectos, refreshInterval);

    const supabase = getSupabaseClient();
    let channel: ReturnType<SupabaseClient['channel']> | null = null;
    
    if (supabase && isSupabaseConfigured()) {
      channel = supabase
        .channel('actividad_changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'actividad_centralizada' },
          () => {
            fetchProyectos();
          }
        )
        .subscribe();
    }

    return () => {
      clearTimeout(fallbackTimer);
      loadingStuck = false;
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchProyectos, refreshInterval]);

  return { proyectos, loading, error, refetch: fetchProyectos, isDemo };
}
