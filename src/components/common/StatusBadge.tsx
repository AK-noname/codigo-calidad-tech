import React from 'react';
import {
  OrderStatus,
  ClaimStatus,
  ClaimPriority,
} from '../../types';
import {
  CheckCircle,
  Clock,
  Truck,
  Ship,
  Warehouse,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface OrderBadgeProps {
  status: OrderStatus;
  isDelayed?: boolean;
}

export const OrderStatusBadge: React.FC<OrderBadgeProps> = ({ status, isDelayed }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-300';
  let Icon = Clock;

  switch (status) {
    case 'Validado':
      color = 'bg-sky-50 text-sky-800 border-sky-300';
      Icon = FileCheck;
      break;
    case 'En importación':
      color = 'bg-blue-50 text-blue-800 border-blue-300';
      Icon = Ship;
      break;
    case 'En aduana':
      color = 'bg-amber-50 text-amber-800 border-amber-300';
      Icon = Clock;
      break;
    case 'En bodega':
      color = 'bg-purple-50 text-purple-800 border-purple-300';
      Icon = Warehouse;
      break;
    case 'Despachado':
      color = 'bg-indigo-50 text-indigo-800 border-indigo-300';
      Icon = Truck;
      break;
    case 'Entregado':
      color = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = CheckCircle;
      break;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{status}</span>
      </span>
      {isDelayed && status !== 'Entregado' && (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
          <AlertCircle className="w-3 h-3" />
          <span>Retrasado</span>
        </span>
      )}
    </div>
  );
};

export const ClaimStatusBadge: React.FC<{
  status: ClaimStatus;
  isClientView?: boolean;
}> = ({ status, isClientView }) => {
  if (isClientView) {
    const label =
      status === 'Abierta'
        ? 'Recibido'
        : status === 'En proceso'
        ? 'En revisión'
        : 'Resuelto';

    const color =
      status === 'Abierta'
        ? 'bg-amber-50 text-amber-800 border-amber-300'
        : status === 'En proceso'
        ? 'bg-blue-50 text-blue-800 border-blue-300'
        : 'bg-emerald-50 text-emerald-800 border-emerald-300';

    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            status === 'Abierta'
              ? 'bg-amber-500'
              : status === 'En proceso'
              ? 'bg-blue-500'
              : 'bg-emerald-500'
          }`}
        />
        <span>{label}</span>
      </span>
    );
  }

  const color =
    status === 'Abierta'
      ? 'bg-rose-50 text-rose-800 border-rose-300'
      : status === 'En proceso'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-emerald-50 text-emerald-800 border-emerald-300';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'Abierta'
            ? 'bg-rose-500'
            : status === 'En proceso'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ClaimPriority }> = ({ priority }) => {
  const color =
    priority === 'Crítica'
      ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
      : priority === 'Alta'
      ? 'bg-orange-100 text-orange-800 border-orange-300 font-medium'
      : priority === 'Media'
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${color}`}>
      Prioridad {priority}
    </span>
  );
};

export const QualitySemaforo: React.FC<{
  current: number;
  target: number;
  unit: string;
  higherIsBetter: boolean;
  warningThreshold: number;
}> = ({ current, target, unit, higherIsBetter, warningThreshold }) => {
  let status: 'good' | 'warning' | 'critical' = 'good';

  if (higherIsBetter) {
    if (current >= target) status = 'good';
    else if (current >= warningThreshold) status = 'warning';
    else status = 'critical';
  } else {
    if (current <= target) status = 'good';
    else if (current <= warningThreshold) status = 'warning';
    else status = 'critical';
  }

  const badgeClass =
    status === 'good'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : status === 'warning'
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';

  const dotClass =
    status === 'good'
      ? 'bg-emerald-500'
      : status === 'warning'
      ? 'bg-amber-500'
      : 'bg-rose-600';

  const label =
    status === 'good'
      ? 'Meta Cumplida'
      : status === 'warning'
      ? 'En Observación'
      : 'Atención Crítica';

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}
      >
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <span>{label}</span>
      </span>
      <span className="text-xs text-slate-500">
        Meta: {target}
        {unit}
      </span>
    </div>
  );
};
