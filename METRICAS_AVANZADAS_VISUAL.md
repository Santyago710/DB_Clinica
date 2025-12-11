# 🎨 Guía Visual de Métricas Avanzadas

## Interfaz de Usuario - Componentes

### 1. Médicos con Mayor Número de Consultas
```
┌─────────────────────────────────────────────────────────┐
│ 👨‍⚕️ Médicos con Mayor Número de Consultas (Última Semana) │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Gráfica de Barras Horizontal]    │  Tabla Detallada   │
│  ┌────────────────────────────┐    │  Médico | Consultas│
│  │ Dr. Juan García: ███████ 15│    │ ─────────────────  │
│  │ Dra. María López: ██████ 12│    │ Dr. García  │  15  │
│  │ Dr. Carlos Pérez: █████ 10│    │ Dra. López  │  12  │
│  │ Dra. Ana Ruiz: ████ 8     │    │ Dr. Pérez   │  10  │
│  └────────────────────────────┘    │ Dra. Ruiz   │   8  │
│                                                           │
└─────────────────────────────────────────────────────────┘
Colores: Azul, Verde, Naranja, Púrpura alternados
```

### 2. Tiempo Promedio Cita → Diagnóstico
```
┌──────────────────────────────────────────────────────┐
│ ⏱️ Tiempo Promedio: Cita → Diagnóstico              │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────┐│
│  │     24.5 h      │  │     1.02 d      │  │ 150   ││
│  │  Horas Promedio │  │  Días Promedio  │  │Historia││
│  │     (Azul)      │  │    (Azul)       │  │ (Nar) ││
│  └─────────────────┘  └─────────────────┘  └───────┘│
│                                                       │
└──────────────────────────────────────────────────────┘
Tarjetas destacadas con bordes coloreados
```

### 3. Auditoría de Historias Clínicas
```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔍 Últimos 10 Accesos a Historias Clínicas                         │
├─────────────────────────────────────────────────────────────────────┤
│  Fecha/Hora         │ Acción │ Empleado    │ Rol    │ IP Origen    │
│─────────────────────┼────────┼─────────────┼────────┼──────────────│
│ 11/12/25 14:30:45  │ CREATE │ Dr. García  │ MEDICO │ 192.168.1.1 │
│ 11/12/25 13:15:20  │ UPDATE │ Admin       │ ADMIN  │ 192.168.1.2 │
│ 11/12/25 12:00:10  │ DELETE │ Dr. Pérez   │ MEDICO │ 192.168.1.3 │
│ 11/12/25 11:45:30  │ CREATE │ Enfermero1  │ ENFER  │ 192.168.1.4 │
│ ...                 │ ...    │ ...         │ ...    │ ...          │
└─────────────────────────────────────────────────────────────────────┘
Colores por acción: CREATE (Verde), UPDATE (Naranja), DELETE (Rojo)
```

### 4. Equipamiento Compartido
```
┌────────────────────────────────────────────────────────────┐
│ 🔗 Equipamiento Compartido Entre Sedes                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ Resonancia Magnética │  │ Ecógrafo            │       │
│  ├──────────────────────┤  ├──────────────────────┤       │
│  │ • Radiología         │  │ • Obstetricia       │       │
│  │   (Sede Centro)      │  │   (Sede Centro)     │       │
│  │ • Radiología         │  │ • Obstetricia       │       │
│  │   (Sede Sur)         │  │   (Sede Norte)      │       │
│  │ • Radiología         │  │ • Obstetricia       │       │
│  │   (Sede Este)        │  │   (Sede Este)       │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
└────────────────────────────────────────────────────────────┘
Tarjetas de colores púrpura con bordes destacados
```

### 5. Pacientes por Enfermedad y Sede
```
┌───────────────────────────────────────────────────────────────┐
│ 🏥 Pacientes Atendidos por Enfermedad y Sede               │
├───────────────────────────────────────────────────────────────┤
│  Enfermedad/Diagnóstico    │ Sede         │ Total Pacientes │
├───────────────────────────────────────────────────────────────┤
│ Hipertensión Arterial      │ Sede Centro  │       45 (↑)    │
│ Diabetes Tipo 2            │ Sede Centro  │       32        │
│ Hipertensión Arterial      │ Sede Sur     │       28        │
│ Asma                        │ Sede Centro  │       22        │
│ Infección Respiratoria      │ Sede Norte   │       18        │
│ Gastritis                   │ Sede Sur     │       15        │
│ ...                         │ ...          │       ...       │
└───────────────────────────────────────────────────────────────┘
Total destacado en color turquesa
```

### 6. Historias Clínicas Replicadas
```
┌────────────────────────────────────────────────────────────────┐
│ 📋 Historias Clínicas Replicadas Entre Sedes                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Carlos Mendoza              [2 sedes • 3 registros]           │
│ ├─ Sede Centro                                                │
│ │  └─ 15/11/25 - Fractura de tibia                            │
│ └─ Sede Sur                                                   │
│    └─ 01/12/25 - Seguimiento post-quirúrgico                 │
│                                                                 │
│ Rosa Gutiérrez             [3 sedes • 5 registros]           │
│ ├─ Sede Centro                                                │
│ │  └─ 10/11/25 - Arritmia cardíaca                            │
│ ├─ Sede Sur                                                   │
│ │  └─ 15/11/25 - Electrocardiograma                           │
│ └─ Sede Este                                                  │
│    └─ 25/11/25 - Control cardíaco                             │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
Tarjetas por paciente con desglose por sede
```

