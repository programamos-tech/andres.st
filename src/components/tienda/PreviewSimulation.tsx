'use client';

import type { PreviewTipo, TipoProducto } from '@/lib/tienda-productos';

const BRAND_ACCENT_CLASS: Record<TipoProducto, { bar: string; dot: string; text: string }> = {
  funcionalidad: { bar: 'bg-[var(--brand-terracota)]/35', dot: 'bg-[var(--brand-terracota)]', text: 'text-[var(--brand-terracota)]' },
  integracion: { bar: 'bg-[var(--brand-cafe)]/35', dot: 'bg-[var(--brand-cafe)]', text: 'text-[var(--brand-cafe)]' },
  sistema: { bar: 'bg-[var(--brand-marron)]/40', dot: 'bg-[var(--brand-marron)]', text: 'text-[var(--brand-marron)]' },
};

export function PreviewSimulation({ tipo, grande = false, tipoProducto = 'funcionalidad' }: { tipo: PreviewTipo; grande?: boolean; tipoProducto?: TipoProducto }) {
  const base = grande ? 'min-h-[10rem] md:min-h-[12rem]' : 'min-h-[7rem] sm:min-h-[8rem]';
  const gap = grande ? 'gap-2' : 'gap-1';
  const text = grande ? 'text-xs md:text-sm' : 'text-[8px] sm:text-[9px]';
  const accent = BRAND_ACCENT_CLASS[tipoProducto];
  return (
    <div className={`w-full ${base} rounded-lg bg-[var(--brand-crema)] border border-[var(--border)] p-2 flex flex-col ${gap} overflow-hidden`}>
      {/* Reporte: tabla con columnas y datos como en un reporte real */}
      {tipo === 'reporte' && (
        <div className="flex-1 flex flex-col border border-[var(--border)] rounded overflow-hidden bg-white/60">
          <div className={`grid grid-cols-[1fr_1fr_0.6fr] ${gap} px-1.5 py-1 bg-[var(--brand-marron)]/10 border-b border-[var(--border)] ${text} font-semibold text-[var(--brand-marron)]`}>
            <span>Fecha</span><span>Ventas</span><span>%</span>
          </div>
          {['01/01', '05/01', '10/01'].map((fecha, i) => (
            <div key={fecha} className={`grid grid-cols-[1fr_1fr_0.6fr] ${gap} px-1.5 py-0.5 ${text} text-[var(--brand-carbon)] border-b border-[var(--border)]/50`}>
              <span>{fecha}</span><span>{[120, 85, 210][i]}</span><span className={accent.text}>{[12, 8, 21][i]}%</span>
            </div>
          ))}
          <div className={`mt-auto px-1.5 py-0.5 ${text} font-semibold text-[var(--brand-carbon)] bg-[var(--brand-crema)]`}>
            Total — 415
          </div>
        </div>
      )}
      {/* Dashboard: 4 tarjetas con número + etiqueta, como KPIs reales */}
      {tipo === 'dashboard' && (
        <div className={`grid grid-cols-2 ${gap} flex-1`}>
          {[
            { valor: '12', label: 'Ventas hoy' },
            { valor: '3', label: 'Stock bajo' },
            { valor: '98%', label: 'Meta mes' },
            { valor: '5', label: 'Alertas' },
          ].map((kpi, i) => (
            <div key={i} className="relative rounded-md border border-[var(--border)] p-1.5 flex flex-col justify-center bg-white/50">
              <span className={`${text} font-bold text-[var(--brand-carbon)] leading-tight`}>{kpi.valor}</span>
              <span className={`${text} text-[var(--brand-marron)] truncate`}>{kpi.label}</span>
              {i === 1 && <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[var(--status-warn)]" />}
            </div>
          ))}
        </div>
      )}
      {/* Exportar: opciones Excel y PDF como botones de descarga */}
      {tipo === 'exportar' && (
        <div className="flex-1 flex flex-col justify-center gap-2 p-1">
          <p className={`${text} text-[var(--brand-marron)] font-medium`}>Descargar como</p>
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-md border-2 border-[var(--status-ok)]/50 bg-[var(--status-ok)]/10">
              <div className="w-6 h-5 rounded border border-[var(--brand-carbon)]/30 grid grid-cols-2 gap-px p-0.5">
                {[1,2,3,4].map((i) => <div key={i} className="bg-[var(--brand-carbon)]/20 rounded-sm" />)}
              </div>
              <span className={`${text} font-medium text-[var(--brand-carbon)]`}>Excel</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-md border-2 border-[var(--status-error)]/40 bg-[var(--status-error)]/10">
              <div className="w-5 h-6 rounded-sm border border-[var(--brand-carbon)]/30" />
              <span className={`${text} font-medium text-[var(--brand-carbon)]`}>PDF</span>
            </div>
          </div>
        </div>
      )}
      {/* Alerta: aviso tipo notificación/toast con icono y acción */}
      {tipo === 'alerta' && (
        <div className="flex-1 flex flex-col justify-center p-1.5">
          <div className="rounded-lg border-l-4 border-[var(--status-warn)] bg-white/80 shadow-sm p-2">
            <div className="flex items-start gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--status-warn)] animate-pulse shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className={`${text} font-semibold text-[var(--brand-carbon)]`}>Stock bajo</p>
                <p className={`${text} text-[var(--brand-marron)] truncate`}>Producto X — 2 unidades</p>
                <span className={`${text} ${accent.text} font-medium`}>Ver lista →</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Historial: línea de tiempo con fechas y eventos */}
      {tipo === 'historial' && (
        <div className="flex-1 flex flex-col gap-0 py-1">
          {[
            { fecha: '01/02', evento: 'Compra', detalle: '$ 45.000' },
            { fecha: '15/01', evento: 'Garantía', detalle: 'Activa' },
            { fecha: '10/01', evento: 'Nota', detalle: 'Cliente preferencial' },
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                {i < 2 && <div className="w-px flex-1 min-h-[6px] bg-[var(--border)]" />}
              </div>
              <div className="min-w-0 pb-1">
                <p className={`${text} text-[var(--brand-carbon)] font-medium`}>{item.evento} · {item.fecha}</p>
                <p className={`${text} text-[var(--brand-marron)] truncate`}>{item.detalle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Email: preview de correo (De, Asunto, fragmento) */}
      {tipo === 'email' && (
        <div className="flex-1 flex flex-col justify-center p-1.5 border border-[var(--border)] rounded-lg bg-white/60">
          <div className={`${text} text-[var(--brand-marron)]`}><span className="font-medium">De:</span> sistema@tuapp.com</div>
          <div className={`${text} text-[var(--brand-marron)]`}><span className="font-medium">Asunto:</span> Factura #001</div>
          <div className="mt-1 h-2 w-full bg-[var(--brand-marron)]/15 rounded" />
          <div className="h-2 w-4/5 bg-[var(--brand-marron)]/10 rounded mt-0.5" />
        </div>
      )}
      {/* WhatsApp: burbuja de chat con mensaje del sistema */}
      {tipo === 'whatsapp' && (
        <div className="flex-1 flex flex-col justify-end gap-1 p-1">
          <div className="self-start max-w-[70%] rounded-lg bg-[var(--brand-crema)] border border-[var(--border)] px-2 py-1">
            <span className={`${text} text-[var(--brand-marron)]`}>¿Confirmás el pedido?</span>
          </div>
          <div className="self-end max-w-[85%] rounded-lg bg-[var(--brand-cafe)]/30 border border-[var(--border)] px-2 py-1">
            <span className={`${text} text-[var(--brand-carbon)]`}>✓ Venta registrada — $ 32.000</span>
          </div>
        </div>
      )}
      {/* Pago: pantalla de cobro con monto y tarjeta */}
      {tipo === 'pago' && (
        <div className="flex-1 flex flex-col justify-center items-center gap-2 p-2 border border-[var(--border)] rounded-lg bg-white/70">
          <p className={`${text} text-[var(--brand-marron)]`}>Monto a cobrar</p>
          <p className={`${text} font-bold text-[var(--brand-carbon)]`}>$ 45.000</p>
          <div className="w-10 h-6 rounded border-2 border-[var(--brand-marron)]/40 flex items-center justify-center bg-[var(--bg)]">
            <span className={`${text} text-[var(--brand-marron)]`}>****</span>
          </div>
          <div className={`w-full py-1 rounded ${accent.bar} text-center ${text} font-medium text-[var(--brand-carbon)]`}>Aprobar</div>
        </div>
      )}
      {/* Contabilidad: listado de movimientos + exportar */}
      {tipo === 'contabilidad' && (
        <div className="flex-1 flex flex-col p-1.5 border border-[var(--border)] rounded-lg bg-white/60">
          <p className={`${text} font-semibold text-[var(--brand-carbon)] mb-1`}>Ene 2026</p>
          <div className="space-y-0.5 flex-1">
            <div className={`${text} flex justify-between text-[var(--brand-marron)]`}><span>Ventas</span><span>+ 1.2M</span></div>
            <div className={`${text} flex justify-between text-[var(--brand-marron)]`}><span>Compras</span><span>− 450k</span></div>
          </div>
          <div className={`mt-1 pt-1 border-t border-[var(--border)] ${text} font-medium ${accent.text} flex items-center gap-0.5`}>→ Exportar para contador</div>
        </div>
      )}
      {/* POS: lista de productos + teclado numérico + total */}
      {tipo === 'pos' && (
        <div className="flex-1 grid grid-cols-[1fr_0.6fr] gap-1">
          <div className="flex flex-col gap-0.5">
            <div className={`${text} flex justify-between text-[var(--brand-carbon)] border-b border-[var(--border)] pb-0.5`}><span>Producto A</span><span>$ 15.000</span></div>
            <div className={`${text} flex justify-between text-[var(--brand-carbon)] border-b border-[var(--border)] pb-0.5`}><span>Producto B</span><span>$ 8.000</span></div>
            <div className={`${text} font-semibold text-[var(--brand-carbon)] mt-auto`}>Total: $ 23.000</div>
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            {[1,2,3,4,5,6,7,8,9].map((k) => (
              <div key={k} className={`rounded flex items-center justify-center bg-[var(--brand-marron)]/15 border border-[var(--border)] ${text} font-medium text-[var(--brand-carbon)]`}>
                {k}
              </div>
            ))}
            <div className={`col-span-3 rounded ${accent.bar} flex items-center justify-center ${text} font-bold text-[var(--brand-carbon)]`}>Total</div>
          </div>
        </div>
      )}
      {/* Local: caja abierta + resumen de turno */}
      {tipo === 'local' && (
        <div className="flex-1 flex flex-col p-1.5 border border-[var(--border)] rounded-lg bg-white/60">
          <div className="flex justify-between items-center mb-1">
            <span className={`${text} font-semibold text-[var(--brand-carbon)]`}>Caja 1</span>
            <span className={`${text} ${accent.text} font-medium`}>Abierta</span>
          </div>
          <div className={`${text} text-[var(--brand-marron)] border-t border-b border-[var(--border)] py-0.5`}>Ventas turno: 12</div>
          <div className={`${text} font-semibold text-[var(--brand-carbon)] mt-1`}>$ 340.000</div>
        </div>
      )}
      {/* Garantías: tabla producto | vence | estado */}
      {tipo === 'garantias' && (
        <div className="flex-1 flex flex-col border border-[var(--border)] rounded overflow-hidden bg-white/60">
          <div className={`grid grid-cols-[1fr_0.6fr_0.5fr] gap-1 px-1.5 py-1 bg-[var(--brand-marron)]/10 ${text} font-semibold text-[var(--brand-marron)] border-b border-[var(--border)]`}>
            <span>Producto</span><span>Vence</span><span>Estado</span>
          </div>
          <div className={`grid grid-cols-[1fr_0.6fr_0.5fr] gap-1 px-1.5 py-0.5 ${text} border-b border-[var(--border)]/50`}>
            <span className="truncate text-[var(--brand-carbon)]">Monitor 24"</span><span className="text-[var(--brand-marron)]">15/03</span><span className="text-[var(--status-warn)]">Alerta</span>
          </div>
          <div className={`grid grid-cols-[1fr_0.6fr_0.5fr] gap-1 px-1.5 py-0.5 ${text}`}>
            <span className="truncate text-[var(--brand-carbon)]">Teclado</span><span className="text-[var(--brand-marron)]">20/04</span><span className={accent.text}>OK</span>
          </div>
        </div>
      )}
      {/* Ventas: factura con ítems y total */}
      {tipo === 'ventas' && (
        <div className="flex-1 flex flex-col border border-[var(--border)] rounded-lg bg-white/60 p-1.5">
          <p className={`${text} font-bold text-[var(--brand-carbon)] border-b border-[var(--border)] pb-0.5`}>FACTURA #001</p>
          <div className={`${text} flex justify-between text-[var(--brand-marron)] py-0.5`}><span>2 × Producto A</span><span>$ 30.000</span></div>
          <div className={`${text} flex justify-between text-[var(--brand-marron)] py-0.5`}><span>1 × Producto B</span><span>$ 8.000</span></div>
          <div className={`${text} font-semibold text-[var(--brand-carbon)] flex justify-between mt-auto pt-0.5 border-t border-[var(--border)]`}><span>Total</span><span className={accent.text}>$ 38.000</span></div>
        </div>
      )}
    </div>
  );
}
