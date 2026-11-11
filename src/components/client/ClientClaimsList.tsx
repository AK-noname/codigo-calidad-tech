import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimStatusBadge } from '../common/StatusBadge';
import {
  Headphones,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  MessageSquare,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const ClientClaimsList: React.FC = () => {
  const { clientClaims, activeClient, setActiveTab } = useApp();

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Portal de Clientes • Historial de Atención</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Mis Reclamos y Solicitudes de Garantía
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Haga seguimiento al estado de sus radicados y lea las soluciones adoptadas
            por el equipo de Calidad de GlobalTech.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('registrar-reclamo')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Radicar Nuevo Reclamo</span>
        </button>
      </div>

      {clientClaims.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            ¡No registra reclamos ni garantías pendientes!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Sus operaciones con GlobalTech se encuentran al día y sin novedades reportadas.
          </p>
          <button
            onClick={() => setActiveTab('registrar-reclamo')}
            className="px-5 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-sm"
          >
            Reportar una novedad si la necesita
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {clientClaims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-black text-sm text-blue-900 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-lg">
                    {claim.trackingNumber}
                  </span>
                  <ClaimStatusBadge status={claim.status} isClientView={true} />
                  <span className="text-xs font-semibold text-slate-500">
                    Tipo: <strong>{claim.category}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Radicado el: {claim.createdAt}</span>
                </div>
              </div>

              {/* Claim Description */}
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Descripción reportada:
                </span>
                <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  {claim.description}
                </p>
              </div>

              {/* Order reference if any */}
              {claim.orderNumber && (
                <div className="text-xs text-slate-500">
                  Pedido asociado:{' '}
                  <strong className="text-blue-900 font-mono">{claim.orderNumber}</strong>
                </div>
              )}

              {/* Admin response if exists */}
              {claim.adminResponse ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center space-x-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Respuesta del Equipo de Calidad GlobalTech</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {claim.adminRespondedAt}
                    </span>
                  </div>

                  <p className="text-slate-800 italic leading-relaxed text-sm bg-white/70 p-3 rounded-lg border border-emerald-100">
                    "{claim.adminResponse}"
                  </p>

                  <div className="text-[11px] text-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      Caso gestionado bajo protocolo de calidad ISO 9001 y mejora continua GlobalTech.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center space-x-2.5 text-xs text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                  <div>
                    <span className="font-bold">En proceso de revisión por el área responsable.</span>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Nuestro compromiso es entregarle una respuesta técnica y operativa antes de 24
                      horas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
