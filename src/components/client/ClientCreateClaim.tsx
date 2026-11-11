import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimCategory } from '../../types';
import confetti from 'canvas-confetti';
import {
  FileQuestion,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Mail,
  ArrowRight,
  Package,
} from 'lucide-react';

export const ClientCreateClaim: React.FC = () => {
  const { activeClient, clientOrders, addClaim, setActiveTab } = useApp();

  const [category, setCategory] = useState<ClaimCategory>('Retraso en entrega');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState(activeClient?.contactPerson || '');
  const [contactPhone, setContactPhone] = useState(activeClient?.phone || '');
  const [contactEmail, setContactEmail] = useState(activeClient?.email || '');

  useEffect(() => {
    if (activeClient) {
      setContactName(activeClient.contactPerson || '');
      setContactPhone(activeClient.phone || '');
      setContactEmail(activeClient.email || '');
    }
  }, [activeClient]);

  const [submittedTrackingNumber, setSubmittedTrackingNumber] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient || !description.trim() || !contactName.trim()) return;

    const matchedOrder = clientOrders.find((o) => o.id === selectedOrderId);

    const tracking = addClaim({
      clientId: activeClient.id,
      clientName: activeClient.name,
      orderId: matchedOrder?.id,
      orderNumber: matchedOrder?.orderNumber,
      category,
      description: description.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      isInternal: false,
      priority: 'Alta',
    });

    setSubmittedTrackingNumber(tracking);

    // Fire confetti for reassurance
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  const handleResetForm = () => {
    setSubmittedTrackingNumber(null);
    setDescription('');
    setSelectedOrderId('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Portal de Clientes • Radicación Directa</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Registrar Reclamo, Garantía o Novedad
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Complete los campos para radicar su solicitud y recibir una respuesta formal
            de nuestro equipo de Calidad en un plazo máximo de 24 horas.
          </p>
        </div>
      </div>

      {submittedTrackingNumber ? (
        /* Confirmation Screen */
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-lg text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-600/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Radicado con Éxito
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
            ¡Hemos recibido su solicitud formalmente!
          </h3>

          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            Su novedad ya ha sido ingresada en el sistema central de Calidad 360 y asignada al
            responsable del área correspondiente.
          </p>

          {/* Radicado Box */}
          <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 max-w-md mx-auto mb-6">
            <div className="text-xs uppercase font-bold text-slate-500 mb-1">
              Número Oficial de Seguimiento:
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-blue-900 tracking-wide">
              {submittedTrackingNumber}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center space-x-2 text-xs text-emerald-800 font-bold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Garantía de respuesta en menos de 24 horas hábiles</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('mis-reclamos')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Ver mis Reclamos y Respuestas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all"
            >
              Radicar otra novedad
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Commitment Reminder */}
          <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-900 mb-0.5">
                Compromiso de Excelencia y Servicio GlobalTech
              </span>
              <p className="text-emerald-800 leading-relaxed">
                Cada radicado es auditado directamente por el Gerente de Calidad. Si su reclamo supera
                24 horas sin respuesta formal, el sistema emite una alerta crítica automática a la
                gerencia general.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Tipo de Reclamo o Garantía *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClaimCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Retraso en entrega">1. Retraso en fecha prometida de entrega</option>
                <option value="Información poco clara">2. Información poco clara sobre la importación</option>
                <option value="Error en pedido">3. Error en referencia o cantidad de pedido</option>
                <option value="Garantía técnica">4. Garantía técnica / defecto de fábrica</option>
                <option value="Falla en empaque">5. Falla o deterioro en empaque y rotulado</option>
                <option value="Atención al cliente">6. Novedad en protocolo de atención o servicio</option>
                <option value="Otro">7. Otra solicitud o felicitación</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Pedido Relacionado (Opcional)
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Sin pedido específico / Consulta general --</option>
                {clientOrders.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    {ord.orderNumber} - {ord.description.slice(0, 45)}... ({ord.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Descripción Detallada de la Novedad *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Por favor describa con la mayor precisión posible qué sucedió, qué lote se vio afectado y cuál es su requerimiento..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                required
              />
            </div>

            {/* Contact details */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">
                Datos de Contacto para Respuesta Formal
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Persona de Contacto *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Teléfono / Celular *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-base shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              <Send className="w-5 h-5" />
              <span>Enviar Reclamo y Generar Radicado Oficial</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
