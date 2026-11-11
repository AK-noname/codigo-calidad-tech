import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientProfile } from '../../types';
import { ClientRegistrationModal } from '../common/ClientRegistrationModal';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Trash2,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Package,
  AlertTriangle,
  FileText,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const AdminClientsList: React.FC = () => {
  const { clients, orders, claims, deleteClient, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientProfile | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesCity = filterCity === 'all' || client.city === filterCity;
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleDeleteConfirm = () => {
    if (!clientToDelete) return;
    deleteClient(clientToDelete.id);
    setClientToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>Módulo 6 • Directorio y Control de Clientes</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Directorio Oficial de Empresas Clientes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Supervise todas las empresas clientes registradas, sus códigos
            institucionales, canales de contacto y operaciones asociadas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Empresa</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Empresas Registradas
            </span>
            <span className="text-2xl font-black text-slate-900">{clients.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Pedidos Emitidos
            </span>
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Reclamos Recibidos
            </span>
            <span className="text-2xl font-black text-slate-900">{claims.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por razón social, NIT, código o ciudad..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Ciudad:</span>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas ({clients.length})</option>
              <option value="Bogotá">Bogotá</option>
              <option value="Medellín">Medellín</option>
              <option value="Cali">Cali</option>
              <option value="Barranquilla">Barranquilla</option>
              <option value="Bucaramanga">Bucaramanga</option>
            </select>
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No hay empresas clientes registradas
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Las empresas clientes pueden registrarse de manera autónoma desde la pantalla de
              ingreso o usted puede crearlas directamente aquí.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-md hover:bg-blue-800 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Primera Empresa Cliente</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredClients.map((client) => {
              const clientOrdersCount = orders.filter((o) => o.clientId === client.id).length;
              const clientClaimsCount = claims.filter((c) => c.clientId === client.id).length;

              return (
                <div
                  key={client.id}
                  className="p-5 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-xs text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                        {client.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{client.city}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        Cuenta Activa
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">{client.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        NIT: <strong className="text-slate-700">{client.nit}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.contactPerson}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-blue-900">{client.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center space-x-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">
                        {clientOrdersCount} pedidos • {clientClaimsCount} reclamos
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Aislamiento confidencial activo
                      </div>
                    </div>

                    <button
                      onClick={() => setClientToDelete(client)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title={`Eliminar cuenta de ${client.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal to Delete Client */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 mb-1">
              ¿Eliminar cuenta de empresa?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Está a punto de eliminar del sistema a la empresa{' '}
              <strong className="text-slate-900">{clientToDelete.name}</strong> ({clientToDelete.code}).
              Esta acción no se puede deshacer.
            </p>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Client Modal (Admin does not auto-login as the client) */}
      <ClientRegistrationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        autoLogin={false}
        onSuccess={(newClient) => {
          showToast(`Empresa "${newClient.name}" registrada en el directorio`, 'success');
        }}
      />
    </div>
  );
};
