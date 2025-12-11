# 📊 Métricas Avanzadas - HIS+

## Descripción General

Se han implementado **6 nuevas métricas avanzadas** en el sistema HIS+ con gráficas estilizadas y atractivas visualmente. Todas las métricas obtienen sus datos directamente de la base de datos PostgreSQL.

---

## 1. 👨‍⚕️ Médicos con Mayor Número de Consultas (Última Semana)

### Descripción
Muestra los médicos con más consultas atendidas en la última semana.

### Endpoint
```
GET /api/metricas/medicos-mas-consultas/
```

### Respuesta
```json
[
  {
    "empleado_id": 1,
    "nombre_medico": "Dr. Juan García",
    "total_consultas": 15
  },
  {
    "empleado_id": 2,
    "nombre_medico": "Dra. María López",
    "total_consultas": 12
  }
]
```

### Visualización
- **Gráfica**: Gráfico de barras horizontal con colores variados
- **Tabla**: Detalle de cada médico con número de consultas
- **Colores**: Azul, Verde, Naranja, Púrpura, etc.

---

## 2. ⏱️ Tiempo Promedio: Cita → Diagnóstico

### Descripción
Reporta el tiempo promedio entre que se crea una cita y se registra el diagnóstico en la historia clínica.

### Endpoint
```
GET /api/metricas/tiempo-cita-diagnostico/
```

### Respuesta
```json
{
  "tiempo_promedio_horas": 24.5,
  "tiempo_promedio_dias": 1.02,
  "total_historias_analizadas": 150
}
```

### Visualización
- **Tarjetas Destacadas**: 
  - Tiempo en horas (color azul)
  - Tiempo en días (color azul oscuro)
  - Total de historias analizadas (color naranja)
- **Estilo**: Tarjetas grandes y prominentes con bordes coloreados

---

## 3. 🔍 Últimos 10 Accesos a Historias Clínicas (Auditoría)

### Descripción
Informe de auditoría mostrando los últimos 10 accesos a la tabla de Historias Clínicas, incluyendo quién, cuándo y desde dónde.

### Endpoint
```
GET /api/metricas/auditoria-historias/
```

### Respuesta
```json
[
  {
    "fecha_evento": "2025-12-11T14:30:45Z",
    "accion": "CREATE",
    "empleado": "Dr. García",
    "rol": "MEDICO",
    "ip_origen": "192.168.1.100"
  },
  {
    "fecha_evento": "2025-12-11T13:15:20Z",
    "accion": "UPDATE",
    "empleado": "Admin",
    "rol": "ADMIN",
    "ip_origen": "192.168.1.50"
  }
]
```

### Visualización
- **Tabla**: Datos de auditoría en formato tabular
- **Colores por Acción**:
  - CREATE: Verde
  - UPDATE: Naranja
  - DELETE: Rojo
- **Información**: Fecha/hora, acción, empleado, rol, IP origen

---

## 4. 🔗 Equipamiento Compartido Entre Sedes

### Descripción
Consulta qué departamentos de diferentes sedes comparten tipos de equipamiento.

### Endpoint
```
GET /api/metricas/departamentos-compartidos/
```

### Respuesta
```json
{
  "Resonancia Magnética": [
    {
      "depto_id": 1,
      "depto_nombre": "Radiología",
      "sede_nombre": "Sede Centro",
      "sede_id": 1
    },
    {
      "depto_id": 5,
      "depto_nombre": "Radiología",
      "sede_nombre": "Sede Sur",
      "sede_id": 2
    }
  ],
  "Ecógrafo": [
    {
      "depto_id": 2,
      "depto_nombre": "Obstetricia",
      "sede_nombre": "Sede Centro",
      "sede_id": 1
    },
    {
      "depto_id": 8,
      "depto_nombre": "Obstetricia",
      "sede_nombre": "Sede Norte",
      "sede_id": 3
    }
  ]
}
```

### Visualización
- **Tarjetas por Tipo de Equipamiento**: Cada tipo de equipamiento en una tarjeta separada
- **Color**: Púrpura con bordes destacados
- **Contenido**: Lista de departamentos y sedes que lo comparten

---

## 5. 🏥 Pacientes Atendidos por Enfermedad y Sede

### Descripción
Calcula el total de pacientes atendidos por enfermedad (diagnóstico) y sede.

### Endpoint
```
GET /api/metricas/pacientes-por-enfermedad-sede/
```

### Respuesta
```json
[
  {
    "enfermedad": "Hipertensión Arterial",
    "sede": "Sede Centro",
    "sede_id": 1,
    "total_pacientes": 45
  },
  {
    "enfermedad": "Diabetes Tipo 2",
    "sede": "Sede Centro",
    "sede_id": 1,
    "total_pacientes": 32
  },
  {
    "enfermedad": "Hipertensión Arterial",
    "sede": "Sede Sur",
    "sede_id": 2,
    "total_pacientes": 28
  }
]
```

### Visualización
- **Tabla Detallada**: Con columnas de Enfermedad, Sede y Total de Pacientes
- **Colores**: Fila alternada blanco/gris para mejor lectura
- **Destacado**: Total de pacientes en color turquesa

---

## 6. 📋 Historias Clínicas Replicadas Entre Sedes

