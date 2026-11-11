import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientRegistrationModal } from '../common/ClientRegistrationModal';
import {
  Building2,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Mail,
  Phone,
  User,
  FileText,
  KeyRound,
  ShieldCheck,
  Lock,
  Save,
  Plus,
  LogOut,
} from 'lucide-react';

export const ClientAccountManager: React.FC = () => {
  const {
    activeClient,
    updateClient,
    deleteClient,
    clientOrders,
    clientClaims,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit active profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(activeClient?.name || '');
  const [editNit, setEditNit] = useState(activeClient?.nit || '');
  const [editCity, setEditCity] = useState(activeClient?.city || 'Bogotá');
  const [editContact, setEditContact] = useState(activeClient?.contactPerson || '');
  const [editEmail, setEditEmail] = useState(activeClient?.email || '');
  const [editPhone, setEditPhone] = useState(activeClient?.phone || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!activeClient) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No hay ninguna cuenta de cliente activa.
      </div>
    );
  }

  const startEditing = () => {
    setEditName(activeClient.name);
    setEditNit(activeClient.nit);
    setEditCity(activeClient.city);
    setEditContact(activeClient.contactPerson);
    setEditEmail(activeClient.email);
    setEditPhone(activeClient.phone);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient(activeClient.id, {
      name: editName.trim(),
      nit: editNit.trim(),
      city: editCity as any,
      contactPerson: editContact.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    const actualPassword = activeClient.password || 'cliente123';
    if (currentPassword.trim() !== actualPassword) {
      setPasswordError('La contraseña actual ingresada es incorrecta.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setPasswordError('La nueva contraseña debe tener como mínimo 6 caracteres.');
      return;
    }

    if (newPassword.trim() !== confirmNewPassword.trim()) {
      setPasswordError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    updateClient(activeClient.id, {
      password: newPassword.trim(),
    });

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    showToast('Contraseña de acceso confidencial actualizada', 'success');
  };

  const handleConfirmDelete = () => {
    deleteClient(activeClient.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Portal de Clientes • Gestión Confidencial</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Mi Cuenta Corporativa y Seguridad
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Consulte y actualice los datos de su empresa, modifique su contraseña
            confidencial o gestione el estado de su cuenta.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Otra Empresa</span>
        </button>
      </div>

      {/* Confidentiality Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-900 block mb-0.5">
            Privacidad y Aislamiento de Datos Garantizado
          </span>
          <p className="text-emerald-800 leading-relaxed">
            Su sesión está protegida y vinculada de manera estricta a <strong>{activeClient.name}</strong>.
            Ningún otro cliente de GlobalTech tiene acceso a sus pedidos, acuerdos de importación ni
            radicados de reclamos.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              {activeClient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">{activeClient.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Cuenta Verificada
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                NIT: <strong className="text-white">{activeClient.nit}</strong> • Código Oficial:{' '}
                <span className="font-mono text-emerald-300 font-bold">{activeClient.code}</span>
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={startEditing}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Datos</span>
            </button>
          )}
        </div>

        {/* Read / Edit details */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="p-6 space-y-4 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Razón Social *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  NIT *
                </label>
                <input
                  type="text"
                  value={editNit}
                  onChange={(e) => setEditNit(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Ciudad
                </label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Bucaramanga">Bucaramanga</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Persona de Contacto *
                </label>
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Teléfono / Celular *
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Correo Electrónico de Notificaciones *
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1 text-[11px] font-semibold uppercase">
                Sede / Ciudad
              </span>
              <strong className="text-slate-800 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{activeClient.city}</span>
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1 text-[11px] font-semibold uppercase">
                Enlace Responsable
              </span>
              <strong className="text-slate-800 text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>{activeClient.contactPerson}</span>
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1 text-[11px] font-semibold uppercase">
                Línea Directa
              </span>
              <strong className="text-slate-800 text-sm flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{activeClient.phone}</span>
              </strong>
            </div>

            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1 text-[11px] font-semibold uppercase">
                Correo para Informes y Respuestas
              </span>
              <strong className="text-blue-900 text-sm flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-700" />
                <span>{activeClient.email}</span>
              </strong>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950 flex flex-col justify-center">
              <span className="text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                Operaciones Vinculadas
              </span>
              <span className="text-xs font-black text-emerald-900 mt-1">
                {clientOrders.length} pedidos activos • {clientClaims.length} radicados
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Security & Password Change */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-2 pb-3 border-b border-slate-100">
          <Lock className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Seguridad y Cambio de Contraseña Confidencial
            </h3>
            <p className="text-xs text-slate-500">
              Actualice periódicamente la contraseña que utiliza para acceder a su portal.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold mb-4">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Contraseña confidencial actualizada correctamente.</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Contraseña Actual *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Nueva Contraseña * (mín. 6)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Confirmar Nueva Contraseña *
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Actualizar Contraseña</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Delete My Account */}
      <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Zona de Eliminación de Cuenta</span>
            </div>
            <h4 className="font-extrabold text-base text-rose-950">
              Eliminar Definitivamente la Cuenta de {activeClient.name}
            </h4>
            <p className="text-xs text-rose-800/90 mt-1 max-w-xl leading-relaxed">
              Si su empresa ya no requiere acceso al sistema de trazabilidad de GlobalTech, puede
              remover esta cuenta de forma permanente. Su sesión será cerrada inmediatamente.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Mi Cuenta</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 mb-1">
              ¿Eliminar definitivamente su cuenta?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Está a punto de eliminar la cuenta de{' '}
              <strong className="text-slate-900">{activeClient.name}</strong> (NIT: {activeClient.nit}).
              Esta acción no se puede deshacer y su sesión se cerrará de inmediato.
            </p>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Sí, eliminar mi cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Register a new Client/Subsidiary */}
      <ClientRegistrationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        autoLogin={true}
      />
    </div>
  );
};
