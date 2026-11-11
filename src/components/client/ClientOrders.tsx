import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../common/StatusBadge';
import {
  Package,
  Calendar,
  AlertCircle,
  Truck,
  Ship,
  Warehouse,
  CheckCircle2,
  FileCheck,
  Building2,
  ArrowRight,
  Clock,
  MapPin,
  FileQuestion,
} from 'lucide-react';

export const ClientOrders: React.FC = () => {
  const { clientOrders, activeClient, setActiveTab } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    clientOrders.length > 0 ? clientOrders[0] : null
  );

  useEffect(() => {
    setSelectedOrder(clientOrders.length > 0 ? clientOrders[0] : null);
  }, [clientOrders]);

  const steps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    {
      status: 'Validado',
      label: 'Validado',
      icon: FileCheck,
      desc: 'Factibilidad logística y stock verificado',
    },
    {
      status: 'En importación',
      label: 'En importación',
      icon: Ship,
      desc: 'Tránsito marítimo / aéreo internacional',
    },
    {
      status: 'En aduana',
      label: 'En aduana',
      icon: Clock,
      desc: 'Inspección y nacionalización DIAN',
    },
    {
      status: 'En bodega',
      label: 'En bodega',
      icon: Warehouse,
      desc: 'Inspección técnica y rotulado final',
    },
    {
      status: 'Despachado',
      label: 'Despachado',
      icon: Truck,
      desc: 'En ruta a la sede de su empresa',
    },
    {
      status: 'Entregado',
      label: 'Entregado',
      icon: CheckCircle2,
      desc: 'Entregado a entera satisfacción',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    return steps.findIndex((s) => s.status === status);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Portal de Clientes • Trazabilidad 360</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Mis Pedidos y Estado de Importación
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Consulte el avance paso a paso de sus pedidos de importación y las fechas
            estimadas de entrega en su sede.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('registrar-reclamo')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <FileQuestion className="w-4 h-4" />
          <span>Reportar Novedad sobre un Pedido</span>
        </button>
      </div>

      {clientOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No registra pedidos activos en este momento
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Aún no registra pedidos de importación en curso. Cuando su orden sea emitida y validada
            operativamente por GlobalTech, podrá realizar el seguimiento detallado en tiempo real desde este módulo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List Sidebar */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-700">
              Seleccione un pedido ({clientOrders.length} registrados):
            </h3>

            {clientOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              const isPastPromised =
                order.status !== 'Entregado' &&
                (order.isDelayed || order.promisedDate < todayStr);

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.orderNumber}
                    </span>

                    <OrderStatusBadge status={order.status} isDelayed={isPastPromised} />
                  </div>

                  <h4
                    className={`font-bold text-sm mb-2 line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {order.description}
                  </h4>

                  <div
                    className={`flex items-center justify-between text-xs pt-2 border-t ${
                      isSelected ? 'border-white/10 text-blue-200' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span>Fecha de entrega:</span>
                    <span
                      className={`font-bold ${
                        isPastPromised && !isSelected ? 'text-rose-600' : ''
                      }`}
                    >
                      {order.promisedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Detail & Timeline */}
          <div className="lg:col-span-7">
            {selectedOrder && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                {/* Header */}
                <div className="pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                        Detalle del Pedido
                      </span>
                      <span className="font-mono text-base font-black text-blue-900">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>

                    <OrderStatusBadge
                      status={selectedOrder.status}
                      isDelayed={
                        selectedOrder.status !== 'Entregado' &&
                        (selectedOrder.isDelayed || selectedOrder.promisedDate < todayStr)
                      }
                    />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedOrder.description}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Cliente consignado: {selectedOrder.clientName} ({activeClient?.nit})
                  </p>
                </div>

                {/* Delay Warning Banner if applicable */}
                {selectedOrder.status !== 'Entregado' &&
                  (selectedOrder.isDelayed || selectedOrder.promisedDate < todayStr) && (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-xs text-amber-900">
                          Aviso de Novedad Operativa en Tránsito
                        </h4>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                          Este pedido presenta un ajuste en el tiempo de nacionalización aduanera o
                          bodega. Nuestro equipo de Calidad ya activó el plan de entrega prioritaria
                          para remitirlo a su sede en el menor tiempo posible.
                        </p>
                      </div>
                    </div>
                  )}

                {/* Timeline Stepper */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Línea de Tiempo de Trazabilidad
                  </h4>

                  <div className="space-y-4">
                    {steps.map((step, idx) => {
                      const currentIdx = getStepIndex(selectedOrder.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.status} className="flex items-start space-x-4 relative">
                          {/* Connector line */}
                          {idx < steps.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 -bottom-4 w-0.5 ${
                                idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            />
                          )}

                          {/* Node Icon */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                              isCurrent
                                ? 'bg-blue-900 text-white ring-4 ring-blue-100 shadow-md'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-300'
                            }`}
                          >
                            <StepIcon className="w-4 h-4" />
                          </div>

                          {/* Node text */}
                          <div className="flex-1 pb-2">
                            <div className="flex items-center justify-between">
                              <h5
                                className={`text-sm font-bold ${
                                  isCurrent
                                    ? 'text-blue-950 font-black'
                                    : isCompleted
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </h5>

                              {isCurrent && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                                  Etapa Actual
                                </span>
                              )}
                              {isCompleted && !isCurrent && (
                                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Completado</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Info Box */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">País de Origen</span>
                    <strong className="text-slate-800">{selectedOrder.originCountry}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Punto de Entrada Aduanero</span>
                    <strong className="text-slate-800">{selectedOrder.customsPort}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Fecha Prometida de Entrega</span>
                    <strong className="text-blue-900">{selectedOrder.promisedDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Cantidad de Artículos</span>
                    <strong className="text-slate-800">{selectedOrder.itemsCount} unidades</strong>
                  </div>
                </div>

                {selectedOrder.trackingNotes && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950">
                    <span className="font-bold block mb-0.5">Nota del Operador Logístico:</span>
                    <p className="text-slate-700">{selectedOrder.trackingNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
