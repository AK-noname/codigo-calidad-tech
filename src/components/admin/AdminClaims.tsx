import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Claim, ClaimStatus, ClaimCategory, ClaimPriority } from '../../types';
import { ClaimStatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  AlertTriangle,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Building,
  BarChart3,
  X,
  Search,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const AdminClaims: React.FC = () => {
  const {
    claims,
    respondToClaim,
    updateClaimStatus,
    addClaim,
    overdueClaimsCount,
    areas,
  } = useApp();

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  // Response form
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<ClaimStatus>('En proceso');
  const [rootCauseText, setRootCauseText] = useState('');
  const [correctiveActionText, setCorrectiveActionText] = useState('');
  const [prioritySelect, setPrioritySelect] = useState<ClaimPriority>('Alta');

  // Filter & Search
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New internal/external claim form
  const [newIsInternal, setNewIsInternal] = useState(true);
  const [newClientName, setNewClientName] = useState('Proceso Interno');
  const [newCategory, setNewCategory] = useState<ClaimCategory>('Falla en empaque');
  const [newArea, setNewArea] = useState(areas[0]?.name || 'Logística y Despachos');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<ClaimPriority>('Alta');
  const [newContactName, setNewContactName] = useState('Auditoría Interna Calidad');
  const [newContactPhone, setNewContactPhone] = useState('+57 (601) 745-8900');
  const [newContactEmail, setNewContactEmail] = useState('calidad@globaltech.com.co');

  const nowTime = new Date().getTime();

  // Root cause aggregation for Recharts
  const rootCausesCount: Record<string, number> = {};
  claims.forEach((c) => {
    const key = c.category;
    rootCausesCount[key] = (rootCausesCount[key] || 0) + 1;
  });

  const chartData = Object.entries(rootCausesCount).map(([category, count]) => ({
    category: category.length > 18 ? category.slice(0, 16) + '...' : category,
    fullCategory: category,
    count,
  }));

  const chartColors = ['#1e3a8a', '#0284c7', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

  const handleOpenResponse = (claim: Claim) => {
    setSelectedClaim(claim);
    setResponseText(claim.adminResponse || '');
    setResponseStatus(claim.status === 'Abierta' ? 'En proceso' : claim.status);
    setRootCauseText(claim.rootCause || '');
    setCorrectiveActionText(claim.correctiveAction || '');
    setPrioritySelect(claim.priority);
    setShowResponseModal(true);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim || !responseText.trim()) return;

    respondToClaim(
      selectedClaim.id,
      responseText.trim(),
      responseStatus,
      correctiveActionText.trim(),
      rootCauseText.trim(),
      prioritySelect
    );

    setShowResponseModal(false);
  };

  const handleCreateInternalClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    addClaim({
      clientId: newIsInternal ? 'cli-internal' : 'cli-001',
      clientName: newIsInternal ? 'No Conformidad Interna' : newClientName,
      category: newCategory,
      description: newDescription.trim(),
      contactName: newContactName,
      contactPhone: newContactPhone,
      contactEmail: newContactEmail,
      isInternal: newIsInternal,
      responsibleArea: newArea,
      priority: newPriority,
    });

    setNewDescription('');
    setShowNewClaimModal(false);
  };

  const filteredClaims = claims.filter((c) => {
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch =
      c.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 4 • No Conformidades y Reclamos</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestión de Reclamos de Clientes y Fallas Internas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Atienda los reclamos antes de cumplir 24 horas, consigne la causa raíz y
            proporcione respuestas formales que se sincronizan de inmediato con el cliente.
          </p>
        </div>

        <button
          onClick={() => setShowNewClaimModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Falla / Reclamo</span>
        </button>
      </div>

      {/* SLA Alert Banner if any > 24 hours */}
      {overdueClaimsCount > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 text-rose-950 flex items-start space-x-3.5 shadow-sm animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-extrabold text-sm text-rose-900">
              ¡Alerta Crítica de Servicio! {overdueClaimsCount} reclamo(s) han superado las 24 horas
              sin atención formal
            </h4>
            <p className="text-xs text-rose-800 mt-0.5">
              El protocolo de calidad de GlobalTech exige responder al cliente antes de 24 horas para
              evitar la pérdida de contratos. Los casos marcados en rojo requieren respuesta prioritaria hoy mismo.
            </p>
          </div>
        </div>
      )}

      {/* Chart: Most frequent root causes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-900" />
              <span>Frecuencia por Tipología de Reclamos y No Conformidades</span>
            </h3>
            <p className="text-xs text-slate-500">
              Distribución de causas raíz para enfocar auditorías de calidad en bodegas y transporte.
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
            Total registrados: {claims.length}
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                stroke="#64748b"
                fontSize={11}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(val: any, _, item: any) => [
                  `${val} incidencias`,
                  item.payload.fullCategory,
                ]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Claims List and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por radicado, cliente, causa..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos ({claims.length})</option>
              <option value="Abierta">Abierta</option>
              <option value="En proceso">En proceso</option>
              <option value="Cerrada">Cerrada</option>
            </select>
          </div>
        </div>

        {/* Claims Table / Cards */}
        <div className="divide-y divide-slate-100">
          {filteredClaims.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No se encontraron reclamos con los criterios seleccionados.
            </div>
          ) : (
            filteredClaims.map((claim) => {
              const createdDate = new Date(claim.createdAt).getTime();
              const diffHours = (nowTime - createdDate) / (1000 * 60 * 60);
              const isOver24hWithoutResponse =
                claim.status !== 'Cerrada' && !claim.adminResponse && diffHours >= 24;

              return (
                <div
                  key={claim.id}
                  className={`p-5 transition-colors ${
                    isOver24hWithoutResponse
                      ? 'bg-rose-50/50 hover:bg-rose-50'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-sm text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                          {claim.trackingNumber}
                        </span>

                        <ClaimStatusBadge status={claim.status} />
                        <PriorityBadge priority={claim.priority} />

                        {claim.isInternal ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded">
                            Falla Interna
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded">
                            Reclamo Cliente
                          </span>
                        )}

                        {isOver24hWithoutResponse && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>¡ALERTA &gt;24H SIN ATENCIÓN!</span>
                          </span>
                        )}
                      </div>

                      {/* Header details */}
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{claim.clientName}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 mt-0.5">
                          <span>
                            Categoría: <strong>{claim.category}</strong>
                          </span>
                          <span>
                            Área: <strong>{claim.responsibleArea}</strong>
                          </span>
                          {claim.orderNumber && (
                            <span>
                              Pedido:{' '}
                              <strong className="text-blue-900 font-mono">{claim.orderNumber}</strong>
                            </span>
                          )}
                          <span>Radicado el: {claim.createdAt}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {claim.description}
                      </p>

                      {/* Root cause and action if documented */}
                      {(claim.rootCause || claim.correctiveAction) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-amber-50/50 p-3 rounded-xl border border-amber-200/70">
                          {claim.rootCause && (
                            <div>
                              <span className="font-bold text-amber-900 block text-[11px]">
                                Causa Raíz Identificada:
                              </span>
                              <span className="text-slate-700">{claim.rootCause}</span>
                            </div>
                          )}
                          {claim.correctiveAction && (
                            <div>
                              <span className="font-bold text-emerald-900 block text-[11px]">
                                Acción Correctiva:
                              </span>
                              <span className="text-slate-700">{claim.correctiveAction}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Admin response preview */}
                      {claim.adminResponse && (
                        <div className="text-xs bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-emerald-900 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Respuesta Oficial Enviada al Cliente:</span>
                            </span>
                            <span className="text-[10px] text-emerald-700">
                              {claim.adminRespondedAt}
                            </span>
                          </div>
                          <p className="italic text-slate-800">"{claim.adminResponse}"</p>
                        </div>
                      )}
                    </div>

                    {/* Actions button */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenResponse(claim)}
                        className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{claim.adminResponse ? 'Editar Respuesta' : 'Responder al Cliente'}</span>
                      </button>

                      <select
                        value={claim.status}
                        onChange={(e) =>
                          updateClaimStatus(claim.id, e.target.value as ClaimStatus)
                        }
                        className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Cambiar estado del reclamo"
                      >
                        <option value="Abierta">Estado: Abierta</option>
                        <option value="En proceso">Estado: En proceso</option>
                        <option value="Cerrada">Estado: Cerrada</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Responder al Cliente & Causa Raíz */}
      {showResponseModal && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-300 font-mono font-bold">
                  Radicado: {selectedClaim.trackingNumber}
                </div>
                <h3 className="font-bold text-base">Atención y Respuesta a Reclamo</h3>
              </div>
              <button
                onClick={() => setShowResponseModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Claim context */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-0.5">
                  Cliente: {selectedClaim.clientName}
                </span>
                <p className="text-slate-600 italic">"{selectedClaim.description}"</p>
              </div>

              {/* Response to client */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Respuesta Oficial al Cliente * (Visible en su portal)
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={3}
                  placeholder="Estimado cliente, lamentamos el inconveniente. Hemos procedido con..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nuevo Estado *
                  </label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value as ClaimStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Abierta">Abierta (Sin resolver)</option>
                    <option value="En proceso">En proceso (Investigando / Despachando)</option>
                    <option value="Cerrada">Cerrada (Solución aceptada)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nivel de Prioridad
                  </label>
                  <select
                    value={prioritySelect}
                    onChange={(e) => setPrioritySelect(e.target.value as ClaimPriority)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              {/* Root cause analysis */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Causa Raíz Operativa (Análisis Interno de Calidad)
                </label>
                <input
                  type="text"
                  value={rootCauseText}
                  onChange={(e) => setRootCauseText(e.target.value)}
                  placeholder="Ej: Desalineación entre promesa del vendedor y stock real en bodega"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Corrective action */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Acción Correctiva Adoptada
                </label>
                <input
                  type="text"
                  value={correctiveActionText}
                  onChange={(e) => setCorrectiveActionText(e.target.value)}
                  placeholder="Ej: Reentrenamiento del personal y calibración del escáner"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Guardar y Sincronizar con Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Falla Interna o Reclamo Manual */}
      {showNewClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Registrar No Conformidad o Falla</h3>
              </div>
              <button
                onClick={() => setShowNewClaimModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInternalClaim} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    checked={newIsInternal}
                    onChange={() => setNewIsInternal(true)}
                    className="accent-blue-900"
                  />
                  <span>No Conformidad Interna</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    checked={!newIsInternal}
                    onChange={() => setNewIsInternal(false)}
                    className="accent-blue-900"
                  />
                  <span>Reclamo de Cliente Manual</span>
                </label>
              </div>

              {!newIsInternal && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nombre del Cliente / Empresa
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ej: Distribuidora del Valle S.A.S."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!newIsInternal}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tipología / Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ClaimCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Retraso en entrega">Retraso en entrega</option>
                    <option value="Información poco clara">Información poco clara</option>
                    <option value="Error en pedido">Error en pedido</option>
                    <option value="Garantía técnica">Garantía técnica</option>
                    <option value="Falla en empaque">Falla en empaque</option>
                    <option value="Atención al cliente">Atención al cliente</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Área Responsable
                  </label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Descripción Detallada de la No Conformidad *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Detalle exactamente la falla, hallazgo o inconformidad..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ClaimPriority)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Contacto / Reportante
                  </label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewClaimModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Registrar caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