---

## Flujo de Interacción

```
Usuario (ADMIN/MEDICO)
       │
       ↓
┌─────────────────────────────────────────┐
│ Menú Principal                          │
│ • Inicio                                │
│ • Analítica Médica                      │
│ • Métricas                              │
│ • Métricas Avanzadas ← NUEVO 📉         │
│ • Sedes                                 │
│ ... (más opciones)                      │
└─────────────────────────────────────────┘
       │
       ↓ Click en "Métricas Avanzadas"
       │
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: App.js                                            │
│ • paginaActual = "metricas_avanzadas"                       │
│ • Inicia 6 requests en paralelo                             │
│ • Muestra loading spinner                                   │
└─────────────────────────────────────────────────────────────┘
       │
       ├─→ GET /api/metricas/medicos-mas-consultas/
       ├─→ GET /api/metricas/tiempo-cita-diagnostico/
       ├─→ GET /api/metricas/auditoria-historias/
       ├─→ GET /api/metricas/departamentos-compartidos/
       ├─→ GET /api/metricas/pacientes-por-enfermedad-sede/
       └─→ GET /api/metricas/historias-replicadas/
       │
┌─────────────────────────────────────────────────────────────┐
│ BACKEND: Django REST API                                    │
│ • Valida autenticación (X-Empleado-Id header)               │
│ • Ejecuta queries a PostgreSQL                              │
│ • Retorna JSON estructurado                                 │
└─────────────────────────────────────────────────────────────┘
       │
       ↓ Response recibida
       │
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: Renderización                                     │
│ • setMedicosConsultas(data)                                 │
│ • setTiempoPromedio(data)                                   │
│ • setAuditoriaHistorias(data)                               │
│ • ... (todos los estados)                                   │
│ • setCargandoMetricasAvanzadas(false)                       │
└─────────────────────────────────────────────────────────────┘
       │
       ↓ Render del JSX
       │
┌─────────────────────────────────────────────────────────────┐
│ PANTALLA: 6 Secciones Estilizadas                           │
│ ├─ Médicos + Gráfica                                         │
│ ├─ Tiempo Promedio (Tarjetas)                                │
│ ├─ Auditoría (Tabla)                                         │
│ ├─ Equipamiento Compartido (Tarjetas)                        │
│ ├─ Pacientes por Enfermedad (Tabla)                          │
│ └─ Historias Replicadas (Tarjetas)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Estilos CSS Implementados

### Contenedores Principales
```javascript
{
  backgroundColor: "#f5f5f5",
  padding: "2rem",
  borderRadius: "8px",
  marginBottom: "2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}
```

### Tarjetas Destacadas
```javascript
{
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  border: "3px solid #388e3c",  // Color temático
  textAlign: "center"
}
```

### Tablas
```javascript
// Header
{
  backgroundColor: "#388e3c",  // Color temático
  color: "white",
  padding: "0.75rem",
  textAlign: "left",
  borderBottom: "2px solid #388e3c"
}

// Filas alternadas
{
  backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white"
}

// Celdas
{
  padding: "0.75rem",
  borderBottom: "1px solid #ddd"
}
```

### Gráficas
```javascript
{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem"
}
```

---

## Responsividad

### Desktop (1024px+)
- Grid de 2 columnas para gráficas
- Tablas completas con scroll horizontal si es necesario
- Tarjetas en grid automático

### Tablet (768px - 1023px)
- Grid de 1-2 columnas según espacio
- Tablas con scroll horizontal

### Mobile (<768px)
- Grid de 1 columna
- Tablas apiladas (necesita mejora futura)

---

## Paleta de Colores por Métrica

```
Médicos:          Azul Primario (#1976d2)
Tiempo Promedio:  Multi-color (Azul, Azul Oscuro, Naranja)
Auditoría:        Rojo (#d32f2f)
Equipamiento:     Púrpura (#7b1fa2)
Pacientes:        Turquesa (#00897b)
Historias:        Marrón/Dorado (#6f5c00)
```

---

## Accesibilidad

✅ Contraste de colores adecuado
✅ Texto descriptivo en encabezados
✅ Tablas con thead/tbody correctos
✅ Títulos jerárquicos (h3, h4)
✅ Información del loading y error

---

## Performance

### Optimizaciones Implementadas
- Promise.all() para cargas paralelas
- Límites de datos (slice 15, slice 10)
- Queryset optimizado con values() y distinct()
- Cache implícito por React

### Tiempo de Carga Esperado
- Frontend: <100ms (con datos cacheados)
- API: 200-500ms (dependiendo de la BD)
- Total: 500ms - 1s

