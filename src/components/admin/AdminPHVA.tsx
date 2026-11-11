import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PHVAStage, PHVAAction } from '../../types';
import {
  Kanban,
  Plus,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Trash2,
  TrendingUp,
  X,
  Clock,
  Layers,
} from 'lucide-react';

export const AdminPHVA: React.FC = () => {
  const {
    phvaActions,
    addPHVAAction,
    updatePHVAStage,
    updatePHVAProgress,
    deletePHVAAction,
    indicators,
    areas,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStage, setNewStage] = useState<PHVAStage>('Planear');
  const [newArea, setNewArea] = useState(areas[0]?.name || 'Comercial y Ventas');
  const [newResponsible, setNewResponsible] = useState('');
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newIndicatorId, setNewIndicatorId] = useState(indicators[0]?.id || 'ind-satisfaction');
  const [newProgress, setNewProgress] = useState(0);

  const stages: { stage: PHVAStage; name: string; letter: string; color: string; bg: string }[] = [
    {
      stage: 'Planear',
      name: 'Planear (P)',
      letter: 'P',
      color: 'border-blue-500 text-blue-900',
      bg: 'bg-blue-50/60',
    },
    {
      stage: 'Hacer',
      name: 'Hacer (H)',
      letter: 'H',
      color: 'border-amber-500 text-amber-900',
      bg: 'bg-amber-50/60',
    },
    {
      stage: 'Verificar',
      name: 'Verificar (V)',
      letter: 'V',
      color: 'border-purple-500 text-purple-900',
      bg: 'bg-purple-50/60',
    },
    {
      stage: 'Actuar',
      name: 'Actuar (A)',
      letter: 'A',
      color: 'border-emerald-500 text-emerald-900',
      bg: 'bg-emerald-50/60',
    },
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newResponsible.trim()) return;

    addPHVAAction({
      title: newTitle.trim(),
      description: newDescription.trim(),
      stage: newStage,
      area: newArea,
      responsible: newResponsible.trim(),
      deadline: newDeadline,
      targetIndicatorId: newIndicatorId,
      progressPercentage: Number(newProgress),
    });

    setNewTitle('');
    setNewDescription('');
    setNewResponsible('');
    setNewProgress(0);
    setShowCreateModal(false);
  };

  const getStageIndex = (stage: PHVAStage) => {
    return stages.findIndex((s) => s.stage === stage);
  };

  const moveAction = (action: PHVAAction, direction: 'prev' | 'next') => {
    const currentIndex = getStageIndex(action.stage);
    if (direction === 'prev' && currentIndex > 0) {
      updatePHVAStage(action.id, stages[currentIndex - 1].stage);
    } else if (direction === 'next' && currentIndex < stages.length - 1) {
      updatePHVAStage(action.id, stages[currentIndex + 1].stage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 3 • Mejora Continua PHVA</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Tablero de Acciones Correctivas (Ciclo PHVA)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Mueva las acciones entre las columnas de Planear, Hacer, Verificar y
            Actuar según su avance y vigile las alertas de fechas vencidas.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva acción PHVA</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {stages.map((col, colIdx) => {
          const colActions = phvaActions.filter((a) => a.stage === col.stage);

          return (
            <div
              key={col.stage}
              className={`rounded-2xl border ${col.color.split(' ')[0]} ${col.bg} p-4 shadow-sm min-h-[550px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-7 h-7 rounded-xl font-black text-sm flex items-center justify-center text-white ${
                      col.stage === 'Planear'
                        ? 'bg-blue-600'
                        : col.stage === 'Hacer'
                        ? 'bg-amber-600'
                        : col.stage === 'Verificar'
                        ? 'bg-purple-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {col.letter}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{col.name}</h3>
                    <span className="text-[11px] text-slate-500">
                      {colActions.length} {colActions.length === 1 ? 'acción' : 'acciones'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colActions.length === 0 ? (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                    Sin acciones en esta etapa actualmente
                  </div>
                ) : (
                  colActions.map((action) => {
                    const isOverdue = action.deadline < todayStr && action.progressPercentage < 100;
                    const targetInd = indicators.find((i) => i.id === action.targetIndicatorId);

                    return (
                      <div
                        key={action.id}
                        className={`bg-white rounded-xl p-4 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                          isOverdue ? 'border-rose-400 ring-2 ring-rose-300/40' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {action.code}
                            </span>

                            {isOverdue ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                                <AlertCircle className="w-3 h-3" />
                                <span>VENCIDA</span>
                              </span>
                            ) : action.progressPercentage === 100 ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Completada</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">En curso</span>
                            )}
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                            {action.title}
                          </h4>

                          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                            {action.description}
                          </p>

                          {/* Impact indicator badge */}
                          {targetInd && (
                            <div className="mb-3 text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center space-x-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="text-slate-600">
                                Impacta:{' '}
                                <strong className="text-slate-900">{targetInd.name}</strong>
                              </span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                            <div className="flex items-center space-x-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">
                                <strong>{action.responsible}</strong> ({action.area})
                              </span>
                            </div>

                            <div
                              className={`flex items-center space-x-1.5 font-semibold ${
                                isOverdue ? 'text-rose-600' : 'text-slate-600'
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              <span>Límite: {action.deadline}</span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs font-bold mb-1">
                              <span className="text-slate-500">Avance</span>
                              <span className="text-blue-900">{action.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  action.progressPercentage === 100
                                    ? 'bg-emerald-500'
                                    : action.progressPercentage > 50
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${action.progressPercentage}%` }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={action.progressPercentage}
                              onChange={(e) =>
                                updatePHVAProgress(action.id, Number(e.target.value))
                              }
                              className="w-full mt-1.5 accent-blue-900"
                              title="Ajustar avance de la acción"
                            />
                          </div>
                        </div>

                        {/* Navigation between Kanban columns */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            disabled={colIdx === 0}
                            onClick={() => moveAction(action, 'prev')}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none"
                            title="Mover a etapa anterior"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => deletePHVAAction(action.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Eliminar acción"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={colIdx === stages.length - 1}
                            onClick={() => moveAction(action, 'next')}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none"
                            title="Mover a siguiente etapa"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Crear Nueva Acción PHVA */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Kanban className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Registrar Nueva Acción de Mejora PHVA</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Título de la Acción *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Implementar doble validación de empaque"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Descripción Detallada *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  placeholder="Detalle el procedimiento, herramientas y objetivo de mejora..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Etapa Inicial PHVA
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as PHVAStage)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planear">Planear (P)</option>
                    <option value="Hacer">Hacer (H)</option>
                    <option value="Verificar">Verificar (V)</option>
                    <option value="Actuar">Actuar (A)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Área Responsable
                  </label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Líder Responsable *
                  </label>
                  <input
                    type="text"
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    placeholder="Ej: Ing. Carlos Ospina"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Fecha Límite *
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Indicador que Impacta
                  </label>
                  <select
                    value={newIndicatorId}
                    onChange={(e) => setNewIndicatorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {indicators.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Porcentaje de Avance ({newProgress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="w-full mt-2 accent-blue-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Crear acción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