### Descripción
Vista consolidada de historias clínicas de pacientes que tienen registros en múltiples sedes. Útil para identificar traslados y continuidad de atención.

### Endpoint
```
GET /api/metricas/historias-replicadas/
```

### Respuesta
```json
[
  {
    "paciente_id": 5,
    "nombre_paciente": "Carlos Mendoza",
    "total_sedes": 2,
    "total_historias": 3,
    "historias_por_sede": [
      {
        "sede_nombre": "Sede Centro",
        "sede_id": 1,
        "fecha_registro": "2025-11-15T10:30:00Z",
        "diagnostico": "Fractura de tibia"
      },
      {
        "sede_nombre": "Sede Sur",
        "sede_id": 2,
        "fecha_registro": "2025-12-01T14:15:00Z",
        "diagnostico": "Seguimiento post-quirúrgico"
      }
    ]
  },
  {
    "paciente_id": 12,
    "nombre_paciente": "Rosa Gutiérrez",
    "total_sedes": 3,
    "total_historias": 5,
    "historias_por_sede": [...]
  }
]
```

### Visualización
- **Tarjetas por Paciente**: Cada paciente es una tarjeta expandible
- **Encabezado**: Nombre del paciente, número de sedes y registros
- **Detalles**: Historias agrupadas por sede con fecha y diagnóstico
- **Colores**: Marrón/Dorado con bordes destacados

---

## Acceso y Permisos

### Quién puede acceder a las Métricas Avanzadas
- ✅ **ADMIN**: Acceso completo a todas las métricas
- ✅ **MEDICO**: Acceso completo a todas las métricas
- ❌ **ENFERMERO**: No tiene acceso
- ❌ **ADM**: No tiene acceso

### Ubicación en el Menú
La opción "Métricas Avanzadas" 📉 aparece en el menú principal para:
- ADMIN: Menú completo
- MEDICO: Menú del médico

---

## Implementación Técnica

### Backend
**Archivo**: `/backend/his/views.py`

6 nuevas clases APIView implementadas:
1. `MedicosConMasConsultasView` - Consulta citas de la última semana
2. `TiempoPromedioCitaDiagnosticoView` - Calcula diferencia entre cita e historia clínica
3. `AuditoriaHistoriasView` - Obtiene registros de auditoría
4. `DepartamentosCompartidosView` - Agrupa equipamiento por tipo
5. `PacientesPorEnfermedadSedeView` - Agrupa historias por diagnóstico y sede
6. `HistoriasClinicasReplicadasView` - Pacientes con múltiples sedes

### Frontend
**Archivo**: `/frontend/src/App.js`

**Nuevas Importaciones**:
- `Line`, `Pie`, `Doughnut` de `react-chartjs-2`
- Registro de `PointElement`, `LineElement`, `ArcElement` en ChartJS

**Nuevos Estados**:
```javascript
const [medicosConsultas, setMedicosConsultas] = useState([]);
const [tiempoPromedio, setTiempoPromedio] = useState(null);
const [auditoriaHistorias, setAuditoriaHistorias] = useState([]);
const [departamentosCompartidos, setDepartamentosCompartidos] = useState({});
const [pacientesEnfermedad, setPacientesEnfermedad] = useState([]);
const [historiasReplicadas, setHistoriasReplicadas] = useState([]);
const [cargandoMetricasAvanzadas, setCargandoMetricasAvanzadas] = useState(false);
const [errorMetricasAvanzadas, setErrorMetricasAvanzadas] = useState(null);
```

**Nuevo useEffect**:
- Carga todas 6 métricas en paralelo cuando `paginaActual === "metricas_avanzadas"`
- Maneja errores y estado de carga
- Headers de autenticación incluidos

**Nueva Sección UI**:
- Componente JSX con 6 subsecciones
- Estilos inline con colores coordenados
- Gráficas y tablas estilizadas
- Diseño responsivo con CSS Grid

---

## Guía de Colores

### Paleta de Colores Utilizada
```
Azul Primario:      #1976d2
Azul Oscuro:        #1565c0
Verde:              #388e3c
Naranja:            #f57c00
Púrpura:            #7b1fa2
Rojo:               #d32f2f
Turquesa:           #00897b
Marrón/Dorado:      #6f5c00
Gris Claro:         #f5f5f5
Gris Medio:         #999
Gris Oscuro:        #333
```

---

## Notas de Implementación

### Queryset Optimizaciones
- Uso de `select_related()` y `values()` para optimizar consultas
- `distinct()` en conteos para evitar duplicados
- `order_by()` para resultados ordenados

### Manejo de Errores
- Try/catch en vistas backend
- Try/catch en fetch frontend
- Mensajes de error descriptivos

### Performance
- Carga paralela de 6 endpoints (Promise.all)
- Límites de datos (últimos 10, top 10, slice 15)
- Caching implícito por React

---

## Próximas Mejoras Potenciales

1. **Exportar a PDF**: Descargar reportes en PDF
2. **Filtros Temporales**: Seleccionar rango de fechas
3. **Gráficas Interactivas**: Expandir datos con hover
4. **Comparativas**: Comparar períodos anteriores
5. **Alertas Automáticas**: Notificaciones de anomalías
6. **Programar Reportes**: Envío automático por email

