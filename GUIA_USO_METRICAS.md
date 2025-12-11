# 🚀 Guía de Uso - Métricas Avanzadas HIS+

## 📋 Índice de Contenidos
1. Acceso a Métricas Avanzadas
2. Descripción de cada Métrica
3. Interpretación de Datos
4. Troubleshooting
5. Preguntas Frecuentes

---

## 1️⃣ Acceso a Métricas Avanzadas

### Requisitos
- ✅ Ser usuario ADMIN o MEDICO
- ✅ Estar autenticado en el sistema
- ✅ Conexión activa a la API

### Pasos para Acceder

1. **Login en el Sistema**
   - Ingresa correo y contraseña
   - Click en "Ingresar"

2. **Menú Principal**
   - Verás el menú en el lado izquierdo
   - Busca "Métricas Avanzadas" 📉

3. **Hacer Click**
   - La página cargará todas las métricas
   - Espera 1-2 segundos mientras se cargan los datos

4. **Ver Resultados**
   - Se mostrarán 6 secciones diferentes
   - Cada una con gráficas y tablas

---

## 2️⃣ Descripción de Cada Métrica

### 📊 Métrica 1: Médicos con Mayor Número de Consultas

**¿Qué muestra?**
- Los 10 médicos que atendieron más citas esta última semana
- Número exacto de consultas por médico

**¿Dónde la veo?**
- Primera sección (superior)
- Con gráfica de barras y tabla

**¿Cómo interpretarla?**
```
Si Dr. García tiene 18 consultas:
- Consultó a 18 pacientes esta semana
- Es el más activo del equipo
- Posible sobrecarga de trabajo
```

**Acciones sugeridas:**
- Redistribuir carga si es muy alta
- Reconocer a médicos productivos
- Ajustar horarios según demanda

---

### ⏱️ Métrica 2: Tiempo Promedio Cita → Diagnóstico

**¿Qué muestra?**
- Tiempo promedio entre que se crea una cita y se registra el diagnóstico
- Se expresa en horas y días
- Total de historias clínicas analizadas

**¿Dónde la veo?**
- Segunda sección
- Tres tarjetas grandes con números destacados

**¿Cómo interpretarla?**
```
Si el promedio es 24.5 horas:
- Tardan aprox. 1 día en registrar diagnóstico
- Es un tiempo razonable
- Menos de 1 hora = muy rápido (excelente)
- Más de 48 horas = muy lento (mejorar)
```

**Referencias de Tiempo Aceptable:**
- ✅ Bueno: 2-24 horas
- ⚠️ Aceptable: 24-48 horas
- ❌ Problema: >48 horas

---

### 🔍 Métrica 3: Auditoría de Historias Clínicas

**¿Qué muestra?**
- Los últimos 10 accesos a la tabla de Historias Clínicas
- Quién accedió, cuándo, qué hizo e IP de origen

**¿Dónde la veo?**
- Tercera sección
- Tabla con 5 columnas

**Columnas de la Tabla:**
| Columna | Significa |
|---------|-----------|
| Fecha/Hora | Cuándo se accedió |
| Acción | CREATE, UPDATE, DELETE |
| Empleado | Nombre del usuario |
| Rol | ADMIN, MEDICO, etc. |
| IP Origen | De dónde se conectó |

**Códigos de Color:**
- 🟢 **CREATE**: Creación de nuevo registro
- 🟠 **UPDATE**: Modificación de registro
- 🔴 **DELETE**: Eliminación de registro

**¿Cómo usarla?**
- Verificar quién modifica historias clínicas
- Detectar accesos sospechosos
- Auditoría de seguridad
- Cumplimiento regulatorio

---

### 🔗 Métrica 4: Equipamiento Compartido Entre Sedes

**¿Qué muestra?**
- Qué tipos de equipamiento existen en múltiples sedes
- Qué departamentos los utilizan
- En cuál sede está instalado

**¿Dónde la veo?**
- Cuarta sección
- Tarjetas agrupadas por tipo de equipo

**Ejemplo de Lectura:**
```
Resonancia Magnética:
├─ Radiología (Sede Centro)
├─ Radiología (Sede Sur)
└─ Radiología (Sede Norte)

= El mismo equipo está en 3 sedes
```

