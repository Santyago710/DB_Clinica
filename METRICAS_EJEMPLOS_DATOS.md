# 📊 Ejemplos de Datos y Visualización - Métricas Avanzadas

## Ejemplo 1: Médicos con Mayor Número de Consultas

### Datos JSON de Ejemplo
```json
[
  {
    "empleado_id": 1,
    "nombre_medico": "Dr. Juan García Martínez",
    "total_consultas": 18
  },
  {
    "empleado_id": 5,
    "nombre_medico": "Dra. María López Rodríguez",
    "total_consultas": 15
  },
  {
    "empleado_id": 3,
    "nombre_medico": "Dr. Carlos Pérez Jiménez",
    "total_consultas": 12
  },
  {
    "empleado_id": 8,
    "nombre_medico": "Dra. Ana Ruiz Fernández",
    "total_consultas": 11
  },
  {
    "empleado_id": 2,
    "nombre_medico": "Dr. Roberto Gómez López",
    "total_consultas": 9
  },
  {
    "empleado_id": 6,
    "nombre_medico": "Dra. Laura Sánchez Díaz",
    "total_consultas": 8
  },
  {
    "empleado_id": 4,
    "nombre_medico": "Dr. Miguel Fernández Acosta",
    "total_consultas": 7
  },
  {
    "empleado_id": 7,
    "nombre_medico": "Dra. Paula Martínez Ramos",
    "total_consultas": 6
  },
  {
    "empleado_id": 9,
    "nombre_medico": "Dr. Antonio Gómez Castro",
    "total_consultas": 5
  },
  {
    "empleado_id": 10,
    "nombre_medico": "Dra. Sofía Blanco Herrera",
    "total_consultas": 4
  }
]
```

### Visualización en Interfaz
```
┌─────────────────────────────────────────────────────────────────────┐
│ 👨‍⚕️ Médicos con Mayor Número de Consultas (Última Semana)           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Gráfica                           │ Tabla Detallada                 │
│ ───────────────────────────────   │ ──────────────────────────     │
│ Dr. García           ███████████████ 18  │ Dr. García García     18 │
│ Dra. López           ██████████ 15       │ Dra. López López      15 │
│ Dr. Pérez            ████████ 12         │ Dr. Pérez Pérez       12 │
│ Dra. Ruiz            ███████ 11          │ Dra. Ruiz Ruiz        11 │
│ Dr. Gómez            █████ 9              │ Dr. Gómez Gómez        9 │
│ Dra. Sánchez         ████ 8               │ Dra. Sánchez Sánchez   8 │
│ Dr. Fernández        ███ 7                │ Dr. Fernández Fdo.     7 │
│ Dra. Martínez        ██ 6                 │ Dra. Martínez Mart.    6 │
│ Dr. Gómez Castro     █ 5                  │ Dr. Gómez Castro       5 │
│ Dra. Blanco          █ 4                  │ Dra. Blanco Blanco     4 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Ejemplo 2: Tiempo Promedio Cita → Diagnóstico

### Datos JSON de Ejemplo
```json
{
  "tiempo_promedio_horas": 24.5,
  "tiempo_promedio_dias": 1.02,
  "total_historias_analizadas": 156
}
```

### Visualización en Interfaz
```
┌────────────────────────────────────────────────────────────────┐
│ ⏱️ Tiempo Promedio: Cita → Diagnóstico                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│   │                  │  │                  │  │            │ │
│   │      24.5 h      │  │      1.02 d      │  │    156     │ │
│   │                  │  │                  │  │            │ │
│   │  Horas Promedio  │  │  Días Promedio   │  │  Historias │ │
│   │     (Azul)       │  │    (Azul)        │  │  (Naranja) │ │
│   │                  │  │                  │  │            │ │
│   └──────────────────┘  └──────────────────┘  └────────────┘ │
│                                                                 │
│   Análisis: El tiempo promedio entre una cita y el registro   │
│   de diagnóstico es de aproximadamente 1 día, lo que indica   │
│   un buen flujo de atención y registro oportuno de datos.     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Ejemplo 3: Auditoría de Historias Clínicas

