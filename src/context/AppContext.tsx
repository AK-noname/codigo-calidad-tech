import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  ClientProfile,
  Order,
  OrderStatus,
  Claim,
  ClaimStatus,
  QualityIndicator,
  OrganizationalArea,
  PHVAAction,
  PHVAStage,
  AIAnalysisResult,
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_INDICATORS,
  INITIAL_AREAS,
  INITIAL_PHVA_ACTIONS,
  INITIAL_ORDERS,
  INITIAL_CLAIMS,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Auth & Navigation
  role: UserRole;
  activeClientId: string | null;
  activeClient: ClientProfile | null;
  activeTab: string;
  clients: ClientProfile[];
  loginAsAdmin: () => void;
  loginAsClient: (clientId: string) => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;

  // Data
  indicators: QualityIndicator[];
  areas: OrganizationalArea[];
  phvaActions: PHVAAction[];
  orders: Order[];
  claims: Claim[];

  // Client management & authentication
  validateClientLogin: (
    identifier: string,
    password: string
  ) => { success: boolean; client?: ClientProfile; error?: string };
  addClient: (
    clientData: Omit<ClientProfile, 'id' | 'code'> & { code?: string; password?: string }
  ) => ClientProfile;
  deleteClient: (clientId: string) => void;
  updateClient: (clientId: string, clientData: Partial<ClientProfile>) => void;

  // Data mutations
  updateIndicator: (id: string, currentValue: number) => void;
  updateAreaMaturity: (id: string, currentMaturity: number) => void;
  addPHVAAction: (action: Omit<PHVAAction, 'id' | 'code' | 'createdAt'>) => void;
  updatePHVAStage: (id: string, newStage: PHVAStage) => void;
  updatePHVAProgress: (id: string, progress: number) => void;
  deletePHVAAction: (id: string) => void;
  addClaim: (claimData: {
    clientId: string;
    clientName: string;
    orderId?: string;
    orderNumber?: string;
    category: any;
    description: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    isInternal?: boolean;
    responsibleArea?: string;
    priority?: any;
  }) => string; // returns trackingNumber
  respondToClaim: (
    claimId: string,
    response: string,
    newStatus: ClaimStatus,
    correctiveAction?: string,
    rootCause?: string,
    priority?: any
  ) => void;
  updateClaimStatus: (claimId: string, status: ClaimStatus) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    promisedDate?: string,
    trackingNotes?: string,
    operationallyValidated?: boolean
  ) => void;
  resetToInitialData: () => void;

  // Computed
  overallQualityStatus: 'Crítico' | 'En riesgo' | 'Bueno';
  pendingClaimsCount: number;
  overdueClaimsCount: number;
  topPriorityAreas: OrganizationalArea[];
  clientOrders: Order[];
  clientClaims: Claim[];

  // Toasts & UX
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
}

