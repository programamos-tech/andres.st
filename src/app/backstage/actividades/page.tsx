'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BackstageGuard } from '@/components/auth/BackstageGuard';

interface Actividad {
  id: string;
  proyecto: string;
  usuario: string;
  modulo: string;
  accion: string;
  es_error: boolean;
  timestamp: string;
}

// Mock data
const MOCK_ACTIVIDADES: Actividad[] = [
  { id: '1', proyecto: 'ZonaT', usuario: 'María García', modulo: 'Ventas', accion: 'Nueva venta #245', es_error: false, timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
  { id: '2', proyecto: 'Aleya', usuario: 'Pedro Ruiz', modulo: 'Facturación', accion: 'Factura #1024 generada', es_error: false, timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: '3', proyecto: 'ZonaT', usuario: 'Carlos López', modulo: 'Inventario', accion: 'Ajuste de stock', es_error: false, timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
  { id: '4', proyecto: 'Aleya', usuario: 'Laura Sánchez', modulo: 'Reportes', accion: 'Error al generar PDF', es_error: true, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: '5', proyecto: 'TechStore', usuario: 'Juan Méndez', modulo: 'Checkout', accion: 'Payment gateway timeout', es_error: true, timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { id: '6', proyecto: 'ZonaT', usuario: 'María García', modulo: 'Ventas', accion: 'Nueva venta #244', es_error: false, timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString() },
  { id: '7', proyecto: 'Aleya', usuario: 'Pedro Ruiz', modulo: 'Contabilidad', accion: 'Asiento contable', es_error: false, timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: '8', proyecto: 'POS Restaurante', usuario: 'Chef Admin', modulo: 'Cocina', accion: 'Pedido #89 completado', es_error: false, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '9', proyecto: 'ZonaT', usuario: 'Ana Pérez', modulo: 'Clientes', accion: 'Cliente registrado', es_error: false, timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
  { id: '10', proyecto: 'GymManager', usuario: 'Admin Gym', modulo: 'Check-in', accion: 'Check-in miembro #234', es_error: false, timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
];

export default function ActividadesPage() {
  const [actividades] = useState<Actividad[]>(MOCK_ACTIVIDADES);
  const [filtro, setFiltro] = useState<'all' | 'errores'>('all');

  const actividadesFiltradas = filtro === 'errores' 
    ? actividades.filter(a => a.es_error) 
    : actividades;

  const erroresCount = actividades.filter(a => a.es_error).length;

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <DashboardHeader 
          totalProyectos={6}
          proyectosActivos={5}
          proyectosConErrores={2}
          onRefresh={() => {}}
          isDemo={true}
        />
        
        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[var(--text)]">Actividades</h1>
            
            {/* Filtros */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltro('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filtro === 'all' 
                    ? 'bg-[var(--text)] text-[var(--bg)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Todas ({actividades.length})
              </button>
              <button
                onClick={() => setFiltro('errores')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filtro === 'errores' 
                    ? 'bg-red-500 text-white' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Errores ({erroresCount})
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {actividadesFiltradas.map((act) => (
              <div 
                key={act.id}
                className={`p-4 rounded-xl bg-[var(--bg)] border transition-colors ${
                  act.es_error 
                    ? 'border-red-500/20' 
                    : 'border-[var(--border)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${act.es_error ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    <div>
                      <p className={`text-sm font-medium ${act.es_error ? 'text-red-500' : 'text-[var(--text)]'}`}>
                        {act.accion}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                        <span className="uppercase font-medium">{act.proyecto}</span>
                        <span>·</span>
                        <span>{act.modulo}</span>
                        <span>·</span>
                        <span>{act.usuario}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true, locale: es })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </BackstageGuard>
  );
}
