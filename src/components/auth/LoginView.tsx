import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Lock,
  User,
  ArrowRight,
  Plus,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ClientRegistrationModal } from '../common/ClientRegistrationModal';

export const LoginView: React.FC = () => {
  const {
    clients,
    loginAsAdmin,
    validateClientLogin,
    showToast,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'admin' | 'client' | null>(null);

  // Admin form state (Credenciales guardadas internamente de forma confidencial)
  const [adminUser, setAdminUser] = useState('ADMIN_CALIDAD');
  const [adminPass, setAdminPass] = useState('1524');
  const [adminError, setAdminError] = useState('');

  // Client form state
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientPasswordInput, setClientPasswordInput] = useState('');
  const [clientError, setClientError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() === 'ADMIN_CALIDAD' && adminPass === '1524') {
      setAdminError('');
      loginAsAdmin();
    } else {
      setAdminError('Credenciales incorrectas. Verifique su usuario y contraseña institucional.');
    }
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');

    if (!clientIdInput.trim() || !clientPasswordInput.trim()) {
      setClientError('Por favor ingrese su código de cliente (o correo/NIT) y su contraseña.');
      return;
    }

    const result = validateClientLogin(clientIdInput, clientPasswordInput);
    if (!result.success) {
      setClientError(result.error || 'Credenciales no válidas.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100">
      {/* Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              GlobalTech <span className="text-blue-400 font-semibold text-sm">Calidad 360</span>
            </h1>
            <p className="text-xs text-slate-400">Importadora GlobalTech S.A.S. • Colombia</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistema Operativo y de Servicio Activo</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/10 text-blue-300 border border-blue-400/20 mb-3">
            Plataforma Unificada de Calidad y Trazabilidad
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Bienvenido al Sistema de Gestión de Servicio
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Seleccione el tipo de acceso para ingresar a su portal corporativo.
            Garantizamos trazabilidad total, atención rápida y mejora continua.
          </p>
        </div>

        {/* Role Selection or Login Card */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Card Administrador */}
            <button
              onClick={() => setSelectedRole('admin')}
              className="group text-left p-6 sm:p-8 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/10 hover:border-blue-400/60 backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-blue-600/40">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-1">
                  Equipo Interno
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Soy Administrador</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Acceso para la Dirección de Calidad, Logística y Operaciones. Control del ciclo PHVA,
                  indicadores de satisfacción, gestión de reclamos, trazabilidad y directorio de clientes.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-blue-300 group-hover:text-white">
                <span>Ingresar con credenciales</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card Cliente */}
            <button
              onClick={() => setSelectedRole('client')}
              className="group text-left p-6 sm:p-8 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/10 hover:border-emerald-400/60 backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-600/40">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-1">
                  Empresas e Instituciones
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Soy Cliente</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Acceso confidencial para consultar el estado en tiempo real de sus pedidos,
                  radicar novedades o garantías y recibir respuesta formal en menos de 24 horas.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-emerald-300 group-hover:text-white">
                <span>Ingresar al portal de clientes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        ) : selectedRole === 'admin' ? (
          /* Formulario Administrador */
          <div className="max-w-md mx-auto bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md animate-in fade-in">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Acceso Administrativo</h3>
                  <p className="text-xs text-slate-400">Portal de Calidad y Dirección</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cambiar rol
              </button>
            </div>

            {adminError && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-medium">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Usuario
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Usuario"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Ingresar al Portal Administrador</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Formulario Cliente */
          <div className="max-w-md mx-auto bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md animate-in fade-in">
            {/* Header Formulario Cliente */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Acceso Confidencial a Clientes</h3>
                  <p className="text-xs text-slate-400">Ingrese con las credenciales de su empresa</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cambiar rol
              </button>
            </div>

            {/* Aviso de Confidencialidad y Seguridad */}
            <div className="mb-5 p-3.5 bg-emerald-950/60 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-100 mb-0.5">Seguridad y Confidencialidad:</span>
                <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                  Cada cliente accede de manera estricta y exclusiva a sus propios pedidos y reclamos privados.
                  Si aún no cuenta con usuario, regístrese mediante el botón a continuación.
                </p>
              </div>
            </div>

            {clients.length === 0 && (
              <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  No hay empresas clientes registradas aún en el sistema. Registre su empresa a continuación para crear su código y contraseña.
                </span>
              </div>
            )}

            {clientError && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-semibold flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{clientError}</span>
              </div>
            )}

            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Código de Cliente, Correo Corporativo o NIT *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    placeholder="Código (ej: CLI-001), NIT o Correo"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Contraseña Confidencial *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={clientPasswordInput}
                    onChange={(e) => setClientPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                <span>Ingresar al Portal del Cliente</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 border-t border-slate-700/80 text-center">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center space-x-2 border border-slate-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Registrar Nueva Empresa Cliente</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Registration Modal from Login Screen */}
      <ClientRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={(newClient) => {
          setClientIdInput(newClient.code);
          setClientPasswordInput(newClient.password || '');
          setClientError('');
          showToast(`¡Empresa ${newClient.name} registrada! Ahora puede ingresar con su código y contraseña.`, 'success');
        }}
        autoLogin={true}
      />

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-3 text-xs text-slate-500">
        Importadora GlobalTech S.A.S. • NIT 900.567.890-4 • Sedes en Medellín, Bogotá y Cali • PBX Nacional: 01 8000 910 360
      </footer>
    </div>
  );
};