export type UserRole = 'admin' | 'client' | null;

export interface ClientProfile {
  id: string;
  code: string;
  name: string;
  nit: string;
  city: 'Medellín' | 'Bogotá' | 'Cali' | 'Barranquilla' | 'Bucaramanga';
  contactPerson: string;
  email: string;
  phone: string;
  password?: string;
}

export type OrderStatus =
  | 'Validado'
  | 'En importación'
  | 'En aduana'
  | 'En bodega'
  | 'Despachado'
  | 'Entregado';

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  description: string;
  itemsCount: number;
  totalValueCOP: number;
  status: OrderStatus;
  orderDate: string; // YYYY-MM-DD
  promisedDate: string; // YYYY-MM-DD
  actualDeliveryDate?: string;
  operationallyValidated: boolean;
  validatedBy?: string;
  originCountry: string;
  customsPort: string;
  trackingNotes?: string;
  isDelayed?: boolean;
}

export type ClaimCategory =
  | 'Retraso en entrega'
  | 'Información poco clara'
  | 'Error en pedido'
  | 'Garantía técnica'
  | 'Falla en empaque'
  | 'Atención al cliente'
  | 'Otro';

export type ClaimStatus = 'Abierta' | 'En proceso' | 'Cerrada';
export type ClientClaimStatus = 'Recibido' | 'En revisión' | 'Resuelto';

export type ClaimPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface Claim {
  id: string;
  trackingNumber: string; // e.g. RC-0001
  clientId: string;
  clientName: string;
  orderId?: string;
  orderNumber?: string;
  isInternal: boolean; // true if registered as an internal non-conformity
  category: ClaimCategory;
  responsibleArea: string;
  description: string;
  rootCause?: string;
  priority: ClaimPriority;
  correctiveAction?: string;
  status: ClaimStatus;
  createdAt: string; // ISO string or YYYY-MM-DD HH:mm
  updatedAt: string;
  adminResponse?: string;
  adminRespondedAt?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface QualityIndicator {
  id: string;
  name: string;
  description: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  unit: '%' | 'h';
  higherIsBetter: boolean;
  warningThreshold: number; // threshold between yellow and red or yellow and green
  targetThreshold: number;
  monthlyHistory: {
    month: string;
    value: number;
  }[];
}

export interface OrganizationalArea {
  id: string;
  name: string;
  detectedWeakness: string;
  currentMaturity: number; // 1 to 5
  targetMaturity: number; // 1 to 5
  leader: string;
}

export type PHVAStage = 'Planear' | 'Hacer' | 'Verificar' | 'Actuar';

export interface PHVAAction {
  id: string;
  code: string;
  title: string;
  description: string;
  stage: PHVAStage;
  area: string;
  responsible: string;
  deadline: string; // YYYY-MM-DD
  targetIndicatorId: string;
  progressPercentage: number; // 0 to 100
  createdAt: string;
}

export interface AIAnalysisResult {
  summary: string;
  overallStatus: 'Crítico' | 'En riesgo' | 'Bueno';
  priorities: {
    title: string;
    description: string;
    urgency: 'Alta' | 'Urgente' | 'Moderada';
  }[];
  suggestedActions: {
    action: string;
    area: string;
    responsible: string;
    expectedImpact: string;
  }[];
  risksOfInaction: string[];
  generatedAt: string;
}