### Datos JSON de Ejemplo
```json
[
  {
    "fecha_evento": "2025-12-11T14:35:22Z",
    "accion": "CREATE",
    "empleado": "Dr. Juan García",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.45"
  },
  {
    "fecha_evento": "2025-12-11T13:20:15Z",
    "accion": "UPDATE",
    "empleado": "Dra. María López",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.67"
  },
  {
    "fecha_evento": "2025-12-11T12:45:30Z",
    "accion": "CREATE",
    "empleado": "Dr. Carlos Pérez",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.89"
  },
  {
    "fecha_evento": "2025-12-11T11:15:45Z",
    "accion": "UPDATE",
    "empleado": "Admin Sistema",
    "rol": "ADMIN",
    "ip_origen": "192.168.100.20"
  },
  {
    "fecha_evento": "2025-12-11T10:30:10Z",
    "accion": "CREATE",
    "empleado": "Dra. Ana Ruiz",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.72"
  },
  {
    "fecha_evento": "2025-12-10T16:55:22Z",
    "accion": "UPDATE",
    "empleado": "Dr. Roberto Gómez",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.55"
  },
  {
    "fecha_evento": "2025-12-10T15:20:33Z",
    "accion": "CREATE",
    "empleado": "Dra. Laura Sánchez",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.78"
  },
  {
    "fecha_evento": "2025-12-10T14:10:44Z",
    "accion": "UPDATE",
    "empleado": "Dr. Miguel Fernández",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.91"
  },
  {
    "fecha_evento": "2025-12-10T13:00:55Z",
    "accion": "CREATE",
    "empleado": "Dra. Paula Martínez",
    "rol": "MEDICO",
    "ip_origen": "192.168.100.63"
  },
  {
    "fecha_evento": "2025-12-10T11:45:00Z",
    "accion": "UPDATE",
    "empleado": "Admin Sistema",
    "rol": "ADMIN",
    "ip_origen": "192.168.100.20"
  }
]
```

### Visualización en Interfaz
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🔍 Últimos 10 Accesos a Historias Clínicas                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Fecha/Hora         │ Acción │ Empleado            │ Rol    │ IP        │
│─────────────────────┼────────┼─────────────────────┼────────┼──────────│
│ 11/12/2025 14:35:22│ CREATE │ Dr. Juan García     │ MEDICO │ 192.1... │
│ 11/12/2025 13:20:15│ UPDATE │ Dra. María López    │ MEDICO │ 192.1... │
│ 11/12/2025 12:45:30│ CREATE │ Dr. Carlos Pérez    │ MEDICO │ 192.1... │
│ 11/12/2025 11:15:45│ UPDATE │ Admin Sistema       │ ADMIN  │ 192.1... │
│ 11/12/2025 10:30:10│ CREATE │ Dra. Ana Ruiz       │ MEDICO │ 192.1... │
│ 10/12/2025 16:55:22│ UPDATE │ Dr. Roberto Gómez   │ MEDICO │ 192.1... │
│ 10/12/2025 15:20:33│ CREATE │ Dra. Laura Sánchez  │ MEDICO │ 192.1... │
│ 10/12/2025 14:10:44│ UPDATE │ Dr. Miguel Fernández│ MEDICO │ 192.1... │
│ 10/12/2025 13:00:55│ CREATE │ Dra. Paula Martínez │ MEDICO │ 192.1... │
│ 10/12/2025 11:45:00│ UPDATE │ Admin Sistema       │ ADMIN  │ 192.1... │
│                                                                            │
│ Leyenda de Colores:                                                      │
│ 🟢 CREATE (Verde)  🟠 UPDATE (Naranja)  🔴 DELETE (Rojo)               │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Ejemplo 4: Equipamiento Compartido Entre Sedes

