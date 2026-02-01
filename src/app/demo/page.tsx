'use client';

import { useState } from 'react';

// Simulación de un sistema POS de cliente
export default function DemoClientApp() {
  const [moduloActivo, setModuloActivo] = useState('ventas');
  
  // Datos del usuario simulado
  const usuario = {
    nombre: 'María García',
    email: 'maria@zonat.com',
    proyecto: 'zonat',
    tienda: 'Zona T Centro'
  };

  const modulos = [
    { id: 'ventas', nombre: 'Ventas', icon: '💰' },
    { id: 'inventario', nombre: 'Inventario', icon: '📦' },
    { id: 'clientes', nombre: 'Clientes', icon: '👥' },
    { id: 'reportes', nombre: 'Reportes', icon: '📊' },
  ];

  // URL de ayuda con parámetros
  const ayudaUrl = `/ayuda?proyecto=${usuario.proyecto}&usuario=${encodeURIComponent(usuario.nombre)}&email=${encodeURIComponent(usuario.email)}&modulo=${moduloActivo}&tienda=${encodeURIComponent(usuario.tienda)}`;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header del sistema simulado */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">
              Z
            </div>
            <div>
              <h1 className="font-semibold text-sm">Sistema POS ZonaT</h1>
              <p className="text-xs text-slate-400">{usuario.tienda}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Usuario */}
            <div className="text-right">
              <p className="text-sm">{usuario.nombre}</p>
              <p className="text-xs text-slate-400">Vendedor</p>
            </div>
            
            {/* Botón de Ayuda - EL IMPORTANTE */}
            <a
              href={ayudaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
            >
              <span>?</span>
              <span className="hidden sm:inline">Ayuda</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-slate-800 min-h-[calc(100vh-57px)] p-4">
          <nav className="space-y-1">
            {modulos.map((modulo) => (
              <button
                key={modulo.id}
                onClick={() => setModuloActivo(modulo.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  moduloActivo === modulo.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{modulo.icon}</span>
                <span>{modulo.nombre}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Módulo activo:</p>
            <p className="text-sm font-medium capitalize">{moduloActivo}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Demo banner */}
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm">
                <strong>Demo:</strong> Esta es una simulación del sistema de un cliente. 
                Haz click en <strong>"? Ayuda"</strong> arriba para ver cómo funciona el flujo hacia andresruss.st
              </p>
            </div>

            {/* Contenido simulado según módulo */}
            {moduloActivo === 'ventas' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Punto de Venta</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <div className="w-full h-24 bg-slate-700 rounded-lg mb-3"></div>
                      <p className="text-sm">Producto {i}</p>
                      <p className="text-lg font-bold text-purple-400">$25.000</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {moduloActivo === 'inventario' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Inventario</h2>
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left">Producto</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map((i) => (
                        <tr key={i} className="border-t border-slate-700">
                          <td className="px-4 py-3">Producto {i}</td>
                          <td className="px-4 py-3">{i * 10}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                              OK
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {moduloActivo === 'clientes' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Clientes</h2>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors">
                  + Nuevo Cliente
                </button>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
                  <p>Aquí aparecería la lista de clientes...</p>
                  <p className="text-sm mt-2">¿Tienes problemas? Haz click en <strong>Ayuda</strong></p>
                </div>
              </div>
            )}

            {moduloActivo === 'reportes' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Reportes</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm">Ventas del día</p>
                    <p className="text-3xl font-bold mt-2">$1.250.000</p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm">Transacciones</p>
                    <p className="text-3xl font-bold mt-2">47</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer con info de ayuda */}
      <div className="fixed bottom-4 right-4">
        <a
          href={ayudaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-full shadow-lg shadow-purple-500/20 text-sm font-medium transition-all hover:scale-105"
        >
          <span className="text-lg">💬</span>
          <span>¿Necesitas ayuda?</span>
        </a>
      </div>
    </div>
  );
}
