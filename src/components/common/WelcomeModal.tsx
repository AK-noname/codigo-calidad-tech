import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Package,
  FileQuestion,
  Headphones,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

interface WelcomeModalProps {
  onClose?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const { role, hasSeenWelcome, setHasSeenWelcome, activeClient } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (hasSeenWelcome && !onClose) return null;

  const adminSteps = [
    {
      title: '1. Diagnóstico y Semáforo de Indicadores',
      description:
        'Visualiza el estado general de calidad calculado automáticamente a partir de 5 indicadores estratégicos (CSAT, devoluciones, tiempos de respuesta, rotación y contratos).',
      icon: TrendingUp,
      color: 'bg-blue-600',
    },
    {
      title: '2. Mejora Continua PHVA y Trazabilidad',
      description:
        'Gestiona acciones correctivas organizadas en el ciclo PHVA (Planear, Hacer, Verificar, Actuar) y controla que ningún pedido se confirme sin validación operativa previa.',
      icon: RotateCcw,
      color: 'bg-indigo-600',
    },
    {
      title: '3. Atención Rápida y Asistente con IA',
      description:
        'Responde reclamos en menos de 24 horas para cumplir los acuerdos de servicio y genera diagnósticos inteligentes con prioridades y riesgos de inacción.',
      icon: Sparkles,
      color: 'bg-emerald-600',
    },
  ];

  const clientSteps = [
    {
      title: '1. Trazabilidad Total de sus Pedidos',
      description:
        'Consulte en tiempo real la ruta exacta de sus importaciones: desde validación, puerto aduanero y bodega hasta entrega final en su sede.',
      icon: Package,
      color: 'bg-blue-600',
    },
    {
      title: '2. Radicación de Reclamos y Garantías',
      description:
        'Formulario ágil de 1 minuto para reportar novedades. Obtenga de inmediato su número de radicado oficial (RC-XXXX).',
      icon: FileQuestion,
      color: 'bg-amber-600',
    },
    {
      title: '3. Compromiso de Atención en <24 Horas',
      description:
        'Nuestro equipo de Calidad y Servicio le responderá formalmente con acciones correctivas y seguimiento transparente.',
      icon: Headphones,
      color: 'bg-emerald-600',
    },
  ];

  const steps = role === 'admin' ? adminSteps : clientSteps;
  const current = steps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setHasSeenWelcome(true);
      if (onClose) onClose();
    }
  };

  const handleSkip = () => {
    setHasSeenWelcome(true);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-300 font-bold">
                {role === 'admin' ? 'Portal de Calidad y Operaciones' : 'Portal de Clientes'}
              </span>
              <h2 className="text-xl font-bold">
                {role === 'admin'
                  ? 'Bienvenido a Calidad 360'
                  : `Bienvenido, ${activeClient?.name || 'Cliente'}`}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Importadora GlobalTech S.A.S. • Excelencia operativa y compromiso en cada entrega
          </p>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex-1">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((_, idx) => (
              <div key={idx} className="flex-1 flex items-center">
                <button
                  onClick={() => setCurrentStep(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    idx === currentStep
                      ? 'bg-blue-900 text-white shadow-md scale-110'
                      : idx < currentStep
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      idx < currentStep ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Card */}
          <div className="text-center py-2">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-5 ${current.color}`}
            >
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{current.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {current.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2"
          >
            Omitir guía
          </button>
          <button
            onClick={handleNext}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>{currentStep === steps.length - 1 ? '¡Comenzar ahora!' : 'Siguiente paso'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