### Datos JSON de Ejemplo
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
      "depto_id": 6,
      "depto_nombre": "Radiología",
      "sede_nombre": "Sede Sur",
      "sede_id": 2
    },
    {
      "depto_id": 11,
      "depto_nombre": "Radiología",
      "sede_nombre": "Sede Norte",
      "sede_id": 3
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
      "depto_id": 7,
      "depto_nombre": "Obstetricia",
      "sede_nombre": "Sede Sur",
      "sede_id": 2
    }
  ],
  "Tomógrafo": [
    {
      "depto_id": 3,
      "depto_nombre": "Urgencias",
      "sede_nombre": "Sede Centro",
      "sede_id": 1
    },
    {
      "depto_id": 8,
      "depto_nombre": "Urgencias",
      "sede_nombre": "Sede Norte",
      "sede_id": 3
    },
    {
      "depto_id": 13,
      "depto_nombre": "Urgencias",
      "sede_nombre": "Sede Este",
      "sede_id": 4
    }
  ],
  "Desfibrilador Automático": [
    {
      "depto_id": 4,
      "depto_nombre": "Cardiología",
      "sede_nombre": "Sede Centro",
      "sede_id": 1
    },
    {
      "depto_id": 9,
      "depto_nombre": "Cardiología",
      "sede_nombre": "Sede Sur",
      "sede_id": 2
    }
  ]
}
```

### Visualización en Interfaz
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🔗 Equipamiento Compartido Entre Sedes                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────┐  ┌────────────────────────┐              │
│  │ Resonancia Magnética     │  │ Ecógrafo               │              │
│  ├──────────────────────────┤  ├────────────────────────┤              │
│  │ • Radiología             │  │ • Obstetricia          │              │
│  │   (Sede Centro)          │  │   (Sede Centro)        │              │
│  │ • Radiología             │  │ • Obstetricia          │              │
│  │   (Sede Sur)             │  │   (Sede Sur)           │              │
│  │ • Radiología             │  │                        │              │
│  │   (Sede Norte)           │  │                        │              │
│  └──────────────────────────┘  └────────────────────────┘              │
│                                                                           │
│  ┌──────────────────────────┐  ┌────────────────────────┐              │
│  │ Tomógrafo                │  │ Desfibrilador Auto.    │              │
│  ├──────────────────────────┤  ├────────────────────────┤              │
│  │ • Urgencias              │  │ • Cardiología          │              │
│  │   (Sede Centro)          │  │   (Sede Centro)        │              │
│  │ • Urgencias              │  │ • Cardiología          │              │
│  │   (Sede Norte)           │  │   (Sede Sur)           │              │
│  │ • Urgencias              │  │                        │              │
│  │   (Sede Este)            │  │                        │              │
│  └──────────────────────────┘  └────────────────────────┘              │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Ejemplo 5: Pacientes por Enfermedad y Sede

### Datos JSON de Ejemplo
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
  },
  {
    "enfermedad": "Asma",
    "sede": "Sede Centro",
    "sede_id": 1,
    "total_pacientes": 22
  },
  {
    "enfermedad": "Infección Respiratoria",
    "sede": "Sede Norte",
    "sede_id": 3,
    "total_pacientes": 18
  },
  {
    "enfermedad": "Gastritis",
    "sede": "Sede Sur",
    "sede_id": 2,
    "total_pacientes": 15
  },
  {
    "enfermedad": "Diabetes Tipo 2",
    "sede": "Sede Sur",
    "sede_id": 2,
    "total_pacientes": 14
  },
  {
    "enfermedad": "Colesterol Alto",
    "sede": "Sede Centro",
    "sede_id": 1,
    "total_pacientes": 12
  },
  {
    "enfermedad": "Asma",
    "sede": "Sede Norte",
    "sede_id": 3,
    "total_pacientes": 11
  },
  {
    "enfermedad": "Infecciones Urinarias",
    "sede": "Sede Centro",
    "sede_id": 1,
    "total_pacientes": 10
  },
  {
    "enfermedad": "Migraña",
    "sede": "Sede Sur",
    "sede_id": 2,
    "total_pacientes": 9
  },
  {
    "enfermedad": "Osteoporosis",
    "sede": "Sede Norte",
    "sede_id": 3,
    "total_pacientes": 8
  },
  {
    "enfermedad": "Depresión",
    "sede": "Sede Centro",
    "sede_id": 1,
    "total_pacientes": 7
  },
  {
    "enfermedad": "Artritis Reumatoide",
    "sede": "Sede Sur",
    "sede_id": 2,
    "total_pacientes": 6
  },
  {
    "enfermedad": "Hipotiroidismo",
    "sede": "Sede Norte",
    "sede_id": 3,
    "total_pacientes": 5
  }
]
```

