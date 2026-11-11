import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualitySemaforo } from '../common/StatusBadge';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sliders,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    indicators,
    updateIndicator,
    overallQualityStatus,
    pendingClaimsCount,
    overdueClaimsCount,
    setActiveTab,
  } = useApp();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIndicatorForChart, setSelectedIndicatorForChart] = useState<string>(
    'ind-satisfaction'
  );

  const [editValues, setEditValues] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    indicators.forEach((ind) => {
      map[ind.id] = ind.currentValue;
    });
    return map;
  });

  const activeInd = indicators.find((i) => i.id === selectedIndicatorForChart) || indicators[0];

  const handleSaveIndicators = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(editValues).forEach(([id, val]) => {
      updateIndicator(id, Number(val));
    });
    setShowUpdateModal(false);
  };

  const statusBg =
    overallQualityStatus === 'Bueno'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : overallQualityStatus === 'En riesgo'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-rose-50 border-rose-200 text-rose-900';

  const statusDot =
    overallQualityStatus === 'Bueno'
      ? 'bg-emerald-500'
      : overallQualityStatus === 'En riesgo'
      ? 'bg-amber-500'
      : 'bg-rose-600 animate-pulse';

  return (
    <div className="space-y-6">
      {/* Header with Title and 1-line instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 1 • Dirección de Calidad</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel de Calidad y Semáforo de Indicadores
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Monitoree el estado general de servicio, analice la evolución mensual de los
            5 KPI y actualice los valores con un solo clic.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              const map: Record<string, number> = {};
              indicators.forEach((ind) => {
                map[ind.id] = ind.currentValue;
              });
              setEditValues(map);
              setShowUpdateModal(true);
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Actualizar indicadores</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Overall Calculated Quality State & Overdue Claims Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Status Card */}
        <div className={`rounded-2xl p-5 border shadow-sm flex items-center justify-between ${statusBg}`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Estado General de Calidad (Calculado)
            </span>
            <div className="flex items-center space-x-2.5 mt-1">
              <span className={`w-3.5 h-3.5 rounded-full ${statusDot}`} />
              <h3 className="text-2xl font-extrabold">{overallQualityStatus}</h3>
            </div>
            <p className="text-xs opacity-90 mt-1 leading-snug">
              {overallQualityStatus === 'Bueno'
                ? 'Los indicadores se encuentran en zona de meta o de cumplimiento satisfactorio.'
                : overallQualityStatus === 'En riesgo'
                ? 'Se observan desviaciones en 2 o más indicadores. Requiere supervisión activa.'
                : 'Métricas por debajo del estándar crítico. Se recomienda intervención inmediata PHVA.'}
            </p>
          </div>
        </div>

        {/* Pending Claims Counter Card */}
        <div
          onClick={() => setActiveTab('reclamos')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reclamos Pendientes de Atención
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{pendingClaimsCount}</span>
              <span className="text-xs text-slate-500 font-medium">casos activos</span>
            </div>
            <p className="text-xs text-blue-900 font-bold mt-1 group-hover:underline flex items-center gap-1">
              <span>Gestionar en módulo de reclamos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 24h Overdue Claims Alert */}
        <div
          onClick={() => setActiveTab('reclamos')}
          className={`rounded-2xl p-5 border shadow-sm cursor-pointer transition-all flex items-center justify-between ${
            overdueClaimsCount > 0
              ? 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100/80 animate-pulse'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Alerta SLA Reclamos &gt; 24h
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black">
                {overdueClaimsCount}
              </span>
              <span className="text-xs font-semibold opacity-80">fuera de acuerdo</span>
            </div>
            <p className="text-xs font-medium mt-1">
              {overdueClaimsCount > 0
                ? '¡Atención requerida! Superaron el límite de 24 horas sin respuesta formal.'
                : 'Excelente: Todos los reclamos recibidos han sido atendidos oportunamente.'}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              overdueClaimsCount > 0 ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {overdueClaimsCount > 0 ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* 5 KPI Indicator Cards with Initial vs Current vs Target & Semáforo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-800">
            Los 5 Indicadores Estratégicos de GlobalTech
          </h3>
          <span className="text-xs text-slate-500">
            Haga clic en un indicador para graficar su evolución mensual
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {indicators.map((ind) => {
            const isSelected = selectedIndicatorForChart === ind.id;
            const diffFromInitial = ind.currentValue - ind.initialValue;
            const isImproving = ind.higherIsBetter
              ? diffFromInitial > 0
              : diffFromInitial < 0;

            return (
              <div
                key={ind.id}
                onClick={() => setSelectedIndicatorForChart(ind.id)}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-900 ring-2 ring-blue-900/10 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1" title={ind.name}>
                      {ind.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                        isImproving
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isImproving ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>
                        {Math.abs(diffFromInitial)}
                        {ind.unit}
                      </span>
                    </span>
                  </div>

                  {/* Current Value Display */}
                  <div className="my-2">
                    <div className="text-3xl font-black text-slate-900">
                      {ind.currentValue}
                      <span className="text-sm font-semibold text-slate-500 ml-1">
                        {ind.unit}
                      </span>
                    </div>
                  </div>

                  {/* Comparison Values */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl mb-3 border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Inicial (Crisis)</span>
                      <span className="font-bold text-slate-600">
                        {ind.initialValue}
                        {ind.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Meta Deseada</span>
                      <span className="font-bold text-blue-900">
                        {ind.targetValue}
                        {ind.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Semáforo */}
                <div className="pt-2 border-t border-slate-100">
                  <QualitySemaforo
                    current={ind.currentValue}
                    target={ind.targetValue}
                    unit={ind.unit}
                    higherIsBetter={ind.higherIsBetter}
                    warningThreshold={ind.warningThreshold}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Evolution Chart (Recharts) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Evolución Mensual (Histórico y Tendencia)
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeInd.name} ({activeInd.unit})
            </h3>
            <p className="text-xs text-slate-500">{activeInd.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Ver gráfica de:</span>
            <select
              value={selectedIndicatorForChart}
              onChange={(e) => setSelectedIndicatorForChart(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {indicators.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeInd.monthlyHistory}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                unit={activeInd.unit}
                domain={
                  activeInd.unit === '%'
                    ? [0, 100]
                    : ['auto', 'auto']
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} ${activeInd.unit}`, activeInd.name]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={`Valor mensual (${activeInd.unit})`}
                stroke="#1e3a8a"
                strokeWidth={3}
                dot={{ r: 5, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>Punto de partida: {activeInd.initialValue}{activeInd.unit}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
              <span>Valor actual: {activeInd.currentValue}{activeInd.unit}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Meta fijada: {activeInd.targetValue}{activeInd.unit}</span>
            </span>
          </div>

          <div className="text-slate-600 font-medium">
            Tendencia:{' '}
            <span className="font-bold text-emerald-700">
              {activeInd.higherIsBetter
                ? activeInd.currentValue >= activeInd.initialValue
                  ? 'Favorable (En recuperación)'
                  : 'Desfavorable'
                : activeInd.currentValue <= activeInd.initialValue
                ? 'Favorable (Reducción continua)'
                : 'Desfavorable'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Actualizar Indicadores */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Actualizar Indicadores de Calidad</h3>
              </div>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIndicators} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <p className="text-xs text-slate-500 mb-2">
                Modifique los valores actuales para evaluar cómo impacta de inmediato el semáforo y
                el estado general del sistema de calidad:
              </p>

              {indicators.map((ind) => (
                <div key={ind.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800">{ind.name}</label>
                    <span className="text-xs font-semibold text-slate-500">
                      Meta: {ind.targetValue}
                      {ind.unit}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max={ind.unit === '%' ? 100 : 200}
                      value={editValues[ind.id] ?? ind.currentValue}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [ind.id]: Number(e.target.value),
                        })
                      }
                      className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="text-xs font-semibold text-slate-600">{ind.unit}</span>

                    <input
                      type="range"
                      min={ind.unit === '%' ? 0 : 1}
                      max={ind.unit === '%' ? 100 : 72}
                      value={editValues[ind.id] ?? ind.currentValue}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [ind.id]: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-blue-900"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
