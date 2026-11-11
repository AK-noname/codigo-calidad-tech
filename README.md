# GlobalTech Calidad 360
### Sistema de Gestión de Calidad, Trazabilidad y Servicio para Importadora GlobalTech S.A.S.

Plataforma empresarial de gestión de calidad y trazabilidad logística desarrollada para **Importadora GlobalTech S.A.S.** (Colombia). Resuelve la desarticulación operativa entre Comercial y Logística, fortalece los indicadores de satisfacción del cliente (hacia la meta del 93%), asegura el cumplimiento de fechas prometidas de entrega y consolida una cultura institucional de excelencia fundamentada en el ciclo **PHVA (Planear, Hacer, Verificar, Actuar)**.

---

## 🏛️ Portales Integrados

La plataforma unifica **dos portales especializados con aislamiento confidencial**:

### 1. Portal de Administración (Dirección de Calidad y Operaciones)
Supervisión global y control de todos los procesos corporativos:
- **1. Panel de Calidad:**
  - Estado general del sistema calculado automáticamente: *Crítico*, *En riesgo* o *Bueno*.
  - Tarjetas de los 5 indicadores estratégicos (CSAT, devoluciones, tiempos de respuesta, rotación de personal y contratos) con semáforo dinámico.
  - Gráfico interactivo de evolución mensual histórica.
  - Contador de reclamos pendientes y alerta visual si algún caso supera 24 horas sin atención formal.
  - Actualización directa de indicadores para simulación y seguimiento en tiempo real.
- **2. Diagnóstico Organizacional:**
  - Diagnóstico de las 6 áreas funcionales con sus debilidades y oportunidades de mejora.
  - Ajuste interactivo del nivel de madurez operativa (escala 1 a 5).
  - Gráfico de radar (Madurez Actual vs Meta).
  - Identificación automática de las 2 áreas prioritarias con mayor brecha.
- **3. Plan de Mejora PHVA:**
  - Tablero Kanban interactivo con las 4 etapas del ciclo: **Planear**, **Hacer**, **Verificar** y **Actuar**.
  - Acciones institucionales de mejora con responsable, área, indicador meta y porcentaje de avance.
  - Alerta visual en rojo cuando una acción se encuentra vencida.
  - Capacidad para crear nuevas acciones y moverlas entre fases.
- **4. No Conformidades y Reclamos:**
  - Recepción y radicación en tiempo real de quejas y garantías enviadas por clientes o auditores internos.
  - Alerta inmediata si un caso supera 24 horas sin respuesta formal.
  - Análisis estadístico de tipología y causas raíz.
  - Formulario de respuesta oficial que se sincroniza al instante con el portal del cliente.
- **5. Pedidos y Trazabilidad:**
  - Seguimiento de los 6 hitos de importación: *Validado* → *En importación* → *En aduana* → *En bodega* → *Despachado* → *Entregado*.
  - **Casilla obligatoria de Validación Operativa:** Requisito indispensable de Calidad 360 que impide confirmar o despachar un pedido sin aval técnico de almacén y comex.
  - Control de fecha prometida y alertas de retraso.
- **6. Directorio de Clientes:**
  - Directorio oficial de todas las empresas clientes registradas.
  - Consulta de código institucional, NIT, ciudad, contacto, pedidos y reclamos vinculados.
  - Registro administrativo de nuevas empresas y gestión de cuentas.
- **7. Asistente Estratégico (IA):**
  - Análisis con un clic que evalúa en tiempo real indicadores, reclamos activos, cuellos de botella y brechas.
  - Entrega dictamen ejecutivo, 3 prioridades inmediatas, acciones sugeridas y evaluación de riesgos financieros.

---

### 2. Portal del Cliente (Acceso Corporativo Confidencial)
Acceso privado y seguro para empresas e instituciones compradoras:
- **1. Mis Pedidos:**
  - Trazabilidad paso a paso de cada orden de importación.
  - Fechas estimadas de entrega e información transparente sobre inspecciones en puerto y aduana.
- **2. Radicar Reclamo o Garantía:**
  - Formulario ágil para reportar novedades técnicas, de empaque o entregas.
  - Generación inmediata de número oficial de radicado (ej: `RC-1001`).
  - Compromiso formal de respuesta en menos de 24 horas hábiles.
- **3. Mis Reclamos:**
  - Historial de solicitudes radicadas por la empresa con su estado actual (*Abierta*, *En proceso*, *Cerrada*).
  - Visualización de la solución técnica y medidas adoptadas por GlobalTech.
- **4. Nuestro Compromiso:**
  - Acuerdos de nivel de servicio (SLA) y pilares de calidad.
  - Canales de atención directa y directores de cuenta en **Medellín**, **Bogotá** y **Cali**.
- **5. Mi Cuenta Corporativa:**
  - Edición de información de contacto de la empresa.
  - Cambio y actualización periódica de la contraseña confidencial.
  - Registro de sedes o empresas filiales adicionales.
  - Opción de eliminación definitiva de la cuenta.

---

## 🔐 Credenciales de Acceso

### Administrador (Equipo de Calidad y Dirección)
- **Usuario:** `ADMIN_CALIDAD`
- **Contraseña:** `1524`

### Clientes Corporativos (Acceso Confidencial Individual)
- Cada empresa cliente ingresa con su **Código de Cliente** (o NIT o correo corporativo) y su **Contraseña privada**.
- **Aislamiento estricto:** Un cliente únicamente puede consultar sus propios pedidos y reclamos privados; no tiene acceso a información de otras organizaciones.
- **Registro de nuevas empresas:** Cualquier organización cliente puede registrarse directamente mediante el botón **"Registrar Nueva Empresa Cliente"** habilitado en la pantalla de inicio y dentro del portal corporativo, definiendo en el formulario su propio código de cliente y su contraseña privada.

---

## ⚡ Sincronización Automática entre Portales

Toda la información se actualiza de manera instantánea entre el Portal de Administración y el Portal del Cliente mediante almacenamiento compartido reactivo:
- Cuando un cliente radica un reclamo, el Administrador lo visualiza de inmediato en su bandeja con el contador de pendientes.
- Cuando el Administrador responde un reclamo o cambia su estado, el cliente ve la respuesta oficial en tiempo real.
- Cuando el Administrador actualiza la etapa logística o notas de un pedido, la línea de tiempo del cliente se sincroniza al instante.

---

## 💻 Instalación y Ejecución

La aplicación está lista para ejecutarse en entorno Node.js:

1. Instalar las dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir la aplicación en el navegador en:
```
http://localhost:3000
```

---

## 🛠️ Tecnologías y Arquitectura

- **Framework:** React 19 con TypeScript.
- **Empaquetador:** Vite 8.
- **Estilos:** Tailwind CSS 4 con arquitectura responsive (menú lateral en escritorio y barra inferior en dispositivos móviles).
- **Visualización de Datos:** Recharts (gráficos de línea de tendencia, radar de diagnóstico y barras de causa raíz).
- **Iconografía:** Lucide React.
- **Persistencia:** LocalStorage API para reactividad y persistencia instantánea.