### Visualización en Interfaz
```
┌──────────────────────────────────────────────────────────────────┐
│ 🏥 Pacientes Atendidos por Enfermedad y Sede                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Enfermedad/Diagnóstico    │ Sede           │ Total Pacientes  │
│────────────────────────────┼────────────────┼─────────────────│
│ Hipertensión Arterial      │ Sede Centro    │        45 ▲     │
│ Diabetes Tipo 2            │ Sede Centro    │        32       │
│ Hipertensión Arterial      │ Sede Sur       │        28       │
│ Asma                        │ Sede Centro    │        22       │
│ Infección Respiratoria      │ Sede Norte     │        18       │
│ Gastritis                   │ Sede Sur       │        15       │
│ Diabetes Tipo 2            │ Sede Sur       │        14       │
│ Colesterol Alto            │ Sede Centro    │        12       │
│ Asma                        │ Sede Norte     │        11       │
│ Infecciones Urinarias      │ Sede Centro    │        10       │
│ Migraña                    │ Sede Sur       │         9       │
│ Osteoporosis               │ Sede Norte     │         8       │
│ Depresión                  │ Sede Centro    │         7       │
│ Artritis Reumatoide        │ Sede Sur       │         6       │
│ Hipotiroidismo             │ Sede Norte     │         5       │
│                                                                   │
│ ▲ Enfermedad más común: Hipertensión Arterial (73 pacientes)   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Ejemplo 6: Historias Clínicas Replicadas

### Datos JSON de Ejemplo
```json
[
  {
    "paciente_id": 5,
    "nombre_paciente": "Carlos Mendoza García",
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
      },
      {
        "sede_nombre": "Sede Centro",
        "sede_id": 1,
        "fecha_registro": "2025-12-08T11:45:00Z",
        "diagnostico": "Consolidación ósea progresiva"
      }
    ]
  },
  {
    "paciente_id": 12,
    "nombre_paciente": "Rosa Gutiérrez López",
    "total_sedes": 3,
    "total_historias": 5,
    "historias_por_sede": [
      {
        "sede_nombre": "Sede Centro",
        "sede_id": 1,
        "fecha_registro": "2025-10-05T09:20:00Z",
        "diagnostico": "Arritmia cardíaca"
      },
      {
        "sede_nombre": "Sede Sur",
        "sede_id": 2,
        "fecha_registro": "2025-10-20T15:30:00Z",
        "diagnostico": "Electrocardiograma de control"
      },
      {
        "sede_nombre": "Sede Este",
        "sede_id": 4,
        "fecha_registro": "2025-11-10T13:00:00Z",
        "diagnostico": "Consulta especializada cardiólogo"
      },
      {
        "sede_nombre": "Sede Centro",
        "sede_id": 1,
        "fecha_registro": "2025-11-25T10:15:00Z",
        "diagnostico": "Ajuste de medicación"
      },
      {
        "sede_nombre": "Sede Sur",
        "sede_id": 2,
        "fecha_registro": "2025-12-05T14:45:00Z",
        "diagnostico": "Seguimiento trimestral"
      }
    ]
  },
  {
    "paciente_id": 18,
    "nombre_paciente": "Juan Rodríguez Fernández",
    "total_sedes": 2,
    "total_historias": 2,
    "historias_por_sede": [
      {
        "sede_nombre": "Sede Centro",
        "sede_id": 1,
        "fecha_registro": "2025-11-20T08:50:00Z",
        "diagnostico": "Diabetes Tipo 2 - Diagnóstico inicial"
      },
      {
        "sede_nombre": "Sede Norte",
        "sede_id": 3,
        "fecha_registro": "2025-12-03T16:20:00Z",
        "diagnostico": "Educación diabetológica y manejo"
      }
    ]
  }
]
```

### Visualización en Interfaz
```
┌─────────────────────────────────────────────────────────────────────┐
│ 📋 Historias Clínicas Replicadas Entre Sedes                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Carlos Mendoza García                [2 sedes • 3 registros]       │
│ ├─ 📅 Sede Centro                                                   │
│ │  ├─ 15/11/2025 - Fractura de tibia                              │
│ │  └─ 08/12/2025 - Consolidación ósea progresiva                  │
│ └─ 📅 Sede Sur                                                      │
│    └─ 01/12/2025 - Seguimiento post-quirúrgico                    │
│                                                                      │
│ Rosa Gutiérrez López                 [3 sedes • 5 registros]       │
│ ├─ 📅 Sede Centro                                                   │
│ │  ├─ 05/10/2025 - Arritmia cardíaca                              │
│ │  └─ 25/11/2025 - Ajuste de medicación                           │
│ ├─ 📅 Sede Sur                                                      │
│ │  ├─ 20/10/2025 - Electrocardiograma de control                  │
│ │  └─ 05/12/2025 - Seguimiento trimestral                         │
│ └─ 📅 Sede Este                                                     │
│    └─ 10/11/2025 - Consulta especializada cardiólogo              │
│                                                                      │
│ Juan Rodríguez Fernández             [2 sedes • 2 registros]       │
│ ├─ 📅 Sede Centro                                                   │
│ │  └─ 20/11/2025 - Diabetes Tipo 2 - Diagnóstico inicial         │
│ └─ 📅 Sede Norte                                                    │
│    └─ 03/12/2025 - Educación diabetológica y manejo              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Comparativa de Métricas

