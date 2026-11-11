import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../common/StatusBadge';
import {
  Truck,
  Plus,
  Calendar,
  AlertCircle,
  CheckSquare,
  Square,
  Search,
  Filter,
  Ship,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  FileCheck,
  Building,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, addOrder, clients, showToast } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Edit form state
  const [editStatus, setEditStatus] = useState<OrderStatus>('Validado');
  const [editPromisedDate, setEditPromisedDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editValidated, setEditValidated] = useState(true);

  // Create form state
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newDescription, setNewDescription] = useState('');
  const [newItemsCount, setNewItemsCount] = useState(25);
  const [newTotalValue, setNewTotalValue] = useState(45000000);
  const [newPromisedDate, setNewPromisedDate] = useState(
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newOriginCountry, setNewOriginCountry] = useState('Corea del Sur');
  const [newCustomsPort, setNewCustomsPort] = useState('Puerto de Buenaventura');
  const [newOperationallyValidated, setNewOperationallyValidated] = useState(false);
  const [newValidationNotes, setNewValidationNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleOpenEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPromisedDate(order.promisedDate);
    setEditNotes(order.trackingNotes || '');
    setEditValidated(order.operationallyValidated);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Check mandatory operational validation if advancing beyond "Validado"
    if (editStatus !== 'Validado' && !editValidated) {
      showToast(
        '¡Bloqueo de Calidad! No puede despachar o avanzar el pedido sin validación operativa obligatoria.',
        'error'
      );
      return;
    }

    updateOrderStatus(
      selectedOrder.id,
      editStatus,
      editPromisedDate,
      editNotes,
      editValidated
    );

    setShowEditModal(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newOperationallyValidated) {
      showToast(
        '¡Atención! La política de Calidad 360 exige marcar la validación operativa previa antes de crear el pedido.',
        'warning'
      );
      return;
    }

    const client = clients.find((c) => c.id === newClientId) || (clients.length > 0 ? clients[0] : null);
    if (!client) {
      showToast('Debe registrar al menos una empresa cliente en el Directorio antes de crear un pedido.', 'error');
      return;
    }

    addOrder({
      clientId: client.id,
      clientName: client.name,
      description: newDescription.trim(),
      itemsCount: Number(newItemsCount),
      totalValueCOP: Number(newTotalValue),
      status: 'Validado',
      orderDate: todayStr,
      promisedDate: newPromisedDate,
      operationallyValidated: true,
      validatedBy: 'Ing. Mateo Zuluaga (Validación Operativa Calidad)',
      originCountry: newOriginCountry,
      customsPort: newCustomsPort,
      trackingNotes: newValidationNotes.trim() || 'Pedido verificado con stock y aduana sin novedades.',
      isDelayed: false,
    });

    setNewDescription('');
    setNewOperationallyValidated(false);
    setShowCreateModal(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.originCountry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 5 • Pedidos y Trazabilidad Operativa</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Trazabilidad de Importaciones y Control de Despachos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Valide operativamente la factibilidad de entrega antes de avanzar estados y
            mantenga actualizada la fecha prometida para prevenir retrasos.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Pedido Validado</span>
        </button>
      </div>

      {/* Operational Protocol Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start space-x-3 shadow-sm">
        <FileCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-900 block mb-0.5">
            Regla de Calidad Obligatoria: Cero Promesas sin Validación Operativa
          </span>
          <p className="text-blue-800 leading-relaxed">
            Para erradicar la desarticulación entre Comercial y Logística, ningún pedido puede ser
            despachado ni comprometido con el cliente sin que la casilla de "Validado operativamente"
            esté debidamente verificada por el equipo de compras y almacén.
          </p>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de pedido, cliente o país..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Filtrar por etapa:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las etapas ({orders.length})</option>
              <option value="Validado">Validado</option>
              <option value="En importación">En importación</option>
              <option value="En aduana">En aduana</option>
              <option value="En bodega">En bodega</option>
              <option value="Despachado">Despachado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
        </div>

        {/* Orders list */}
        <div className="divide-y divide-slate-100">
          {filteredOrders.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No se encontraron pedidos con los filtros actuales.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPastPromised =
                order.status !== 'Entregado' &&
                (order.isDelayed || order.promisedDate < todayStr);

              return (
                <div
                  key={order.id}
                  className={`p-5 transition-colors ${
                    isPastPromised ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Top tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-sm text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                          {order.orderNumber}
                        </span>

                        <OrderStatusBadge status={order.status} isDelayed={isPastPromised} />

                        {order.operationallyValidated ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Validado Operativamente</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Falta Validación Operativa</span>
                          </span>
                        )}
                      </div>

                      {/* Client and summary */}
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{order.clientName}</h4>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                          {order.description}
                        </p>
                      </div>

                      {/* Route & logistics info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Ship className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Origen: <strong>{order.originCountry}</strong>
                          </span>
                        </span>

                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Punto de Entrada: <strong>{order.customsPort}</strong>
                          </span>
                        </span>

                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className={isPastPromised ? 'text-rose-600 font-black' : ''}>
                            Fecha Prometida: {order.promisedDate}
                          </span>
                        </span>

                        <span>
                          Valor COP:{' '}
                          <strong className="text-slate-800">
                            ${order.totalValueCOP.toLocaleString('es-CO')}
                          </strong>
                        </span>
                      </div>

                      {order.trackingNotes && (
                        <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                          <strong className="text-slate-800">Última novedad de trazabilidad:</strong>{' '}
                          {order.trackingNotes}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="shrink-0 flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(order)}
                        className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Actualizar Trazabilidad
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Actualizar Trazabilidad de Pedido */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-300 font-mono font-bold">
                  {selectedOrder.orderNumber}
                </div>
                <h3 className="font-bold text-base">Actualizar Trazabilidad y Estado</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-0.5">
                  Cliente: {selectedOrder.clientName}
                </span>
                <p className="text-slate-600">{selectedOrder.description}</p>
              </div>

              {/* Casilla obligatoria: Validado operativamente */}
              <div
                onClick={() => setEditValidated(!editValidated)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                  editValidated
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="mt-0.5">
                  {editValidated ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-rose-500" />
                  )}
                </div>
                <div>
                  <span className="font-extrabold text-xs block">
                    Validado Operativamente (Requisito Obligatorio)
                  </span>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
                    Confirmo que se verificó capacidad en almacén, itinerario de aduana y flota de transporte.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Estado en la Cadena Logística
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Validado">1. Validado</option>
                    <option value="En importación">2. En importación</option>
                    <option value="En aduana">3. En aduana</option>
                    <option value="En bodega">4. En bodega</option>
                    <option value="Despachado">5. Despachado</option>
                    <option value="Entregado">6. Entregado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Fecha Prometida de Entrega
                  </label>
                  <input
                    type="date"
                    value={editPromisedDate}
                    onChange={(e) => setEditPromisedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nota de Trazabilidad (Visible para el Cliente)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Ej: Carga arribó a puerto Buenaventura, inspección DIAN programada..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Guardar Trazabilidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Nuevo Pedido */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Crear Nuevo Pedido de Importación</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Cliente Destinatario *
                </label>
                {clients.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                    No hay empresas clientes registradas aún en el sistema. Registre una empresa en el "Directorio de Clientes" antes de crear un pedido.
                  </div>
                ) : (
                  <select
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code} - {c.city})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Descripción de Equipos / Mercancía *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  placeholder="Ej: 50 Monitores Interactivos 4K para laboratorios..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Cantidad de Unidades
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemsCount}
                    onChange={(e) => setNewItemsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Valor Total (COP)
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    value={newTotalValue}
                    onChange={(e) => setNewTotalValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    País de Origen
                  </label>
                  <input
                    type="text"
                    value={newOriginCountry}
                    onChange={(e) => setNewOriginCountry(e.target.value)}
                    placeholder="Ej: Corea del Sur"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Fecha Prometida de Entrega *
                  </label>
                  <input
                    type="date"
                    value={newPromisedDate}
                    onChange={(e) => setNewPromisedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Puerto o Aeropuerto de Entrada
                </label>
                <input
                  type="text"
                  value={newCustomsPort}
                  onChange={(e) => setNewCustomsPort(e.target.value)}
                  placeholder="Ej: Puerto de Buenaventura / El Dorado"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Casilla obligatoria: Validado operativamente */}
              <div
                onClick={() => setNewOperationallyValidated(!newOperationallyValidated)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                  newOperationallyValidated
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="mt-0.5">
                  {newOperationallyValidated ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-rose-500" />
                  )}
                </div>
                <div>
                  <span className="font-extrabold text-xs block">
                    Validado Operativamente (Casilla Obligatoria de Calidad 360)
                  </span>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
                    Certifico que el área logística y comex revisaron el plazo antes de emitir la orden.
                  </p>
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
                  Confirmar y Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
