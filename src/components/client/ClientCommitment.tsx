import React from 'react';
import {
  Award,
  Clock,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';

export const ClientCommitment: React.FC = () => {
  const commitments = [
    {
      title: 'Respuesta Formal en <24 Horas',
      desc: 'Todo reclamo o solicitud de garantía radicado en nuestro portal recibe un plan de acción y número de caso formal en menos de 24 horas hábiles.',
      icon: Clock,
      stat: '< 24h',
      color: 'bg-blue-600',
    },
    {
      title: 'Trazabilidad Operativa 100%',
      desc: 'Ningún pedido se promete sin previa validación logística. Monitoreo satelital y aduanero desde fábrica hasta su sede.',
      icon: Compass,
      stat: '6 etapas',
      color: 'bg-emerald-600',
    },
    {
      title: 'Garantía Técnica Inmediata',
      desc: 'Reposición prioritaria de accesorios y equipos con falla de fábrica sin trámites burocráticos engorrosos.',
      icon: ShieldCheck,
      stat: 'Cero demora',
      color: 'bg-indigo-600',
    },
    {
      title: 'Mejora Continua Basada en su Voz',
      desc: 'Cada reclamo alimenta nuestro ciclo PHVA institucional para corregir causas raíz y elevar la satisfacción de nuestros clientes.',
      icon: RotateCcw,
      stat: '93% CSAT',
      color: 'bg-amber-600',
    },
  ];

  const branches = [
    {
      city: 'Medellín (Sede Principal)',
      address: 'Carrera 43A # 1-50, Edificio San Fernando Plaza, Torre 3, Piso 8 (El Poblado)',
      phone: '+57 (604) 448-3200',
      mobile: '+57 312 890 4521',
      email: 'medellin@globaltech.com.co',
      hours: 'Lunes a Viernes: 7:30 a.m. a 5:30 p.m.',
      lead: 'Diana María Pineda • Operaciones',
    },
    {
      city: 'Bogotá (Centro Logístico Nacional)',
      address: 'Avenida Calle 26 # 92-32, Parque Industrial El Dorado, Bodega 14 (Fontibón)',
      phone: '+57 (601) 745-8900',
      mobile: '+57 310 456 7890',
      email: 'bogota@globaltech.com.co',
      hours: 'Lunes a Viernes: 7:00 a.m. a 5:00 p.m. / Sábados: 8:00 a.m. a 12:00 m.',
      lead: 'Santiago Morales • Comercial & Envíos',
    },
    {
      city: 'Cali (Sede Suroccidente)',
      address: 'Calle 15 Norte # 6N-36, Edificio Cámara de Comercio, Oficina 504 (Granada)',
      phone: '+57 (602) 667-4550',
      mobile: '+57 315 789 1234',
      email: 'cali@globaltech.com.co',
      hours: 'Lunes a Viernes: 8:00 a.m. a 5:30 p.m.',
      lead: 'Lic. Fernando Ospina • Cuentas Corporativas',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & 1-line Instruction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Portal de Clientes • Excelencia en el Servicio</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Nuestro Compromiso de Calidad y Sedes en Colombia
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instrucción: Conozca nuestros estándares de excelencia, acuerdos de nivel de servicio
            (SLA) y canales directos de atención en Medellín, Bogotá y Cali.
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
            Política de Calidad GlobalTech S.A.S.
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-3">
            "Tecnología sin fronteras, servicio con total transparencia"
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            En Importadora GlobalTech S.A.S., entendemos que el éxito de su organización depende de
            la puntualidad y calidad de cada equipo que importamos. Por ello hemos transformado
            nuestros procesos con la metodología PHVA para garantizar cero promesas vacías y
            acompañamiento integral permanente.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Commitment */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Los 4 Pilares de Servicio de GlobalTech Calidad 360
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commitments.map((com, idx) => {
            const Icon = com.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${com.color} text-white flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-black text-blue-900 mb-1">{com.stat}</div>
                  <h4 className="font-bold text-sm text-slate-900 mb-2">{com.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{com.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center text-[11px] text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Estándar certificado</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sede Contact Cards by City (Medellín, Bogotá, Cali) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Puntos de Atención Directa y Centros de Operación en Colombia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branches.map((branch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
                  <Building className="w-4 h-4" />
                  <span>Sede Regional</span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 mb-4">{branch.city}</h4>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{branch.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-blue-900">{branch.email}</span>
                  </div>

                  <div className="flex items-start space-x-2 pt-2 border-t border-slate-100 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.hours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Atención a cargo de: <strong className="text-slate-700">{branch.lead}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