### Resumen de Datos Esperados
```
┌─────────────────────────────────────────────────────────────┐
│ MÉTRICA                    │ RANGO TÍPICO    │ REFERENCIA   │
├─────────────────────────────────────────────────────────────┤
│ Consultas por Médico       │ 3-20 /semana    │ ≈ 10 promedio│
│ Tiempo Cita-Diagnóstico    │ 4h - 72h        │ ≈ 24h ideal  │
│ Registros de Auditoría     │ 10 últimos      │ Histórico    │
│ Tipos Equipamiento Shared  │ 2-8 tipos       │ Inventario   │
│ Pacientes/Enfermedad       │ 5-50 /sede      │ Prevalencia  │
│ Historias Replicadas       │ 5-20% pacientes │ Traslados    │
└─────────────────────────────────────────────────────────────┘
```

---

## Insights Típicos a Partir de los Datos

### Desde Médicos con Más Consultas
- ✅ Identifica médicos con mayor carga
- ✅ Detecta posibles sobrecargas
- ✅ Planifica cobertura de turnos

### Desde Tiempo Cita-Diagnóstico
- ✅ Evalúa eficiencia del proceso
- ✅ Identifica cuellos de botella
- ✅ Mejora tiempos de respuesta

### Desde Auditoría
- ✅ Trazabilidad completa de cambios
- ✅ Detecta accesos no autorizados
- ✅ Cumplimiento normativo

### Desde Equipamiento Compartido
- ✅ Optimiza recursos entre sedes
- ✅ Planifica mantenimiento coordinado
- ✅ Identifica duplicaciones

### Desde Pacientes por Enfermedad
- ✅ Detecta epidemiología local
- ✅ Planifica personal especializado
- ✅ Asigna presupuesto por patología

### Desde Historias Replicadas
- ✅ Mejora continuidad de atención
- ✅ Detecta fragmentación de historias
- ✅ Identifica transferencias entre sedes

---

## Consideraciones de Implementación

### Base de Datos
- Índices en tablas: `Citas`, `Historias_Clinicas`, `Auditoria_Accesos`
- Particionamiento por fecha para auditoría
- Vistas materializadas para reportes frecuentes

### Frontend
- Caché de datos con localStorage
- Debounce en búsquedas/filtros
- Lazy loading de tablas largas

### Seguridad
- Validación de permisos en backend
- Sanitización de datos en frontend
- Rate limiting en endpoints

