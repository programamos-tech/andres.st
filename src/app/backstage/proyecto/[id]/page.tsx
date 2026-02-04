'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

interface ProjectForBackstage {
  id: string;
  nombre_cliente: string;
  nombre_proyecto: string;
  url_dominio: string;
  logo_url: string | null;
  main_store_external_id: string | null;
  status_servidor: string;
  last_activity_at: string | null;
  owner_name: string | null;
  owner_email: string | null;
  client_api_url: string | null;
  client_api_configured: boolean;
}

const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconExternal = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconSpinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const IconApiOk = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconApiDown = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function activityLabel(action: string, module: string, details: Record<string, unknown>): string {
  const desc = details?.description;
  if (typeof desc === 'string' && desc.trim()) return desc;
  const actionLower = action.toLowerCase();
  const moduleLower = module.toLowerCase();
  if (actionLower === 'login' && (moduleLower === 'auth' || moduleLower === 'login')) return 'Inició sesión';
  if (actionLower === 'sale_create' || actionLower === 'sale_create_draft') return 'Registró una venta';
  if (actionLower === 'sale_cancel') return 'Anuló una venta';
  if (actionLower === 'sale_finalize') return 'Finalizó una venta (borrador)';
  if (actionLower === 'product_create') return 'Creó un producto';
  if (actionLower === 'product_edit') return 'Editó un producto';
  if (actionLower === 'product_delete') return 'Eliminó un producto';
  if (actionLower === 'client_create') return 'Creó un cliente';
  if (actionLower === 'client_edit') return 'Editó un cliente';
  if (actionLower === 'client_delete') return 'Eliminó un cliente';
  if (actionLower.includes('transfer')) return 'Realizó una transferencia de stock';
  if (actionLower.includes('category')) return moduleLower.includes('create') ? 'Creó una categoría' : moduleLower.includes('edit') ? 'Editó una categoría' : 'Eliminó una categoría';
  if (actionLower.includes('payment') || actionLower.includes('pago')) return 'Registró un pago';
  if (actionLower.includes('credit') || actionLower.includes('credito')) return 'Trabajó con un crédito';
  if (actionLower.includes('warranty') || actionLower.includes('garantia')) return 'Registró una garantía';
  return `${action} · ${module}`;
}