**¿Cómo usarla?**
- Planificar mantenimiento coordinado
- Optimizar uso de recursos
- Detectar duplicaciones innecesarias
- Coordinar turnos entre sedes

---

### 🏥 Métrica 5: Pacientes por Enfermedad y Sede

**¿Qué muestra?**
- Cuántos pacientes con cada diagnóstico se atienden por sede
- Enfermedades más comunes
- Carga por ubicación

**¿Dónde la veo?**
- Quinta sección
- Tabla con 3 columnas

**Columnas:**
| Columna | Significa |
|---------|-----------|
| Enfermedad/Diagnóstico | Tipo de padecimiento |
| Sede | Ubicación |
| Total Pacientes | Cantidad atendida |

**Ejemplo de Lectura:**
```
Hipertensión Arterial | Sede Centro | 45 pacientes
= 45 hipertensos son atendidos en Sede Centro
```

**¿Cómo usarla?**
- Detectar epidemiología local
- Asignar especialistas según demanda
- Gestionar medicamentos por sede
- Planificar capacitación médica

---

### 📋 Métrica 6: Historias Clínicas Replicadas

**¿Qué muestra?**
- Pacientes que tienen historias clínicas en múltiples sedes
- Cuántas sedes los han atendido
- Cronología de registros por sede

**¿Dónde la veo?**
- Sexta sección (última)
- Tarjetas expandibles por paciente

**Ejemplo de Lectura:**
```
Carlos Mendoza [2 sedes • 3 registros]
├─ Sede Centro
│  ├─ 15/11/2025 - Fractura de tibia
│  └─ 08/12/2025 - Consolidación ósea
└─ Sede Sur
   └─ 01/12/2025 - Seguimiento

= Carlos fue atendido en 2 lugares,
  tiene 3 registros históricos,
  continuidad de atención
```

**¿Cómo usarla?**
- Garantizar continuidad de atención
- Detectar fragmentación de historias
- Seguimiento de pacientes trasladados
- Integración de información

---

## 3️⃣ Interpretación de Datos

### Señales Positivas (Todo va bien)
- ✅ Médicos con consultas distribuidas (no hay concentración)
- ✅ Tiempo cita-diagnóstico < 24 horas
- ✅ Auditoría con accesos normales
- ✅ Equipamiento compartido eficientemente
- ✅ Pacientes distribuidos por enfermedad
- ✅ Historias replicadas mínimas (fácil continuidad)

### Señales de Alerta (Requiere atención)
- ⚠️ Un médico con muchas más consultas
- ⚠️ Tiempo cita-diagnóstico > 48 horas
- ⚠️ Accesos a histor ias a horas raras
- ⚠️ Equipamiento duplicado innecesariamente
- ⚠️ Enfermedad concentrada en una sede
- ⚠️ Muchas historias replicadas (fragmentación)

### Señales Críticas (Acción inmediata)
- 🔴 Acceso DELETE sin autorización
- 🔴 Accesos desde IP desconocidas
- 🔴 Datos inconsistentes entre sedes
- 🔴 Tiempo cita-diagnóstico > 7 días
- 🔴 Médico sin registros en semana

---

## 4️⃣ Troubleshooting

### Problema: "Cargando métricas..." no termina

**Soluciones:**
1. Recarga la página (F5)
2. Espera 30 segundos más
3. Verifica conexión a internet
4. Contacta al administrador si persiste

### Problema: Aparece error rojo

**Soluciones:**
1. Nota el mensaje de error exacto
2. Verifica que estés logueado como ADMIN o MEDICO
3. Comprueba que tu rol tenga permisos
4. Recarga la página

### Problema: Los datos no coinciden con lo esperado

**Soluciones:**
1. Verifica que los filtros sean correctos
2. Comprueba en la BD directamente
3. Revisa si hay datos incompletos
4. Contacta a IT

### Problema: Las gráficas no se ven

**Soluciones:**
1. Usa un navegador moderno (Chrome, Firefox, Edge)
2. Limpia el caché del navegador
3. Desactiva extensiones bloqueadoras
4. Intenta en navegación privada

