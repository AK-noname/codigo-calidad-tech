import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  LogOut,
  RotateCcw,
  HelpCircle,
  Bell,
  ChevronDown,
  UserCheck,
  Plus,
  Settings,
} from 'lucide-react';
import { ClientRegistrationModal } from '../common/ClientRegistrationModal';

interface NavbarProps {
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHelp }) => {
  const {
    role,
    activeClient,
    clients,
    loginAsClient,
    logout,
    resetToInitialData,
    overdueClaimsCount,
    setActiveTab,
  } = useApp();

  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  GlobalTech <span className="text-blue-400 font-semibold text-xs">Calidad 360</span>
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    role === 'admin'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                Importadora GlobalTech S.A.S.
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* If Client: Company Badge (Confidential, no switcher to other companies) */}
            {role === 'client' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('mi-cuenta')}
                  className="flex items-center space-x-2 text-xs bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  title="Ver y gestionar los datos confidenciales de mi empresa"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-white max-w-[140px] sm:max-w-xs truncate">
                    {activeClient?.name}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {activeClient?.code}
                  </span>
                </button>
              </div>
            )}

            {/* Overdue alert indicator for Admin */}
            {role === 'admin' && overdueClaimsCount > 0 && (
              <button
                onClick={() => setActiveTab('reclamos')}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-2.5 py-1 rounded-xl text-xs font-semibold hover:bg-rose-500/30 transition-colors"
                title={`${overdueClaimsCount} reclamos llevan más de 24h sin atención`}
              >
                <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>{overdueClaimsCount} reclamo(s) &gt;24h</span>
              </button>
            )}

            {/* Reset data button for Admin */}
            {role === 'admin' && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                title="Restablecer sistema a configuración institucional inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Restablecer sistema</span>
              </button>
            )}

            {/* Help / Guide */}
            <button
              onClick={onOpenHelp}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Guía de uso rápido"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Cerrar sesión (Always visible as required) */}
            <button
              onClick={logout}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 px-3 py-1.5 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de confirmación para restablecer datos */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-900 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-2">¿Restablecer sistema institucional?</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Esta acción restaurará los indicadores estratégicos y el plan PHVA a los valores
              institucionales de GlobalTech S.A.S.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetToInitialData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800"
              >
                Sí, restablecer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para registrar nueva empresa cliente */}
      <ClientRegistrationModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        autoLogin={true}
      />
    </>
  );
};
