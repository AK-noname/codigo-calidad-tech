/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/auth/LoginView';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { WelcomeModal } from './components/common/WelcomeModal';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDiagnosis } from './components/admin/AdminDiagnosis';
import { AdminPHVA } from './components/admin/AdminPHVA';
import { AdminClaims } from './components/admin/AdminClaims';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminClientsList } from './components/admin/AdminClientsList';
import { AdminAIAdvisor } from './components/admin/AdminAIAdvisor';

// Client Views
import { ClientOrders } from './components/client/ClientOrders';
import { ClientCreateClaim } from './components/client/ClientCreateClaim';
import { ClientClaimsList } from './components/client/ClientClaimsList';
import { ClientCommitment } from './components/client/ClientCommitment';
import { ClientAccountManager } from './components/client/ClientAccountManager';

const MainAppContent: React.FC = () => {
  const { role, activeTab } = useApp();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // If not authenticated, show role selector & login
  if (!role) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  // Render appropriate view based on role and tab
  const renderContent = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'inicio':
          return <AdminDashboard />;
        case 'diagnostico':
          return <AdminDiagnosis />;
        case 'phva':
          return <AdminPHVA />;
        case 'reclamos':
          return <AdminClaims />;
        case 'pedidos':
          return <AdminOrders />;
        case 'clientes':
          return <AdminClientsList />;
        case 'asistente-ia':
          return <AdminAIAdvisor />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'mis-pedidos':
          return <ClientOrders />;
        case 'registrar-reclamo':
          return <ClientCreateClaim />;
        case 'mis-reclamos':
          return <ClientClaimsList />;
        case 'compromiso':
          return <ClientCommitment />;
        case 'mi-cuenta':
          return <ClientAccountManager />;
        default:
          return <ClientOrders />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 antialiased font-sans">
      <Navbar onOpenHelp={() => setShowHelpModal(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Lateral Sidebar (Desktop) */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <MobileNav />

      {/* Walkthrough Guide Modal */}
      {showHelpModal && <WelcomeModal onClose={() => setShowHelpModal(false)} />}
      <WelcomeModal />

      {/* Floating Feedback Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
