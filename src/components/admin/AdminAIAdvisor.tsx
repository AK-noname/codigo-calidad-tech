import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIAnalysisResult } from '../../types';
import {
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const AdminAIAdvisor: React.FC = () => {
  const {
    indicators,
    areas,
    phvaActions,
    claims,
    orders,
    overallQualityStatus,
    topPriorityAreas,
    overdueClaimsCount,
    setActiveTab,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Generate dynamic, realistic AI synthesis reading live data
  const generateAnalysis = () => {
    setIsLoading(true);

    setTimeout(() => {
      // Find indicators with negative trends
      const satInd = indicators.find((i) => i.id === 'ind-satisfaction');
      const retInd = indicators.find((i) => i.id === 'ind-returns');
      const timeInd = indicators.find((i) => i.id === 'ind-response-time');
      const turnoverInd = indicators.find((i) => i.id === 'ind-turnover');
      const renewalInd = indicators.find((i) => i.id === 'ind-renewal');

      const delayedOrders = orders.filter((o) => o.isDelayed || o.status === 'En aduana');
      const unclosedClaims = claims.filter((c) => c.status !== 'Cerrada');

      const priority1Area = topPriorityAreas[0]?.name || 'Servicio al Cliente';
      const priority2Area = topPriorityAreas[1]?.name || 'Logística y Despachos';

      const result: AIAnalysisResult = {
        overallStatus: overallQualityStatus,
        generatedAt: new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        summary: `Se evaluaron los 5 KPI estratégicos, ${areas.length} áreas operativas, ${orders.length} pedidos en tránsito y ${claims.length} reclamos. El sistema registra un estado general "${overallQualityStatus.toUpperCase()}". La satisfacción se sitúa en ${satInd?.currentValue}% (meta ${satInd?.targetValue}%) y el tiempo de respuesta promedio a quejas es de ${timeInd?.currentValue}h. Aunque hay recuperación frente al punto crítico inicial (${satInd?.initialValue}%), persisten fricciones entre la promesa comercial y la capacidad de nacionalización y despacho.`,
        priorities: [
          {
            title: `1. Intervención focal en ${priority1Area}`,
            description: `Es el área con mayor brecha respecto a la meta (Madurez ${topPriorityAreas[0]?.currentMaturity}/5 vs ${topPriorityAreas[0]?.targetMaturity}/5). "${topPriorityAreas[0]?.detectedWeakness}" está impactando la percepción del cliente final.`,
            urgency: 'Urgente',
          },
          {
            title: `2. Erradicación de demoras > 24h en Reclamos`,
            description: `Actualmente hay ${overdueClaimsCount} reclamo(s) que superan el límite de 24 horas sin respuesta formal. Si no se responde oportunamente, la tasa de devoluciones (${retInd?.currentValue}%) y la pérdida de contratos (${renewalInd?.currentValue}% actual vs 90% meta) continuarán en zona de alerta.`,
            urgency: overdueClaimsCount > 0 ? 'Alta' : 'Moderada',
          },
          {
            title: `3. Blindaje Operativo en Importaciones y Aduana (${priority2Area})`,
            description: `Existen pedidos en fase crítica de nacionalización o tránsito aduanero. Se requiere formalizar la validación de inventario antes de que el equipo comercial emita ofertas vinculantes.`,
            urgency: 'Alta',
          },
        ],
        suggestedActions: [
          {
            action: 'Despliegue de mesa de validación conjunta Comercial-Logística diaria a las 8:00 AM.',
            area: 'Comercial y Logística',
            responsible: 'Santiago Morales & Diana Pineda',
            expectedImpact: 'Reduce devoluciones al 8% y elimina pedidos con fechas inviables.',
          },
          {
            action: 'Automatización de notificaciones proactivas de levante aduanero por correo y portal.',
            area: 'Sistemas & Comex',
            responsible: 'Camila Echeverri & Valentina Hoyos',
            expectedImpact: 'Disminuye llamadas de consulta en un 40% y sube CSAT a >85%.',
          },
          {
            action: 'Plan de incentivos y retención ligado a cero no conformidades en bodega.',
            area: 'Gestión del Talento Humano',
            responsible: 'Andrés Felipe Correa',
            expectedImpact: 'Baja rotación del 9% al 5% y reduce errores de rotulado y empaque.',
          },
        ],
        risksOfInaction: [
          `Pérdida de renovación en contratos institucionales clave como colegios y cadenas minoristas (riesgo estimado en $450M COP).`,
          `Sobrecosto del 15% por transporte aéreo urgente para mitigar retrasos generados en aduana no advertidos a tiempo.`,
          `Desgaste y rotación continua del personal de atención al cliente debido a quejas repetitivas sin solución de fondo.`,
          `Deterioro de la reputación de marca como importador confiable en el mercado colombiano frente a competidores directos.`,
        ],
      };

      setAnalysisResult(result);
      setIsLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 6 • Asistente de Mejora e Inteligencia de Calidad</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Diagnóstico Integral Asistido por IA</span>
            <span className="text-xs bg-indigo-100 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
              Calidad 360 AI
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Presione el botón para auditar en tiempo real los indicadores, brechas de
            madurez, cuellos de botella en pedidos y riesgos de no actuar.
          </p>
        </div>

        <button
          onClick={generateAnalysis}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 hover:from-blue-800 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-900/20 hover:shadow-xl transition-all disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <Sparkles className={`w-5 h-5 text-indigo-200 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analizando datos...' : 'Analizar la Calidad'}</span>
        </button>
      </div>

      {!analysisResult && !isLoading && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            El motor de Inteligencia de Calidad está listo
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Al presionar <strong>"Analizar la Calidad"</strong>, el asistente cruzará los 5 indicadores
            estratégicos, los reclamos no resueltos, las debilidades organizacionales y el avance del
            ciclo PHVA para ofrecerle una hoja de ruta ejecutiva.
          </p>
          <button
            onClick={generateAnalysis}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Ejecutar análisis ahora</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-2xl p-16 border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h4 className="font-bold text-slate-800 text-sm">
            Correlacionando trazabilidad de pedidos, reclamos y metas PHVA...
          </h4>
          <p className="text-xs text-slate-400 mt-1">Generando informe ejecutivo de calidad</p>
        </div>
      )}

      {analysisResult && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    Dictamen Ejecutivo de Calidad
                  </span>
                  <h3 className="text-lg font-bold">Resumen de Situación Organizacional</h3>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Generado a las: {analysisResult.generatedAt}
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {analysisResult.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-300">
                Estado Actual:{' '}
                <strong
                  className={
                    analysisResult.overallStatus === 'Bueno'
                      ? 'text-emerald-400'
                      : analysisResult.overallStatus === 'En riesgo'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }
                >
                  {analysisResult.overallStatus}
                </strong>
              </span>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-300">
                Reclamos sin cerrar:{' '}
                <strong className="text-amber-400">
                  {claims.filter((c) => c.status !== 'Cerrada').length}
                </strong>
              </span>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10 text-slate-300">
                Acciones PHVA activas:{' '}
                <strong className="text-blue-300">{phvaActions.length}</strong>
              </span>
            </div>
          </div>

          {/* 3 Key Priorities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Las 3 Prioridades Estratégicas Inmediatas</span>
              </h3>
              <span className="text-xs text-slate-500">Orden de criticidad operativa</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.priorities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        Prioridad #{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.urgency === 'Urgente'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : item.urgency === 'Alta'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mb-1.5">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Suggested Actions with Area & Responsible */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>3 Acciones Sugeridas con Responsable Designado</span>
              </h3>
              <button
                onClick={() => setActiveTab('phva')}
                className="text-xs text-blue-900 font-bold hover:underline flex items-center gap-1"
              >
                <span>Incorporar al tablero PHVA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.suggestedActions.map((sug, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {sug.area}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-2 leading-snug">
                      {sug.action}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="text-slate-600">
                      Responsable:{' '}
                      <strong className="text-slate-900">{sug.responsible}</strong>
                    </div>
                    <div className="text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-medium text-[11px]">
                      Impacto esperado: {sug.expectedImpact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks of Inaction */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-3">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base text-rose-950">
                Riesgos Financieros y Reputacionales de No Actuar
              </h3>
            </div>
            <p className="text-xs text-rose-800 mb-4">
              Con base en los datos históricos cuando la satisfacción cayó al 74% y las devoluciones
              subieron al 18%:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-800">
              {analysisResult.risksOfInaction.map((risk, idx) => (
                <li
                  key={idx}
                  className="bg-white/80 border border-rose-200/80 p-3 rounded-xl flex items-start space-x-2"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[11px] shrink-0 flex items-center justify-center mt-0.5">
                    !
                  </span>
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
