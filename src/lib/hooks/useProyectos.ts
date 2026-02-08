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

    if (typeof window === 'undefined') return;

    try {
      // Usar la API de backstage (service role) para que usuarios_activos y actividad_ultima_hora se lean bien
      const res = await fetch('/api/backstage/projects', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch projects');

      const json = await res.json();
      const list = Array.isArray(json.projects) ? json.projects : [];

      setProyectos(list as ProyectoConEstadisticas[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching proyectos:', err);
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
