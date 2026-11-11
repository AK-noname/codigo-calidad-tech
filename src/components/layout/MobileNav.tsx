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
  Building2,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, activeTab, setActiveTab, pendingClaimsCount, overdueClaimsCount, clientClaims } =
    useApp();

  const adminNavItems = [
    { id: 'inicio', label: 'Panel', icon: LayoutDashboard },
    { id: 'diagnostico', label: 'Diagnóstico', icon: Target },
    { id: 'phva', label: 'PHVA', icon: Kanban },
    {
      id: 'reclamos',
      label: 'Reclamos',
      icon: AlertTriangle,
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : null,
      urgent: overdueClaimsCount > 0,
    },
    { id: 'pedidos', label: 'Pedidos', icon: Truck },
    { id: 'clientes', label: 'Clientes', icon: Building2 },
    { id: 'asistente-ia', label: 'IA', icon: Sparkles },
  ];

  const clientUnresolvedCount = clientClaims.filter((c) => c.status !== 'Cerrada').length;

  const clientNavItems = [
    { id: 'mis-pedidos', label: 'Pedidos', icon: Package },
    { id: 'registrar-reclamo', label: 'Radicar', icon: FileQuestion },
    {
      id: 'mis-reclamos',
      label: 'Reclamos',
      icon: Headphones,
      badge: clientUnresolvedCount > 0 ? clientUnresolvedCount : null,
      urgent: false,
    },
    { id: 'compromiso', label: 'SLA', icon: Award },
    { id: 'mi-cuenta', label: 'Cuentas', icon: Building2 },
  ];

  const items = role === 'admin' ? adminNavItems : clientNavItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-xl px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors min-w-[50px] ${
                isActive ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white ${
                      item.urgent ? 'bg-rose-600 animate-bounce' : 'bg-amber-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none">{item.label}</span>
              {isActive && (
                <span className="w-4 h-1 bg-blue-900 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