export default function ProyectoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const proyectoId = params.id as string;
  const [project, setProject] = useState<ProjectForBackstage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [clientApiUrl, setClientApiUrl] = useState('');
  const [clientApiKey, setClientApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const [stores, setStores] = useState<{ id: string; external_id: string; name: string | null; logo_url: string | null }[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string; name: string | null; store_id: string | null; store_name: string | null; is_owner: boolean }[]>([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [activities, setActivities] = useState<{ id: string; user_id: string | null; user_name: string | null; action: string; module: string; details: Record<string, unknown>; store_id: string | null; created_at: string }[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  type ClientTab = 'proyectos' | 'config' | 'sync' | 'facturas' | 'soporte';
  const [clientTab, setClientTab] = useState<ClientTab>('proyectos');
  const [configNombreCliente, setConfigNombreCliente] = useState('');
  const [configNombreProyecto, setConfigNombreProyecto] = useState('');
  const [configSaveStatus, setConfigSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [liveHealth, setLiveHealth] = useState<{ status: 'active' | 'inactive'; latency_ms?: number | null } | null>(null);
  const [liveHealthLoading, setLiveHealthLoading] = useState(false);
  const [healthHistory, setHealthHistory] = useState<{ id: string; checked_at: string; status: string; latency_ms: number | null }[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'error'>('idle');

  const fetchProject = useCallback(async () => {
    if (!proyectoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/backstage/projects/${proyectoId}`);
      if (!res.ok) {
        if (res.status === 404) setError('Project not found');
        else setError('Failed to load project');
        setProject(null);
        return;
      }
      const data: ProjectForBackstage = await res.json();
      setProject(data);
      setClientApiUrl(data.client_api_url ?? '');
    } catch {
      setError('Failed to load project');
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [proyectoId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project) {
      setConfigNombreCliente(project.nombre_cliente ?? '');
      setConfigNombreProyecto(project.nombre_proyecto ?? '');
    }
  }, [project?.id, project?.nombre_cliente, project?.nombre_proyecto]);

  useEffect(() => {
    if (!proyectoId) return;
    setStoresLoading(true);
    setUsersLoading(true);
    Promise.all([
      fetch(`/api/backstage/projects/${proyectoId}/stores`).then((r) => r.json()).then((d) => (Array.isArray(d) ? d : [])).catch(() => []),
      fetch(`/api/backstage/projects/${proyectoId}/users`).then((r) => r.json()).then((d) => (Array.isArray(d) ? d : [])).catch(() => []),
    ]).then(([storesData, usersData]) => {
      setStores(storesData);
      setUsers(usersData);
    }).finally(() => {
      setStoresLoading(false);
      setUsersLoading(false);
    });
  }, [proyectoId]);

  const fetchActivities = useCallback(() => {
    if (!proyectoId || !selectedStoreId) return;
    setActivitiesLoading(true);
    fetch(`/api/backstage/projects/${proyectoId}/activities?store_id=${encodeURIComponent(selectedStoreId)}&limit=80`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? d : []))
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false));
  }, [proyectoId, selectedStoreId]);

  const fetchLiveHealth = useCallback(() => {
    if (!proyectoId || !selectedStoreId || !project?.client_api_url) return;
    setLiveHealthLoading(true);
    setLiveHealth(null);
    fetch(`/api/backstage/projects/${proyectoId}/health`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok && (d.status === 'active' || d.status === 'inactive')) {
          setLiveHealth({ status: d.status, latency_ms: d.latency_ms ?? null });
        } else {
          setLiveHealth({ status: 'inactive', latency_ms: null });
        }
      })
      .catch(() => setLiveHealth({ status: 'inactive', latency_ms: null }))
      .finally(() => setLiveHealthLoading(false));
  }, [proyectoId, selectedStoreId, project?.client_api_url]);

  const fetchHealthHistory = useCallback(() => {
    if (!proyectoId || !selectedStoreId) return;
    fetch(`/api/backstage/projects/${proyectoId}/health/history?limit=15`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? d : []))
      .then(setHealthHistory)
      .catch(() => setHealthHistory([]));
  }, [proyectoId, selectedStoreId]);

  useEffect(() => {
    if (!proyectoId || !selectedStoreId) return;
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (!proyectoId || !selectedStoreId || !project?.client_api_url) return;
    fetchLiveHealth();
  }, [fetchLiveHealth]);

  useEffect(() => {
    if (!proyectoId || !selectedStoreId) return;
    fetchHealthHistory();
  }, [fetchHealthHistory, liveHealth]);

  const handleSaveConfig = async () => {
    if (!proyectoId) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/backstage/projects/${proyectoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_api_url: clientApiUrl.trim() || null,
          client_api_key: clientApiKey || '',
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to save');
      }
      setSaveStatus('saved');
      setClientApiKey('');
      await fetchProject();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSync = async () => {
    if (!proyectoId) return;
    setSyncStatus('syncing');
    setSyncMessage('');
    const body: { project_id: string; client_api_url?: string; client_api_key?: string } = { project_id: proyectoId };
    if (clientApiUrl.trim()) body.client_api_url = clientApiUrl.trim();
    if (clientApiKey) body.client_api_key = clientApiKey;
    try {
      const res = await fetch('/api/store/sync-client-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSyncMessage(data.error ?? 'Sync failed');
        setSyncStatus('error');
        return;
      }
      setSyncMessage(`Synced ${data.users_synced ?? 0} users, ${data.stores_synced ?? 0} stores. Owner ${data.owner_set ? 'set' : 'not set'}.`);
      setSyncStatus('success');
      fetchProject();
      const [sRes, uRes] = await Promise.all([
        fetch(`/api/backstage/projects/${proyectoId}/stores`),
        fetch(`/api/backstage/projects/${proyectoId}/users`),
      ]);
      const sData = await sRes.json().catch(() => []);
      const uData = await uRes.json().catch(() => []);
      setStores(Array.isArray(sData) ? sData : []);
      setUsers(Array.isArray(uData) ? uData : []);
    } catch {
      setSyncMessage('Sync failed');
      setSyncStatus('error');
    }
  };

  const handleSaveConfigNames = async () => {
    if (!proyectoId) return;
    setConfigSaveStatus('saving');
    try {
      const res = await fetch(`/api/backstage/projects/${proyectoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: configNombreCliente.trim() || null,
          nombre_proyecto: configNombreProyecto.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to save');
      }
      setConfigSaveStatus('saved');
      await fetchProject();
      setTimeout(() => setConfigSaveStatus('idle'), 2000);
    } catch {
      setConfigSaveStatus('error');
      setTimeout(() => setConfigSaveStatus('idle'), 3000);
    }
  };

  const handleDeleteProject = async () => {
    if (!proyectoId) return;
    setDeleteStatus('deleting');
    try {
      const res = await fetch(`/api/backstage/projects/${proyectoId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to delete');
      }
      router.push('/backstage');
      return;
    } catch {
      setDeleteStatus('error');
      setTimeout(() => setDeleteStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <BackstageGuard>
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
          <div className="text-[var(--text-muted)]">Loading...</div>
        </div>
      </BackstageGuard>
    );
  }

  if (error || !project) {
    return (
      <BackstageGuard>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)]">
          <h1 className="text-xl font-semibold text-[var(--text)] mb-2">{error ?? 'Project not found'}</h1>
          <Link href="/backstage" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back to Backstage
          </Link>
        </div>
      </BackstageGuard>
    );
  }

  const statusColor = project.status_servidor === 'active' ? 'bg-[var(--status-ok)]' : 'bg-[var(--text-muted)]';
  const baseUrl = (project.client_api_url || project.url_dominio || '').replace(/\/$/, '');
  const resolveLogoUrl = (raw: string | null | undefined): string | null => {
    if (!raw || typeof raw !== 'string') return null;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (!baseUrl) return raw;
    return `${baseUrl}${raw.startsWith('/') ? '' : '/'}${raw}`;
  };
  const mainStoreExternalId = project.main_store_external_id?.trim() || null;
  const mainStore =
    (mainStoreExternalId ? stores.find((s) => s.external_id === mainStoreExternalId) : null) ??
    (() => {
      const owner = users.find((u) => u.is_owner);
      return owner?.store_id ? stores.find((s) => s.external_id === owner.store_id) : null;
    })() ??
    stores[0] ??
    null;
  const rawHeaderLogo = (mainStore?.logo_url ?? project.logo_url) || null;
  const headerLogoUrl = rawHeaderLogo ? resolveLogoUrl(rawHeaderLogo) : null;

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <DashboardHeader showStats={false} onRefresh={fetchProject} contained />

          <main className="py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              {headerLogoUrl ? (
                <img src={headerLogoUrl} alt={project.nombre_proyecto} className="w-14 h-14 rounded-full object-cover object-center bg-[var(--bg-secondary)] border border-[var(--border)]" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-xl font-semibold">
                  {project.nombre_proyecto.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[var(--text)]">{project.nombre_proyecto}</h1>
                  <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
                </div>
                <p className="text-[var(--text-muted)]">{project.nombre_cliente}</p>
              </div>
            </div>
            <a
              href={project.url_dominio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors"
            >
              <span>Visit</span>
              <IconExternal />
            </a>
          </div>

          {/* Submenu cliente: Resumen, Configuración, Sync, Facturas, Soporte */}
          <nav className="flex items-center gap-1 mb-6 border-b border-[var(--border)]">
            {(
              [
                { id: 'proyectos' as ClientTab, label: 'Resumen' },
                { id: 'config' as ClientTab, label: 'Configuración' },
                { id: 'sync' as ClientTab, label: 'Sync' },
                { id: 'facturas' as ClientTab, label: 'Facturas' },
                { id: 'soporte' as ClientTab, label: 'Soporte' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setClientTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                  clientTab === tab.id
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Contenido según pestaña */}
          {clientTab === 'proyectos' && (
            <>
              {/* When configured: Microtiendas como avatares redondos + detalle por tienda (usuarios + actividades) */}
              {project.client_api_configured && (
            <>
              {/* Microtiendas: avatares redondos clicables */}
              <section className="mb-8">
                <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Microtiendas</h2>
                {storesLoading ? (
                  <p className="text-sm text-[var(--text-muted)]">Cargando...</p>
                ) : stores.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">Sin tiendas. Ejecuta Sync para traer las microtiendas del cliente.</p>
                ) : (
                  <div className="flex flex-wrap gap-8">
                    {stores.map((s) => {
                      const isSelected = selectedStoreId === s.external_id;
                      const storeName = s.name ?? s.external_id;
                      const storeLogoUrl = resolveLogoUrl(s.logo_url || project.logo_url);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedStoreId(isSelected ? null : s.external_id)}
                          className={`flex flex-col items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] rounded-2xl p-2 ${isSelected ? 'bg-[var(--bg)] ring-1 ring-[var(--accent)]/50' : 'hover:bg-[var(--bg)]/50 rounded-2xl'}`}
                        >
                          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[var(--bg-secondary)] border border-[var(--border)] shadow-inner">
                            {storeLogoUrl ? (
                              <img src={storeLogoUrl} alt={storeName} className="w-full h-full object-cover object-center" />
                            ) : (
                              <span className="text-xl font-semibold text-[var(--text-muted)]">{(storeName).charAt(0)}</span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-[var(--text)] text-center max-w-[160px] leading-tight break-words" title={storeName}>{storeName}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Detalle de microtienda seleccionada: Usuarios + Actividades */}
              {selectedStoreId && (
                <div className="mb-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {(() => {
                    const selectedStore = stores.find((s) => s.external_id === selectedStoreId);
                    const statusConfig: Record<string, { label: string; desc: string; color: string; bg: string }> = {
                      active: { label: 'Sistema arriba', desc: 'El sistema del cliente responde correctamente.', color: 'text-[var(--status-ok)]', bg: 'bg-[var(--status-ok)]' },
                      inactive: { label: 'Sistema caído', desc: 'El sistema no responde o está inactivo.', color: 'text-[var(--status-error)]', bg: 'bg-[var(--status-error)]' },
                      maintenance: { label: 'En mantenimiento', desc: 'El sistema está en mantenimiento programado.', color: 'text-amber-500', bg: 'bg-amber-500' },
                      error: { label: 'Error', desc: 'Se detectó un error en el sistema.', color: 'text-[var(--status-error)]', bg: 'bg-[var(--status-error)]' },
                    };
                    const effectiveStatus = liveHealth ? liveHealth.status : project.status_servidor;
                    const status = statusConfig[effectiveStatus] ?? { label: effectiveStatus || 'Desconocido', desc: 'Estado del servidor del cliente.', color: 'text-[var(--text-muted)]', bg: 'bg-[var(--text-muted)]' };
                    return (
                      <>
                        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
                          <div className="flex items-center justify-between gap-2 p-4 border-b border-[var(--border)]">
                            <h2 className="text-sm font-medium text-[var(--text-muted)]">
                              Estado · {selectedStore?.name ?? selectedStoreId}
                            </h2>
                            <button
                              type="button"
                              onClick={() => { fetchLiveHealth(); fetchHealthHistory(); }}
                              disabled={liveHealthLoading}
                              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors disabled:opacity-50"
                              title="Actualizar estado"
                            >
                              {liveHealthLoading ? <IconSpinner /> : <IconRefresh />}
                            </button>
                          </div>
                          <div className="p-4 space-y-4">
                            {liveHealthLoading ? (
                              <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                                <IconSpinner />
                                <p className="text-sm text-[var(--text-muted)]">Comprobando...</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                                {effectiveStatus === 'active' ? (
                                  <span className="text-[var(--status-ok)] shrink-0" aria-hidden>
                                    <IconApiOk />
                                  </span>
                                ) : (
                                  <span className={`text-[var(--status-error)] shrink-0`} aria-hidden>
                                    <IconApiDown />
                                  </span>
                                )}
                                <div>
                                  <p className={`text-sm font-medium ${effectiveStatus === 'active' ? 'text-[var(--status-ok)]' : status.color}`}>
                                    {status.label}
                                  </p>
                                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                                    {status.desc}
                                    {liveHealth?.latency_ms != null && liveHealth.status === 'active' && (
                                      <span className="ml-1">· Respuesta en {liveHealth.latency_ms} ms</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            )}
                            {project.client_api_url && (
                              <p className="text-xs text-[var(--text-muted)]">
                                Servidor: <code className="bg-[var(--bg)] px-1 rounded">{project.client_api_url}</code>
                              </p>
                            )}
                            {healthHistory.length > 0 && (
                              <div className="pt-2 border-t border-[var(--border)]">
                                <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Historial (cada vez que se abre)</p>
                                <ul className="space-y-1.5 max-h-[200px] overflow-y-auto text-sm">
                                  {healthHistory.map((h) => (
                                    <li key={h.id} className="flex items-center justify-between gap-2 text-[var(--text)]">
                                      <span className="text-[var(--text-muted)] shrink-0">{formatDistanceToNow(new Date(h.checked_at), { addSuffix: true, locale: es })}</span>
                                      <span className={`inline-flex items-center gap-1.5 font-medium ${h.status === 'active' ? 'text-[var(--status-ok)]' : 'text-[var(--status-error)]'}`}>
                                        {h.status === 'active' ? (
                                          <IconApiOk />
                                        ) : (
                                          <IconApiDown />
                                        )}
                                        {h.status === 'active' ? 'Arriba' : 'Caído'}
                                        {h.latency_ms != null && h.status === 'active' && (
                                          <span className="text-[var(--text-muted)] font-normal"> · {h.latency_ms} ms</span>
                                        )}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </section>
                        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
                          <div className="flex items-center justify-between gap-2 p-4 border-b border-[var(--border)]">
                            <h2 className="text-sm font-medium text-[var(--text-muted)]">
                              Actividades · {selectedStore?.name ?? selectedStoreId}
                            </h2>
                            <button
                              type="button"
                              onClick={fetchActivities}
                              disabled={activitiesLoading}
                              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors disabled:opacity-50"
                              title="Actualizar actividades"
                            >
                              {activitiesLoading ? <IconSpinner /> : <IconRefresh />}
                            </button>
                          </div>
                          <div className="p-4 max-h-[400px] overflow-y-auto">
                            {activitiesLoading ? (
                              <p className="text-sm text-[var(--text-muted)]">Cargando actividades...</p>
                            ) : activities.length === 0 ? (
                              <p className="text-sm text-[var(--text-muted)]">Sin actividades recientes en esta tienda.</p>
                            ) : (
                              <ul className="space-y-3">
                                {activities.map((a) => (
                                  <li key={a.id} className="text-sm border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-[var(--text)] font-medium">{a.user_name ?? 'Usuario'}</span>
                                      <span className="text-[var(--text-muted)] text-xs shrink-0">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: es })}</span>
                                    </div>
                                    <p className="text-[var(--text)] mt-0.5">
                                      {activityLabel(a.action, a.module, a.details ?? {})}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </section>
                      </>
                    );
                  })()}
                </div>
              )}

            </>
              )}

              {/* When NOT configured: show Microtiendas + Usuarios below sync (when configured they're above) */}
              {!project.client_api_configured && (
            <>
              <section className="mb-8">
                <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Microtiendas</h2>
                {storesLoading ? (
                  <p className="text-sm text-[var(--text-muted)]">Cargando...</p>
                ) : stores.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">Sin tiendas. Ejecuta Sync para traer las microtiendas del cliente.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {stores.map((s) => {
                      const storeLogoUrl = resolveLogoUrl(s.logo_url || project.logo_url);
                      return (
                      <div
                        key={s.id}
                        className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col items-center gap-2 text-center"
                      >
                        {storeLogoUrl ? (
                          <img src={storeLogoUrl} alt={s.name ?? s.external_id} className="w-12 h-12 rounded-lg object-contain bg-[var(--bg)]" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-lg font-semibold text-[var(--text-muted)]">
                            {(s.name ?? '?').charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-[var(--text)] truncate w-full">{s.name ?? s.external_id}</span>
                      </div>
                    ); })}
                  </div>
                )}
              </section>
              <section className="mb-8">
                <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Usuarios</h2>
                {usersLoading ? (
                  <p className="text-sm text-[var(--text-muted)]">Cargando...</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">Sin usuarios. Ejecuta Sync para traer los usuarios del cliente.</p>
                ) : (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                          <th className="p-3 font-medium">Nombre</th>
                          <th className="p-3 font-medium">Email</th>
                          <th className="p-3 font-medium">Tienda</th>
                          <th className="p-3 font-medium w-20">Dueño</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-[var(--border)] last:border-0">
                            <td className="p-3 text-[var(--text)]">{u.name ?? '—'}</td>
                            <td className="p-3 text-[var(--text)]">{u.email}</td>
                            <td className="p-3 text-[var(--text-muted)]">{u.store_name ?? (u.store_id ? u.store_id : '—')}</td>
                            <td className="p-3">{u.is_owner ? <span className="text-xs font-medium text-[var(--accent)]">Sí</span> : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
              )}

              {/* Last activity */}
              {project.last_activity_at && (
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <p className="text-sm text-[var(--text-muted)]">
                    Last activity: {formatDistanceToNow(new Date(project.last_activity_at), { addSuffix: true, locale: es })}
                  </p>
                </div>
              )}
            </>
          )}

          {clientTab === 'config' && (
            <section className="mb-8 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Nombre del cliente y del proyecto</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Edita el nombre del cliente y el nombre del proyecto tal como aparecen en Backstage.
              </p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">Nombre del cliente</label>
                  <input
                    type="text"
                    value={configNombreCliente}
                    onChange={(e) => setConfigNombreCliente(e.target.value)}
                    placeholder="Ej: Aleya"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">Nombre del proyecto</label>
                  <input
                    type="text"
                    value={configNombreProyecto}
                    onChange={(e) => setConfigNombreProyecto(e.target.value)}
                    placeholder="Ej: Aleya Shop"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveConfigNames}
                  disabled={configSaveStatus === 'saving'}
                  className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {configSaveStatus === 'saving' ? 'Guardando...' : configSaveStatus === 'saved' ? 'Guardado' : configSaveStatus === 'error' ? 'Error' : 'Guardar'}
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border)]">
                <h2 className="text-sm font-medium text-[var(--text-muted)] mb-2">Zona de peligro</h2>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Eliminar el proyecto borrará todos los datos asociados (tiendas, usuarios, historial de salud y actividades). Esta acción no se puede deshacer.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--status-error)] text-[var(--status-error)] hover:bg-[var(--status-error)]/10 transition-colors text-sm font-medium"
                  >
                    <IconTrash />
                    Eliminar proyecto
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-[var(--text)]">¿Eliminar &quot;{project.nombre_proyecto}&quot;?</span>
                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      disabled={deleteStatus === 'deleting'}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--status-error)] text-white hover:opacity-90 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      {deleteStatus === 'deleting' ? (
                        <>
                          <IconSpinner />
                          Eliminando...
                        </>
                      ) : deleteStatus === 'error' ? (
                        'Error. Reintentar'
                      ) : (
                        'Sí, eliminar'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowDeleteConfirm(false); setDeleteStatus('idle'); }}
                      disabled={deleteStatus === 'deleting'}
                      className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {clientTab === 'sync' && (
            <section className="mb-8 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Client app (store sync)</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Configure the client app API so we can sync users and stores. The client must expose <code className="bg-[var(--bg)] px-1 rounded">GET /api/andres/usuarios-tiendas</code> with header <code className="bg-[var(--bg)] px-1 rounded">x-andres-api-key</code>.
              </p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">Client API URL</label>
                  <input
                    type="url"
                    value={clientApiUrl}
                    onChange={(e) => setClientApiUrl(e.target.value)}
                    placeholder="Ej: http://localhost:3000 o https://tu-app.com (cualquier URL del cliente)"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">Client API key</label>
                  <input
                    type="password"
                    value={clientApiKey}
                    onChange={(e) => setClientApiKey(e.target.value)}
                    placeholder={project.client_api_configured ? 'Leave blank to keep current' : 'Same value as ANDRES_API_KEY in client'}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    disabled={saveStatus === 'saving'}
                    className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 transition-colors"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save config'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncStatus === 'syncing' || (!project.client_api_configured && (!clientApiUrl.trim() || !clientApiKey))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {syncStatus === 'syncing' ? <IconSpinner /> : <IconRefresh />}
                    {syncStatus === 'syncing' ? 'Syncing...' : 'Sync users from client app'}
                  </button>
                </div>
                {!project.client_api_configured && !clientApiUrl.trim() && (
                  <p className="text-sm text-[var(--status-warn)]">Save config or fill URL and API key above, then run sync.</p>
                )}
                {syncMessage && (
                  <p className={`text-sm ${syncStatus === 'error' ? 'text-[var(--status-error)]' : 'text-[var(--text-muted)]'}`}>
                    {syncMessage}
                  </p>
                )}
              </div>
            </section>
          )}

          {clientTab === 'facturas' && (
            <section className="mb-8 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Facturas</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Aquí podrás ver y gestionar las facturas de {project.nombre_proyecto}. (Próximamente.)
              </p>
            </section>
          )}

          {clientTab === 'soporte' && (
            <section className="mb-8 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Soporte</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Tickets y solicitudes de soporte para {project.nombre_proyecto}.
              </p>
              <Link
                href="/backstage/tickets"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors text-sm"
              >
                Ver tickets
                <IconExternal />
              </Link>
            </section>
          )}
          </main>
        </div>
      </div>
    </BackstageGuard>
  );
}
