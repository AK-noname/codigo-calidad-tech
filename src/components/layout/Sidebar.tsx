import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Target,
  Kanban,
  AlertTriangle,
  Truck,
  Sparkles,
  Package,
  FileQuestion,
  Headphones,
  Award,
  ChevronRight,
  Building2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    role,
    activeTab,
    setActiveTab,
    pendingClaimsCount,
    overdueClaimsCount,
    clientClaims,
    clients,
  } = useApp();

  const adminNavItems = [
    {
      id: 'inicio',
      label: '1. Panel de Calidad',
      description: 'Estado general y 5 indicadores',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'diagnostico',
      label: '2. Diagnóstico',
      description: 'Madurez de 6 áreas y brechas',
      icon: Target,
      badge: null,
    },
    {
      id: 'phva',
      label: '3. Plan PHVA',
      description: 'Tablero Kanban de mejora',
      icon: Kanban,
      badge: null,
    },
    {
      id: 'reclamos',
      label: '4. Reclamos y Fallas',
      description: 'Atención a clientes y causas raíz',
      icon: AlertTriangle,
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : null,
      badgeColor: overdueClaimsCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-white',
    },
    {
      id: 'pedidos',
      label: '5. Pedidos y Trazabilidad',
      description: 'Validación operativa y despacho',
      icon: Truck,
      badge: null,
    },
    {
      id: 'clientes',
      label: '6. Directorio de Clientes',
      description: 'Supervisión y registro de empresas',
      icon: Building2,
      badge: clients.length > 0 ? clients.length : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'asistente-ia',
      label: '7. Asistente IA',
      description: 'Diagnóstico y plan sugerido',
      icon: Sparkles,
      badge: 'IA',
      badgeColor: 'bg-indigo-600 text-white',
    },
  ];

  const clientUnresolvedCount = clientClaims.filter((c) => c.status !== 'Cerrada').length;

  const clientNavItems = [
    {
      id: 'mis-pedidos',
      label: '1. Mis Pedidos',
      description: 'Trazabilidad paso a paso',
      icon: Package,
      badge: null,
    },
    {
      id: 'registrar-reclamo',
      label: '2. Radicar Reclamo',
      description: 'Reportar novedad o garantía',
      icon: FileQuestion,
      badge: null,
    },
    {
      id: 'mis-reclamos',
      label: '3. Mis Reclamos',
      description: 'Historial y respuestas',
      icon: Headphones,
      badge: clientUnresolvedCount > 0 ? clientUnresolvedCount : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'compromiso',
      label: '4. Nuestro Compromiso',
      description: 'SLA y sedes de atención',
      icon: Award,
      badge: null,
    },
    {
      id: 'mi-cuenta',
      label: '5. Mi Cuenta y Seguridad',
      description: 'Datos, contraseña y eliminar cuenta',
      icon: Building2,
      badge: null,
    },
  ];

  const items = role === 'admin' ? adminNavItems : clientNavItems;

  return (
    <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-slate-200 shrink-0 select-none">
      <div className="p-5 border-b border-slate-100">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          {role === 'admin' ? 'Módulos de Administración' : 'Servicios para Clientes'}
        </span>
        <p className="text-xs text-slate-500 mt-0.5">
          {role === 'admin'
            ? 'Gestión estratégica PHVA y servicio'
            : 'Consulte sus pedidos y garantías'}
        </p>
      </div>

      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-blue-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{item.label}</div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-blue-200 translate-x-0.5' : 'text-slate-300'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 m-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
          <span>{role === 'admin' ? 'Meta Global 2026' : 'Línea de Atención'}</span>
          <span className="text-emerald-700 font-extrabold">{role === 'admin' ? '93% CSAT' : '24h SLA'}</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          {role === 'admin'
            ? 'Enfoque cero defectos y validación logística estricta.'
            : 'Atención personalizada en Medellín, Bogotá y Cali.'}
        </p>
      </div>
    </aside>
  );
};
