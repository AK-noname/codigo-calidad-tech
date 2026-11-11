import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  AlertTriangle,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  User,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export const AdminDiagnosis: React.FC = () => {
  const { areas, updateAreaMaturity, topPriorityAreas, setActiveTab } = useApp();

  // Radar data format
  const radarData = areas.map((a) => ({
    area: a.name.length > 15 ? a.name.split(' ')[0] : a.name,
    fullName: a.name,
    Actual: a.currentMaturity,
    Meta: a.targetMaturity,
    Brecha: a.targetMaturity - a.currentMaturity,
  }));

  const maturityLabels = [
    '',
    '1: Inicial / Reactivo',
    '2: Gestionado Básico',
    '3: Estandarizado',
    '4: Medido y Predecible',
    '5: Optimizado / Excelencia',
  ];

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 2 • Diagnóstico Organizacional</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Diagnóstico de Madurez Operativa por Áreas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Ajuste los niveles de madurez (1 a 5) de cada área y enfoque los recursos
            del plan PHVA en las 2 prioridades críticas con mayor brecha.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('phva')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md shrink-0 transition-all"
        >
          <span>Ir al Plan de Mejora PHVA</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Section: Highlight 2 Priorities with Largest Gaps */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Flame className="w-5 h-5 text-rose-600 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900">
            Las 2 Prioridades Críticas de Intervención (Mayor Brecha vs Meta)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPriorityAreas.map((area, index) => {
            const gap = area.targetMaturity - area.currentMaturity;
            return (
              <div
                key={area.id}
                className="bg-rose-50/70 border-2 border-rose-300 rounded-2xl p-5 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base">{area.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-200 text-rose-900 border border-rose-300">
                    Brecha: {gap} niveles
                  </span>
                </div>

                <div className="bg-white/80 rounded-xl p-3 border border-rose-200 mb-3 text-xs">
                  <span className="font-bold text-rose-900 block mb-0.5">Debilidad Detectada:</span>
                  <p className="text-slate-700 leading-relaxed italic">"{area.detectedWeakness}"</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-rose-200/60">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{area.leader}</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    Nivel Actual: <span className="text-rose-600 font-black">{area.currentMaturity}/5</span> → Meta:{' '}
                    <span className="text-emerald-700 font-black">{area.targetMaturity}/5</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Radar Chart & 6 Areas Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-slate-900">
                Gráfico de Radar: Actual vs Meta
              </h3>
              <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                Escala 1 a 5
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Comparativa visual de madurez entre el estado de partida y la meta de excelencia.
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="area" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94a3b8" />
                <Radar
                  name="Nivel Actual"
                  dataKey="Actual"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Nivel Meta"
                  dataKey="Meta"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            El polígono rojo indica la situación real; el polígono verde representa el objetivo
            del sistema de gestión de calidad GlobalTech 360.
          </div>
        </div>

        {/* 6 Areas Interactive Cards & Sliders */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Evaluación y Nivel de Madurez por Área (1 a 5)
            </h3>
            <span className="text-xs text-slate-400">Deslice o presione para ajustar</span>
          </div>

          {areas.map((area) => {
            const gap = area.targetMaturity - area.currentMaturity;
            const isTopPriority = topPriorityAreas.some((tp) => tp.id === area.id);

            return (
              <div
                key={area.id}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  isTopPriority
                    ? 'border-amber-400/80 shadow-sm bg-gradient-to-r from-white to-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{area.name}</span>
                    {isTopPriority && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        Prioridad Alta
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    Responsable: <span className="text-slate-800">{area.leader.split('(')[0]}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-3 italic">
                  "{area.detectedWeakness}"
                </p>

                {/* Maturity Selector Buttons (1 to 5) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700">
                    Nivel actual:{' '}
                    <span className="text-blue-900 font-extrabold text-sm">
                      {area.currentMaturity} / 5
                    </span>{' '}
                    <span className="text-[11px] font-normal text-slate-500">
                      ({maturityLabels[area.currentMaturity]})
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isSelected = area.currentMaturity === lvl;
                      const isTarget = area.targetMaturity === lvl;

                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateAreaMaturity(area.id, lvl)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative ${
                            isSelected
                              ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/30'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          title={`Fijar madurez en nivel ${lvl}`}
                        >
                          {lvl}
                          {isTarget && (
                            <span
                              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"
                              title="Nivel Meta"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
