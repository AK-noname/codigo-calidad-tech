import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { supabase } from '../supabase';
import {
  Client,
  ClientProfile,
  Order,
  OrderStatus,
  Claim,
  ClaimStatus,
  QualityIndicator,
  Indicator,
  OrganizationalArea,
  PHVAAction,
  PHVAStage,
  UserRole,
} from '../types';
import {
  initialIndicators,
  initialPHVAActions,
  INITIAL_AREAS,
  INITIAL_ORDERS,
  INITIAL_CLAIMS,
  INITIAL_CLIENTS,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Cloud & Core Data
  clients: Client[];
  orders: Order[];
  claims: Claim[];
  phvaActions: PHVAAction[];
  indicators: Indicator[];
  areas: OrganizationalArea[];

  // Auth & Roles
  currentClient: Client | null;
  activeClient: Client | null;
  activeClientId: string | null;
  isAdmin: boolean;
  role: UserRole;
  activeTab: string;
  loading: boolean;

  // Actions
  loginAsAdmin: () => void;
  loginAsClient: (clientId: string) => void;
  validateClientLogin: (
    identifier: string,
    pass: string
  ) => { success: boolean; client?: Client; error?: string };
  logout: () => void;
  setActiveTab: (tab: string) => void;

  // Real-time Cloud Mutations
  registerClient: (clientData: Omit<Client, 'id' | 'createdAt'>) => Promise<Client | null>;
  addClient: (
    clientData: Omit<ClientProfile, 'id' | 'code'> & { code?: string; password?: string }
  ) => ClientProfile;
  deleteClient: (clientId: string) => void;
  updateClient: (clientId: string, clientData: Partial<Client>) => void;

  createClaim: (claimData: {
    clientId: string;
    title?: string;
    description: string;
    [key: string]: any;
  }) => Promise<void>;
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
  }) => string;

  updateOrderStatus: (
    orderId: string,
    status: Order['status'],
    promisedDate?: string,
    trackingNotes?: string,
    operationallyValidated?: boolean
  ) => Promise<void>;

  respondToClaim: (
    claimId: string,
    response: string,
    newStatus: Claim['status'],
    correctiveAction?: string,
    rootCause?: string,
    priority?: any
  ) => Promise<void>;

  updateClaimStatus: (claimId: string, status: ClaimStatus) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => void;

  // Indicator & PHVA Mutations
  updateIndicator: (id: string, currentValue: number) => void;
  updateAreaMaturity: (id: string, currentMaturity: number) => void;
  addPHVAAction: (action: Omit<PHVAAction, 'id' | 'code' | 'createdAt'>) => void;
  updatePHVAStage: (id: string, newStage: PHVAStage) => void;
  updatePHVAProgress: (id: string, progress: number) => void;
  deletePHVAAction: (id: string) => void;
  resetToInitialData: () => void;

  // Computed & Metrics
  overallQualityStatus: 'Crítico' | 'En riesgo' | 'Bueno';
  pendingClaimsCount: number;
  overdueClaimsCount: number;
  topPriorityAreas: OrganizationalArea[];
  clientOrders: Order[];
  clientClaims: Claim[];

  // Toasts
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;

  // Onboarding
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
  SEEN_WELCOME: 'globaltech_seen_welcome',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);

  const [phvaActions, setPhvaActions] = useState<PHVAAction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHVA);
      return saved ? JSON.parse(saved) : initialPHVAActions;
    } catch {
      return initialPHVAActions;
    }
  });

  const [indicators, setIndicators] = useState<Indicator[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INDICATORS);
      return saved ? JSON.parse(saved) : initialIndicators;
    } catch {
      return initialIndicators;
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

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'admin' || saved === 'client' ? saved : null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'admin';
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

  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [hasSeenWelcome, setHasSeenWelcomeState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SEEN_WELCOME) === 'true';
  });

  // Toast dispatchers
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const toastType = type === 'warning' ? 'info' : type;
    setToast({ message, type: toastType });
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToast(null);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setHasSeenWelcome = (seen: boolean) => {
    setHasSeenWelcomeState(seen);
    localStorage.setItem(STORAGE_KEYS.SEEN_WELCOME, seen ? 'true' : 'false');
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  };

  // Sync auth & navigation
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

  // Synchronize with Supabase Cloud
  const fetchCloudData = async () => {
    try {
      const fetchPromise = Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('claims').select('*').order('created_at', { ascending: false }),
      ]);

      // Fail-fast timeout so the app continues gracefully if network/credentials aren't ready yet
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase request timeout')), 2500)
      );

      const [clientsRes, ordersRes, claimsRes]: any = await Promise.race([
        fetchPromise,
        timeoutPromise,
      ]);

      if (clientsRes?.data && Array.isArray(clientsRes.data)) {
        setClients(
          clientsRes.data.map((c: any) => ({
            id: c.id,
            code: c.code,
            companyName: c.company_name || c.name,
            name: c.company_name || c.name || 'Empresa Cliente',
            nit: c.nit || '',
            contactPerson: c.contact_person || '',
            email: c.email || '',
            phone: c.phone || '',
            password: c.password || 'cliente123',
            city: c.city || 'Medellín',
            createdAt: c.created_at,
          }))
        );
      }

      if (ordersRes?.data && Array.isArray(ordersRes.data)) {
        setOrders(
          ordersRes.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number || `ORD-${o.id}`,
            clientId: o.client_id,
            clientName: o.client_name || 'Cliente Institucional',
            description: o.description || `Pedido ${o.order_number}`,
            itemsCount: o.items_count || 1,
            totalValueCOP: o.total_value_cop || 0,
            status: o.status || 'Validado',
            orderDate: o.order_date || o.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            promisedDate: o.promised_date || o.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            operationallyValidated: o.operationally_validated ?? true,
            originCountry: o.origin_country || 'China / EE.UU.',
            customsPort: o.customs_port || 'Buenaventura',
            trackingNotes: o.tracking_notes || '',
            isDelayed: o.is_delayed ?? false,
            createdAt: o.created_at,
          }))
        );
      }

      if (claimsRes?.data && Array.isArray(claimsRes.data)) {
        setClaims(
          claimsRes.data.map((cr: any) => ({
            id: cr.id,
            code: cr.code || `REC-${cr.id}`,
            trackingNumber: cr.code || cr.tracking_number || `RC-${cr.id}`,
            clientId: cr.client_id,
            clientName: cr.client_name || 'Empresa Cliente',
            title: cr.title || 'Reclamo o Garantía',
            description: cr.description || '',
            category: cr.category || 'Retraso en entrega',
            responsibleArea: cr.responsible_area || 'Servicio al Cliente',
            priority: cr.priority || 'Alta',
            isInternal: cr.is_internal ?? false,
            status: cr.status || 'Pendiente',
            adminResponse: cr.admin_response,
            adminRespondedAt: cr.admin_responded_at,
            contactName: cr.contact_name || '',
            contactPhone: cr.contact_phone || '',
            contactEmail: cr.contact_email || '',
            createdAt: cr.created_at || new Date().toISOString(),
            updatedAt: cr.updated_at || cr.created_at || new Date().toISOString(),
          }))
        );
      }
    } catch (err) {
      console.warn('Nota de sincronización con Supabase (modo local activo si no hay credenciales configuradas):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();

    try {
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => fetchCloudData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchCloudData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => fetchCloudData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime channel subscription fallback:', err);
    }
  }, []);

  const loginAsAdmin = () => {
    setIsAdmin(true);
    setRole('admin');
    setActiveClientId(null);
    setActiveTabState('inicio');
    showToast('Bienvenido al Portal de Administración de Calidad', 'success');
  };

  const loginAsClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setIsAdmin(false);
    setRole('client');
    setActiveClientId(clientId);
    setActiveTabState('mis-pedidos');
    showToast(`Sesión iniciada como ${client ? client.name : 'Cliente'}`, 'success');
  };

  const validateClientLogin = (
    identifier: string,
    pass: string
  ): { success: boolean; client?: Client; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        error: 'Por favor ingrese su código de cliente (o correo/NIT) y su contraseña.',
      };
    }

    const found = clients.find(
      (c) =>
        (c.code.toLowerCase() === cleanId ||
          c.nit.toLowerCase().replace(/[.\-\s]/g, '') === cleanId.replace(/[.\-\s]/g, '') ||
          c.email?.toLowerCase() === cleanId) &&
        (c.password === cleanPass || !c.password)
    );

    if (found) {
      setIsAdmin(false);
      setRole('client');
      setActiveClientId(found.id);
      setActiveTabState('mis-pedidos');
      showToast(`Sesión iniciada como ${found.name}`, 'success');
      return { success: true, client: found };
    }
    return { success: false, error: 'Código, correo/NIT o contraseña incorrectos.' };
  };

  const logout = () => {
    setIsAdmin(false);
    setRole(null);
    setActiveClientId(null);
    showToast('Sesión cerrada con éxito', 'info');
  };

  // Register client (Persist to Supabase)
  const registerClient = async (
    clientData: Omit<Client, 'id' | 'createdAt'>
  ): Promise<Client | null> => {
    const newCode = clientData.code?.trim() || `CLI-${Math.floor(100 + Math.random() * 900)}`;
    const newId = `cli-${Date.now()}`;
    const newClient: Client = {
      id: newId,
      code: newCode,
      companyName: clientData.companyName || clientData.name,
      name: clientData.companyName || clientData.name,
      nit: clientData.nit,
      contactPerson: clientData.contactPerson,
      email: clientData.email,
      phone: clientData.phone,
      password: clientData.password || 'cliente123',
      city: clientData.city || 'Medellín',
      createdAt: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            code: newCode,
            company_name: clientData.companyName || clientData.name,
            nit: clientData.nit,
            contact_person: clientData.contactPerson,
            email: clientData.email,
            phone: clientData.phone,
            password: clientData.password || 'cliente123',
          },
        ])
        .select();

      if (error || !data || data.length === 0) {
        setClients((prev) => [newClient, ...prev]);
        showToast('Empresa cliente registrada en el sistema', 'success');
        return newClient;
      }

      const created: Client = {
        id: data[0].id,
        code: data[0].code,
        companyName: data[0].company_name,
        name: data[0].company_name,
        nit: data[0].nit,
        contactPerson: data[0].contact_person,
        email: data[0].email,
        phone: data[0].phone,
        password: data[0].password,
        city: clientData.city || 'Medellín',
        createdAt: data[0].created_at,
      };

      setClients((prev) => [created, ...prev]);
      showToast('Empresa registrada en la base de datos', 'success');
      return created;
    } catch {
      setClients((prev) => [newClient, ...prev]);
      showToast('Empresa cliente registrada exitosamente', 'success');
      return newClient;
    }
  };

  // Synchronous bridge for components expecting immediate ClientProfile return
  const addClient = (
    clientData: Omit<ClientProfile, 'id' | 'code'> & { code?: string; password?: string }
  ): ClientProfile => {
    const nextNum = clients.length + 1;
    const code = clientData.code?.trim() || `CLI-${String(nextNum).padStart(3, '0')}`;
    const newClient: ClientProfile = {
      ...clientData,
      id: `cli-${Date.now()}`,
      code: code.toUpperCase(),
      name: clientData.name,
      companyName: clientData.name,
      password: clientData.password?.trim() || 'cliente123',
      createdAt: new Date().toISOString(),
    };

    setClients((prev) => [newClient, ...prev]);

    // Asynchronously insert into Supabase
    void (async () => {
      try {
        const { error } = await supabase.from('clients').insert([
          {
            code: newClient.code,
            company_name: newClient.name,
            nit: newClient.nit,
            contact_person: newClient.contactPerson,
            email: newClient.email,
            phone: newClient.phone,
            password: newClient.password,
          },
        ]);
        if (!error) fetchCloudData();
      } catch (err) {
        console.warn('Supabase insert note:', err);
      }
    })();

    showToast(`Cuenta creada para ${newClient.name} (${newClient.code})`, 'success');
    return newClient;
  };

  const deleteClient = (clientId: string) => {
    const target = clients.find((c) => c.id === clientId);
    setClients((prev) => prev.filter((c) => c.id !== clientId));

    void (async () => {
      try {
        await supabase.from('clients').delete().eq('id', clientId);
      } catch (err) {
        console.warn('Supabase delete notice:', err);
      }
    })();

    if (activeClientId === clientId) {
      setActiveClientId(null);
      setRole(null);
    }
    showToast(`Cuenta "${target?.name || 'Cliente'}" eliminada`, 'info');
  };

  const updateClient = (clientId: string, clientData: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...clientData } : c))
    );

    void (async () => {
      try {
        await supabase
          .from('clients')
          .update({
            company_name: clientData.name || clientData.companyName,
            nit: clientData.nit,
            contact_person: clientData.contactPerson,
            email: clientData.email,
            phone: clientData.phone,
          })
          .eq('id', clientId);
      } catch (err) {
        console.warn('Supabase update notice:', err);
      }
    })();

    showToast('Datos de la empresa actualizados', 'success');
  };

  // Create claim (Persist to Supabase)
  const createClaim = async (claimData: {
    clientId: string;
    title?: string;
    description: string;
    [key: string]: any;
  }) => {
    const code = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newClaim: Claim = {
      id: `clm-${Date.now()}`,
      trackingNumber: code,
      code,
      clientId: claimData.clientId,
      clientName: clients.find((c) => c.id === claimData.clientId)?.name || 'Cliente',
      title: claimData.title || 'Reclamo de Servicio',
      description: claimData.description,
      category: claimData.category || 'Retraso en entrega',
      responsibleArea: 'Servicio al Cliente',
      priority: 'Alta',
      isInternal: false,
      status: 'Pendiente',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      createdAt: now,
      updatedAt: now,
    };

    setClaims((prev) => [newClaim, ...prev]);

    try {
      const { error } = await supabase.from('claims').insert([
        {
          code,
          client_id: claimData.clientId,
          title: claimData.title || 'Reclamo',
          description: claimData.description,
          status: 'Pendiente',
        },
      ]);

      if (error) {
        showToast('Reclamo radicado en el sistema', 'info');
      } else {
        showToast('Reclamo radicado exitosamente en la nube', 'success');
        fetchCloudData();
      }
    } catch {
      showToast('Reclamo radicado exitosamente', 'success');
    }
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
      code: trackingNumber,
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

    // Asynchronously insert into Supabase
    void (async () => {
      try {
        const { error } = await supabase.from('claims').insert([
          {
            code: trackingNumber,
            client_id: claimData.clientId,
            title: claimData.category,
            description: claimData.description,
            status: 'Abierta',
          },
        ]);
        if (!error) fetchCloudData();
      } catch (err) {
        console.warn('Supabase insert notice:', err);
      }
    })();

    showToast(`Reclamo registrado con radicado ${trackingNumber}`, 'success');
    return trackingNumber;
  };

  // Update order status (Persist to Supabase)
  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
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

    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (!error) {
        showToast('Estado del pedido actualizado en la nube', 'success');
        fetchCloudData();
      } else {
        showToast('Estado del pedido actualizado', 'info');
      }
    } catch {
      showToast('Estado del pedido actualizado', 'info');
    }
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

    void (async () => {
      try {
        const { error } = await supabase.from('orders').insert([
          {
            order_number: orderNumber,
            client_id: orderData.clientId,
            status: orderData.status,
          },
        ]);
        if (!error) fetchCloudData();
      } catch (err) {
        console.warn('Supabase addOrder notice:', err);
      }
    })();

    showToast(`Pedido ${orderNumber} creado exitosamente`, 'success');
  };

  // Respond to claim (Persist to Supabase)
  const respondToClaim = async (
    claimId: string,
    response: string,
    newStatus: Claim['status'],
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

    try {
      const { error } = await supabase
        .from('claims')
        .update({ admin_response: response, status: newStatus })
        .eq('id', claimId);

      if (!error) {
        showToast('Respuesta registrada en la base de datos', 'success');
        fetchCloudData();
      } else {
        showToast('Respuesta guardada con éxito', 'info');
      }
    } catch {
      showToast('Respuesta guardada con éxito', 'info');
    }
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

    void (async () => {
      try {
        await supabase.from('claims').update({ status }).eq('id', claimId);
      } catch (err) {
        console.warn('Supabase claim status note:', err);
      }
    })();

    showToast(`Estado del reclamo actualizado a "${status}"`, 'info');
  };

  // Indicator & PHVA management
  const updateIndicator = (id: string, currentValue: number) => {
    setIndicators((prev) => {
      const updated = prev.map((ind) => {
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
      });
      localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(updated));
      return updated;
    });
    showToast('Indicador actualizado con éxito', 'success');
  };

  const updateAreaMaturity = (id: string, currentMaturity: number) => {
    setAreas((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, currentMaturity } : a));
      localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(updated));
      return updated;
    });
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
    setPhvaActions((prev) => {
      const updated = [newAction, ...prev];
      localStorage.setItem(STORAGE_KEYS.PHVA, JSON.stringify(updated));
      return updated;
    });
    showToast(`Acción ${newAction.code} añadida al ciclo PHVA`, 'success');
  };

  const updatePHVAStage = (id: string, newStage: PHVAStage) => {
    setPhvaActions((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a));
      localStorage.setItem(STORAGE_KEYS.PHVA, JSON.stringify(updated));
      return updated;
    });
    showToast(`Acción movida a etapa "${newStage}"`, 'info');
  };

  const updatePHVAProgress = (id: string, progress: number) => {
    setPhvaActions((prev) => {
      const updated = prev.map((a) =>
        a.id === id
          ? {
              ...a,
              progressPercentage: progress,
              stage: progress === 100 ? 'Actuar' : a.stage,
            }
          : a
      );
      localStorage.setItem(STORAGE_KEYS.PHVA, JSON.stringify(updated));
      return updated;
    });
  };

  const deletePHVAAction = (id: string) => {
    setPhvaActions((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.PHVA, JSON.stringify(updated));
      return updated;
    });
    showToast('Acción eliminada del plan PHVA', 'info');
  };

  const resetToInitialData = () => {
    setIndicators(initialIndicators);
    setAreas(INITIAL_AREAS);
    setPhvaActions(initialPHVAActions);
    setOrders(INITIAL_ORDERS);
    setClaims(INITIAL_CLAIMS);
    setClients(INITIAL_CLIENTS);
    setActiveClientId(null);
    showToast('Sistema restablecido a la configuración inicial', 'info');
  };

  // Computed properties
  const activeClient = useMemo(() => {
    if (!activeClientId) return null;
    return clients.find((c) => c.id === activeClientId) || null;
  }, [clients, activeClientId]);

  const currentClient = activeClient;

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

    if (score >= 7) return 'Bueno';
    if (score >= 4) return 'En riesgo';
    return 'Crítico';
  }, [indicators]);

  const topPriorityAreas = useMemo(() => {
    const sorted = [...areas].sort((a, b) => {
      const gapA = a.targetMaturity - a.currentMaturity;
      const gapB = b.targetMaturity - b.currentMaturity;
      return gapB - gapA;
    });
    return sorted.slice(0, 2);
  }, [areas]);

  const pendingClaimsCount = useMemo(() => {
    return claims.filter((c) => c.status !== 'Cerrada' && (c.status as string) !== 'Resuelto').length;
  }, [claims]);

  const overdueClaimsCount = useMemo(() => {
    const now = new Date().getTime();
    return claims.filter((c) => {
      if (c.status === 'Cerrada' || (c.status as string) === 'Resuelto' || c.adminResponse) return false;
      const createdTime = new Date(c.createdAt).getTime();
      const diffHours = (now - createdTime) / (1000 * 60 * 60);
      return diffHours >= 24;
    }).length;
  }, [claims]);

  const clientOrders = useMemo(() => {
    if (!activeClientId) return [];
    return orders.filter((o) => o.clientId === activeClientId);
  }, [orders, activeClientId]);

  const clientClaims = useMemo(() => {
    if (!activeClientId) return [];
    return claims.filter((c) => c.clientId === activeClientId);
  }, [claims, activeClientId]);

  return (
    <AppContext.Provider
      value={{
        clients,
        orders,
        claims,
        phvaActions,
        indicators,
        areas,
        currentClient,
        activeClient,
        activeClientId,
        isAdmin,
        role,
        activeTab,
        loading,
        loginAsAdmin,
        loginAsClient,
        validateClientLogin,
        logout,
        setActiveTab,
        registerClient,
        addClient,
        deleteClient,
        updateClient,
        createClaim,
        addClaim,
        updateOrderStatus,
        respondToClaim,
        updateClaimStatus,
        addOrder,
        updateIndicator,
        updateAreaMaturity,
        addPHVAAction,
        updatePHVAStage,
        updatePHVAProgress,
        deletePHVAAction,
        resetToInitialData,
        overallQualityStatus,
        pendingClaimsCount,
        overdueClaimsCount,
        topPriorityAreas,
        clientOrders,
        clientClaims,
        showToast,
        toast,
        toasts,
        removeToast,
        hasSeenWelcome,
        setHasSeenWelcome,
      }}
    >
      {loading ? (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-300">Conectando con la base de datos en tiempo real...</p>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};