---

## 5️⃣ Preguntas Frecuentes

### P: ¿Con qué frecuencia se actualizan los datos?
R: En tiempo real. Cada vez que entras a la página se cargan datos frescos de la BD.

### P: ¿Puedo descargar los datos como PDF?
R: No en esta versión, pero puedes:
- Copiar y pegar tabla en Excel
- Hacer screenshot
- Usar impresión a PDF del navegador

### P: ¿Puedo filtrar por fechas específicas?
R: En esta versión no, pero:
- Médicos: últimos 7 días (automático)
- Tiempo: análisis completo
- Auditoría: últimos 10 registros
- Futuras versiones tendrán filtros

### P: ¿Por qué veo datos que sé que son incorrectos?
R: Posibles causas:
- Datos incompletos en la BD
- Registros sin sincronizar
- Auditoría no activada cuando se creó
- Caché del navegador

Solución: Contacta al administrador

### P: ¿Quién puede ver estas métricas?
R: Solo ADMIN y MEDICO. ENFERMERO y ADM no ven el menú.

### P: ¿Es seguro ver esta información?
R: Sí, está protegida por:
- Autenticación obligatoria
- Control de rol
- Auditoría de accesos
- Protocolo HTTPS

### P: ¿Cómo puedo reportar datos incorrectos?
R: 
1. Toma nota de qué métrica
2. Apunta la hora/fecha
3. Contacta al administrador
4. Provee detalles específicos

---

## 📞 Contacto y Soporte

### Para Problemas Técnicos
- **Email**: admin@hospital.local
- **Teléfono**: Ext. 1234
- **Horario**: L-V 8:00-18:00

### Documentación Técnica
- Ver: `METRICAS_AVANZADAS.md` (detalles API)
- Ver: `METRICAS_AVANZADAS_VISUAL.md` (diseño)
- Ver: `METRICAS_EJEMPLOS_DATOS.md` (ejemplos)

### Feedback
¿Falta alguna métrica? ¿Tienes sugerencias?
Contacta al equipo de desarrollo

---

## 🎓 Tips y Trucos

### Para Aprovechar al Máximo

**1. Revisa las Métricas Regularmente**
- Cada lunes para semana anterior
- Cada mes para tendencias
- Cada trimestre para análisis profundo

**2. Compara Sedes**
- Identifica diferencias entre ubicaciones
- Ajusta recursos según necesidad
- Comparte buenas prácticas

**3. Usa como Base para Decisiones**
- Contratación de personal
- Compra de equipamiento
- Modificación de horarios
- Capacitación especializada

**4. Cruza Información**
- Médicos activos + tiempo de diagnóstico
- Enfermedades comunes + equipamiento
- Historias replicadas + continuidad

**5. Crea Reportes Periódicos**
- Screenshot semanal
- Resumen mensual
- Análisis trimestral
- Tendencias anuales

---

## 📚 Glosario

| Término | Significado |
|---------|------------|
| CREATE | Creación de nuevo registro |
| UPDATE | Modificación de registro existente |
| DELETE | Eliminación de registro |
| Auditoría | Registro de quién hizo qué y cuándo |
| Replicada | Copiada/existente en múltiples lugares |
| Sed e | Sucursal u hospital |
| Diagnóstico | Enfermedad/padecimiento identificado |
| Continuidad | Seguimiento ininterrumpido del paciente |

---

## ✅ Checklist de Uso

Cuando accedas a Métricas Avanzadas:

- [ ] Verifico que sea actualizado (hora actual)
- [ ] Reviso la métrica de médicos (distribuido?)
- [ ] Chequeo tiempo promedio (< 24h?)
- [ ] Reviso auditoría (nada sospechoso?)
- [ ] Analizo equipamiento (optimizado?)
- [ ] Veo pacientes por enfermedad (distribuido?)
- [ ] Confirmo historias replicadas (mínimo?)
- [ ] Anoto hallazgos importantes
- [ ] Comparto con equipo si es necesario
- [ ] Tomo acciones correctivas si aplica

---

**Última Actualización**: 11 de Diciembre de 2025

**Versión**: 1.0

**Estado**: ✅ Operacional