const STORAGE_KEYS = {
  ROLE: 'globaltech_role',
  ACTIVE_CLIENT: 'globaltech_active_client',
  ACTIVE_TAB: 'globaltech_active_tab',
  INDICATORS: 'globaltech_indicators',
  AREAS: 'globaltech_areas',
  PHVA: 'globaltech_phva',
  ORDERS: 'globaltech_orders',
  CLAIMS: 'globaltech_claims',
  CLIENTS: 'globaltech_clients',
  SEEN_WELCOME: 'globaltech_seen_welcome',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'admin' || saved === 'client' ? saved : null;
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Purge legacy records if present
        const hasLegacy = parsed.some(
          (c: any) =>
            c.id === 'cli-001' ||
            c.id === 'cli-002' ||
            c.id === 'cli-003'
        );
        if (hasLegacy) {
          localStorage.removeItem(STORAGE_KEYS.CLIENTS);
          localStorage.removeItem(STORAGE_KEYS.ORDERS);
          localStorage.removeItem(STORAGE_KEYS.CLAIMS);
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_CLIENT);
          return [];
        }
        return parsed;
      }
      return INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [activeClientId, setActiveClientId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CLIENT) || null;
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
    const savedTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (savedTab) return savedTab;
    return savedRole === 'client' ? 'mis-pedidos' : 'inicio';
  });

  const [indicators, setIndicators] = useState<QualityIndicator[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INDICATORS);
      return saved ? JSON.parse(saved) : INITIAL_INDICATORS;
    } catch {
      return INITIAL_INDICATORS;
    }
  });

  const [areas, setAreas] = useState<OrganizationalArea[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AREAS);
      return saved ? JSON.parse(saved) : INITIAL_AREAS;
    } catch {
      return INITIAL_AREAS;
    }
  });

  const [phvaActions, setPhvaActions] = useState<PHVAAction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHVA);
      return saved ? JSON.parse(saved) : INITIAL_PHVA_ACTIONS;
    } catch {
      return INITIAL_PHVA_ACTIONS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasLegacy = parsed.some(
          (o: any) => o.clientId === 'cli-001' || o.id === 'ord-101'
        );
        if (hasLegacy) {
          localStorage.removeItem(STORAGE_KEYS.ORDERS);
          return [];
        }
        return parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasLegacy = parsed.some(
          (c: any) => c.clientId === 'cli-001' || c.id === 'clm-001'
        );
        if (hasLegacy) {
          localStorage.removeItem(STORAGE_KEYS.CLAIMS);
          return [];
        }
        return parsed;
      }
      return INITIAL_CLAIMS;
    } catch {
      return INITIAL_CLAIMS;
    }
  });

  const [hasSeenWelcome, setHasSeenWelcomeState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SEEN_WELCOME) === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    }
  }, [role]);

  useEffect(() => {
    if (activeClientId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CLIENT, activeClientId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CLIENT);
    }
  }, [activeClientId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(indicators));
  }, [indicators]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PHVA, JSON.stringify(phvaActions));
  }, [phvaActions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  const setHasSeenWelcome = (seen: boolean) => {
    setHasSeenWelcomeState(seen);
    localStorage.setItem(STORAGE_KEYS.SEEN_WELCOME, seen ? 'true' : 'false');
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const loginAsAdmin = () => {
    setRole('admin');
    setActiveTabState('inicio');
    showToast('Bienvenido al Portal de Administración de Calidad', 'success');
  };

  const loginAsClient = (clientId: string) => {
    setRole('client');
    setActiveClientId(clientId);
    setActiveTabState('mis-pedidos');
    const client = clients.find((c) => c.id === clientId);
    showToast(`Sesión iniciada como ${client ? client.name : 'Cliente'}`, 'success');
  };

  const logout = () => {
    setRole(null);
    showToast('Sesión cerrada con éxito', 'info');
  };

  const activeClient = useMemo(() => {
    if (!activeClientId) return null;
    return clients.find((c) => c.id === activeClientId) || null;
  }, [clients, activeClientId]);

  // Overall quality calculation based on 5 indicators
  const overallQualityStatus = useMemo((): 'Crítico' | 'En riesgo' | 'Bueno' => {
    let score = 0;
    indicators.forEach((ind) => {
      if (ind.higherIsBetter) {
        if (ind.currentValue >= ind.targetThreshold) score += 2;
        else if (ind.currentValue >= ind.warningThreshold) score += 1;
      } else {
        if (ind.currentValue <= ind.targetThreshold) score += 2;
        else if (ind.currentValue <= ind.warningThreshold) score += 1;
      }
    });

    // Max score is 10
    if (score >= 7) return 'Bueno';
    if (score >= 4) return 'En riesgo';
    return 'Crítico';
  }, [indicators]);

  // Top 2 gap areas
  const topPriorityAreas = useMemo(() => {
    const sorted = [...areas].sort((a, b) => {
      const gapA = a.targetMaturity - a.currentMaturity;
      const gapB = b.targetMaturity - b.currentMaturity;
      return gapB - gapA;
    });
    return sorted.slice(0, 2);
  }, [areas]);

  // Claims count & overdue calculation (> 24 hours without attention)
  const pendingClaimsCount = useMemo(() => {
    return claims.filter((c) => c.status !== 'Cerrada').length;
  }, [claims]);

  const overdueClaimsCount = useMemo(() => {
    const now = new Date().getTime();
    return claims.filter((c) => {
      if (c.status === 'Cerrada' || c.adminResponse) return false;
      const createdTime = new Date(c.createdAt).getTime();
      const diffHours = (now - createdTime) / (1000 * 60 * 60);
      return diffHours >= 24;
    }).length;
  }, [claims]);

  // Filtered client views
  const clientOrders = useMemo(() => {
    if (!activeClientId) return [];
    return orders.filter((o) => o.clientId === activeClientId);
  }, [orders, activeClientId]);

  const clientClaims = useMemo(() => {
    if (!activeClientId) return [];
    return claims.filter((c) => c.clientId === activeClientId);
  }, [claims, activeClientId]);

  // Mutations
  const updateIndicator = (id: string, currentValue: number) => {
    setIndicators((prev) =>
      prev.map((ind) => {
        if (ind.id !== id) return ind;
        const newHistory = [...ind.monthlyHistory];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = {
            ...newHistory[newHistory.length - 1],
            value: currentValue,
          };
        }
        return {
          ...ind,
          currentValue,
          monthlyHistory: newHistory,
        };
      })
    );
    showToast('Indicador actualizado con éxito', 'success');
  };

  const updateAreaMaturity = (id: string, currentMaturity: number) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, currentMaturity } : a))
    );
    showToast('Nivel de madurez de área actualizado', 'success');
  };

  const addPHVAAction = (actionData: Omit<PHVAAction, 'id' | 'code' | 'createdAt'>) => {
    const nextNum = phvaActions.length + 1;
    const stagePrefix =
      actionData.stage === 'Planear'
        ? 'P'
        : actionData.stage === 'Hacer'
        ? 'H'
        : actionData.stage === 'Verificar'
        ? 'V'
        : 'A';
    const newAction: PHVAAction = {
      ...actionData,
      id: `phva-${Date.now()}`,
      code: `ACT-${stagePrefix}${String(nextNum).padStart(2, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPhvaActions((prev) => [newAction, ...prev]);
    showToast(`Acción ${newAction.code} añadida al ciclo PHVA`, 'success');
  };

  const updatePHVAStage = (id: string, newStage: PHVAStage) => {
    setPhvaActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a))
    );
    showToast(`Acción movida a etapa "${newStage}"`, 'info');
  };

  const updatePHVAProgress = (id: string, progress: number) => {
    setPhvaActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              progressPercentage: progress,
              stage: progress === 100 ? 'Actuar' : a.stage,
            }
          : a
      )
    );
  };

  const deletePHVAAction = (id: string) => {
    setPhvaActions((prev) => prev.filter((a) => a.id !== id));
    showToast('Acción eliminada del plan PHVA', 'info');
  };

  const addClaim = (claimData: {
    clientId: string;
    clientName: string;
    orderId?: string;
    orderNumber?: string;
    category: any;
    description: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    isInternal?: boolean;
    responsibleArea?: string;
    priority?: any;
  }): string => {
    const count = claims.length + 1;
    const trackingNumber = `RC-${String(1000 + count)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newClaim: Claim = {
      id: `clm-${Date.now()}`,
      trackingNumber,
      clientId: claimData.clientId,
      clientName: claimData.clientName,
      orderId: claimData.orderId,
      orderNumber: claimData.orderNumber,
      isInternal: claimData.isInternal ?? false,
      category: claimData.category,
      responsibleArea: claimData.responsibleArea || 'Servicio al Cliente',
      description: claimData.description,
      priority: claimData.priority || 'Alta',
      status: 'Abierta',
      createdAt: formattedDate,
      updatedAt: formattedDate,
      contactName: claimData.contactName,
      contactPhone: claimData.contactPhone,
      contactEmail: claimData.contactEmail,
    };

    setClaims((prev) => [newClaim, ...prev]);
    showToast(`Reclamo registrado con radicado ${trackingNumber}`, 'success');
    return trackingNumber;
  };

  const respondToClaim = (
    claimId: string,
    response: string,
    newStatus: ClaimStatus,
    correctiveAction?: string,
    rootCause?: string,
    priority?: any
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== claimId) return c;
        return {
          ...c,
          status: newStatus,
          adminResponse: response,
          adminRespondedAt: formattedDate,
          updatedAt: formattedDate,
          correctiveAction: correctiveAction || c.correctiveAction,
          rootCause: rootCause || c.rootCause,
          priority: priority || c.priority,
        };
      })
    );
    showToast('Respuesta y estado del reclamo guardados con éxito', 'success');
  };

  const updateClaimStatus = (claimId: string, status: ClaimStatus) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status, updatedAt: formattedDate } : c))
    );
    showToast(`Estado del reclamo actualizado a "${status}"`, 'info');
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber'>) => {
    const count = orders.length + 1;
    const orderNumber = `GT-2026-${940 + count}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Pedido ${orderNumber} creado exitosamente`, 'success');
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    promisedDate?: string,
    trackingNotes?: string,
    operationallyValidated?: boolean
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status,
          promisedDate: promisedDate !== undefined ? promisedDate : o.promisedDate,
          trackingNotes: trackingNotes !== undefined ? trackingNotes : o.trackingNotes,
          operationallyValidated:
            operationallyValidated !== undefined
              ? operationallyValidated
              : o.operationallyValidated,
        };
      })
    );
    showToast('Trazabilidad del pedido actualizada', 'success');
  };

  const validateClientLogin = (
    identifier: string,
    password: string
  ): { success: boolean; client?: ClientProfile; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        error: 'Por favor ingrese su código de cliente (o correo/NIT) y su contraseña.',
      };
    }

    const matchedClient = clients.find(
      (c) =>
        c.code.toLowerCase() === cleanId ||
        c.email.toLowerCase() === cleanId ||
        c.nit.toLowerCase().replace(/[.\-\s]/g, '') === cleanId.replace(/[.\-\s]/g, '')
    );

    if (!matchedClient) {
      return {
        success: false,
        error: `No se encontró ninguna empresa registrada con la identificación "${identifier}".`,
      };
    }

    const expectedPass = matchedClient.password || 'cliente123';
    if (cleanPass !== expectedPass) {
      return {
        success: false,
        error: 'Contraseña incorrecta. Por favor verifique sus credenciales confidenciales.',
      };
    }

    // Login successful
    loginAsClient(matchedClient.id);
    return { success: true, client: matchedClient };
  };

  const addClient = (
    clientData: Omit<ClientProfile, 'id' | 'code'> & { code?: string; password?: string }
  ): ClientProfile => {
    const nextNum = clients.length + 1;
    const code = clientData.code?.trim() || `CLI-${String(nextNum).padStart(3, '0')}`;
    const newClient: ClientProfile = {
      ...clientData,
      id: `cli-${Date.now()}`,
      code: code.toUpperCase(),
      password: clientData.password?.trim() || 'cliente123',
    };
    setClients((prev) => [...prev, newClient]);
    showToast(`Cuenta creada para ${newClient.name} (${newClient.code})`, 'success');
    return newClient;
  };

  const deleteClient = (clientId: string) => {
    const target = clients.find((c) => c.id === clientId);
    if (!target) return;

    const remaining = clients.filter((c) => c.id !== clientId);
    setClients(remaining);

    // If deleting the active client
    if (activeClientId === clientId) {
      if (remaining.length > 0) {
        setActiveClientId(remaining[0].id);
        showToast(`Cuenta "${target.name}" eliminada. Cambiando a ${remaining[0].name}`, 'info');
      } else {
        setActiveClientId(null);
        setRole(null);
        showToast(`Cuenta "${target.name}" eliminada. No quedan cuentas registradas.`, 'info');
      }
    } else {
      showToast(`Cuenta "${target.name}" eliminada del sistema`, 'info');
    }
  };

  const updateClient = (clientId: string, clientData: Partial<ClientProfile>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...clientData } : c))
    );
    showToast('Datos de la empresa actualizados', 'success');
  };

  const resetToInitialData = () => {
    setIndicators(INITIAL_INDICATORS);
    setAreas(INITIAL_AREAS);
    setPhvaActions(INITIAL_PHVA_ACTIONS);
    setOrders(INITIAL_ORDERS);
    setClaims(INITIAL_CLAIMS);
    setClients(INITIAL_CLIENTS);
    setActiveClientId(null);
    showToast('Sistema restablecido a la configuración institucional inicial', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        activeClientId,
        activeClient,
        activeTab,
        clients,
        loginAsAdmin,
        loginAsClient,
        validateClientLogin,
        logout,
        setActiveTab,
        indicators,
        areas,
        phvaActions,
        orders,
        claims,
        addClient,
        deleteClient,
        updateClient,
        updateIndicator,
        updateAreaMaturity,
        addPHVAAction,
        updatePHVAStage,
        updatePHVAProgress,
        deletePHVAAction,
        addClaim,
        respondToClaim,
        updateClaimStatus,
        addOrder,
        updateOrderStatus,
        resetToInitialData,
        overallQualityStatus,
        pendingClaimsCount,
        overdueClaimsCount,
        topPriorityAreas,
        clientOrders,
        clientClaims,
        toasts,
        showToast,
        removeToast,
        hasSeenWelcome,
        setHasSeenWelcome,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
