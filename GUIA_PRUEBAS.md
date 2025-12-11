# 🧪 GUÍA DE PRUEBAS - HIS+ Páginas Implementadas

## Requisitos Previos

1. Django Backend ejecutándose en puerto 8000
2. React Frontend ejecutándose en puerto 3001
3. Base de datos con datos de prueba

---

## 📋 Flujo de Prueba

### PASO 1: Login con Usuario ADMIN

```
URL: http://localhost:3001
Email: admin@hospital.com (o tu usuario ADMIN)
Contraseña: (tu contraseña)
```

**Esperado**: Dashboard con menú completo incluyendo:
- Sedes Hospitalarias 🏥
- Departamentos 🏢
- Gestionar Empleados 👥
- Equipamiento 🔧

---

## 🏥 TEST 1: SEDES HOSPITALARIAS

### 1.1 Crear Nueva Sede

**Pasos**:
1. Click en "Sedes Hospitalarias" del menú
2. Click en "Nueva Sede"
3. Completar formulario:
   ```
   Nombre: Hospital Metropolitano
   Ciudad: Medellín
   Dirección: Cra 45 #10-50
   Teléfono: +57 4 2234567
   ```
4. Click en "Crear"

**Validaciones**:
- ✅ Campo nombre obligatorio
- ✅ Campo ciudad obligatorio
- ✅ Campo dirección obligatorio
- ✅ Campo teléfono obligatorio
- ✅ Registro aparece en tabla
- ✅ Tabla actualiza automáticamente

### 1.2 Editar Sede

**Pasos**:
1. Click en botón "Editar" de una sede
2. Modificar campo "Teléfono": `+57 4 3334444`
3. Click en "Actualizar"

**Validaciones**:
- ✅ Formulario se llena con datos existentes
- ✅ Cambios se guardan
- ✅ Tabla se actualiza

### 1.3 Eliminar Sede

**Pasos**:
1. Click en botón "Eliminar" de una sede
2. Confirmar en diálogo de confirmación
3. Click en "OK"

**Validaciones**:
- ✅ Aparece diálogo de confirmación
- ✅ Sede se elimina si confirma
- ✅ Tabla se actualiza

---

## 🏢 TEST 2: DEPARTAMENTOS

### 2.1 Crear Nuevo Departamento

**Pasos**:
1. Click en "Departamentos" del menú
2. Click en "Nuevo Departamento"
3. Completar formulario:
   ```
   Nombre: Neumología
   Sede: Hospital Central (o la que existe)
   ```
4. Click en "Crear"

**Validaciones**:
- ✅ Dropdown de sedes carga correctamente
- ✅ Sede es obligatoria
- ✅ Nombre es obligatorio
- ✅ Registro aparece con sede asociada
- ✅ En tabla aparece el nombre de la sede

### 2.2 Editar Departamento

**Pasos**:
1. Click en "Editar" de un departamento
2. Cambiar nombre: `Neumología y Alergología`
3. Click en "Actualizar"

**Validaciones**:
- ✅ Datos preexistentes se cargan
- ✅ Cambios se guardan correctamente

### 2.3 Eliminar Departamento

**Pasos**:
1. Click en "Eliminar"
2. Confirmar eliminación

**Validaciones**:
- ✅ Confirmación aparece
- ✅ Se elimina correctamente

---

## 👥 TEST 3: EMPLEADOS

### 3.1 Crear Nuevo Empleado

**Pasos**:
1. Click en "Gestionar Empleados" del menú
2. Click en "Nuevo Empleado"
3. Completar formulario:
   ```
   Nombre: Dr. Carlos Ruiz
   Email: carlos.ruiz@hospital.com
   Teléfono: +57 300 1111111
   Cargo: Neumonólogo
   Rol: MEDICO
   Departamento: Neumología
   Contraseña: SecurePass123!
   ```
4. Click en "Crear"

**Validaciones**:
- ✅ Email es requerido
- ✅ Email válido (formato)
- ✅ Rol tiene opciones: ENFERMERO, MEDICO, ADM, ADMIN
- ✅ Departamento carga correctamente
- ✅ Contraseña no se mostrada en tabla
- ✅ Empleado aparece en tabla
- ✅ En tabla aparece departamento completo

### 3.2 Editar Empleado

**Pasos**:
1. Click en "Editar" de un empleado
2. Cambiar cargo: `Neumonólogo Senior`
3. Click en "Actualizar"

**Validaciones**:
- ✅ Datos se cargan correctamente
- ✅ Campo contraseña NO aparece en edición
- ✅ Cambios se guardan
- ✅ Tabla se actualiza

### 3.3 Eliminar Empleado

**Pasos**:
1. Click en "Eliminar"
2. Confirmar

**Validaciones**:
- ✅ Eliminación exitosa

---

## 🔧 TEST 4: EQUIPAMIENTO

### 4.1 Crear Nuevo Equipo

**Pasos**:
1. Click en "Equipamiento" del menú
2. Click en "Nuevo Equipo"
3. Completar formulario:
   ```
   Nombre: Espirómetro Digital XL-200
   Departamento: Neumología
   Estado: OPERATIVO
   Fecha Mantenimiento: 2025-12-20
   Responsable: (seleccionar empleado)
   ```
4. Click en "Crear"

**Validaciones**:
- ✅ Nombre obligatorio
- ✅ Departamento obligatorio y carga bien
- ✅ Estado tiene 3 opciones: OPERATIVO, EN_MANTENIMIENTO, FUERA_SERVICIO
- ✅ Responsable es opcional
- ✅ Equipo aparece en tabla
- ✅ En tabla aparece: nombre, depto, estado, responsable

### 4.2 Cambiar Estado de Equipo

**Pasos**:
1. Click en "Editar" de un equipo
2. Cambiar estado: `EN_MANTENIMIENTO`
3. Click en "Actualizar"

**Validaciones**:
- ✅ Estados disponibles se muestran
- ✅ Cambio se guarda
- ✅ Tabla refleja nuevo estado

### 4.3 Asignar Responsable

**Pasos**:
1. Click en "Editar" de un equipo
2. Seleccionar responsable del dropdown
3. Click en "Actualizar"

**Validaciones**:
- ✅ Dropdown muestra todos los empleados
- ✅ Opción "Sin responsable" aparece
- ✅ Asignación se guarda
- ✅ En tabla aparece nombre del responsable

---

## 🔐 TEST 5: PERMISOS POR ROL

### 5.1 Login con MEDICO

**Pasos**:
1. Logout del usuario ADMIN
2. Login con usuario MEDICO

**Esperado**:
- ✅ NO ve "Sedes Hospitalarias"
- ✅ NO ve "Departamentos"
- ✅ NO ve "Gestionar Empleados"
- ✅ NO ve "Equipamiento"
- ✅ SÍ ve: Inicio, Analítica, Reportes, Pacientes, Citas, Historias, Prescripciones

### 5.2 Test Lectura Solo

**Pasos**:
1. Con MEDICO, entrar a cualquier sección
2. Intentar crear un registro

**Esperado**:
- ✅ Tabla muestra datos (si existen)
- ✅ NO hay botón "Nuevo ..." (crear)
- ✅ NO hay botones "Editar"
- ✅ NO hay botones "Eliminar"

### 5.3 Login con ENFERMERO

**Pasos**:
1. Logout
2. Login con ENFERMERO

**Esperado**:
- ✅ SÍ ve "Equipamiento"
- ✅ Puede editar equipamiento (botones presentes)
- ✅ NO puede crear equipamiento (sin botón)
- ✅ NO puede eliminar equipamiento (sin botón)

### 5.4 Login con ADM

**Pasos**:
1. Logout
2. Login con ADM

**Esperado**:
- ✅ SÍ ve "Equipamiento"
- ✅ Puede crear equipamiento
- ✅ Puede editar equipamiento
- ✅ Puede eliminar equipamiento
- ✅ NO ve otras secciones de administración

---

## 🐛 TEST 6: MANEJO DE ERRORES

### 6.1 Error: Email Duplicado

**Pasos**:
1. Ir a "Gestionar Empleados"
2. Crear empleado con email: `juan.garcia@hospital.com`
3. Crear otro empleado con MISMO email

**Esperado**:
- ✅ Error aparece: "Este email ya existe" o similar
- ✅ Registro no se crea

### 6.2 Error: Relación Requerida

**Pasos**:
1. Ir a "Departamentos"
2. Crear departamento sin seleccionar sede
3. Click en "Crear"

**Esperado**:
- ✅ Error de validación
- ✅ Mensaje indica campo requerido

### 6.3 Error: Conexión Rechazada

**Pasos**:
1. Apagar backend Django
2. Intentar crear un registro

**Esperado**:
- ✅ Mensaje de error en pantalla
- ✅ Tabla muestra "Error: ..."

---

## ✅ TEST 7: VALIDACIONES DE DATOS

### 7.1 Formato de Email

**Pasos**:
1. Intentar crear empleado con email inválido: `notanemail`
2. Click en "Crear"

**Esperado**:
- ✅ HTML5 rechaza formato inválido
- ✅ Se ve mensaje: "Por favor incluye un '@' en el email"

### 7.2 Campos Requeridos

**Pasos**:
1. Ir a cualquier formulario
2. Dejar campos vacíos
3. Click en "Crear"

**Esperado**:
- ✅ Navegador muestra mensaje "Por favor completa este campo"

---

## 📊 TEST 8: TABLA Y PRESENTACIÓN

### 8.1 Cargar Datos

**Pasos**:
1. Crear varios registros (3+)
2. Observar tabla

**Esperado**:
- ✅ Todos los datos aparecen
- ✅ Tabla es responsiva
- ✅ Datos están bien formateados

### 8.2 Relaciones en Tabla

**Pasos**:
1. Ver tabla de departamentos
2. Ver tabla de empleados
3. Ver tabla de equipamiento

**Esperado**:
- ✅ Departamentos muestran nombre de sede
- ✅ Empleados muestran nombre de departamento
- ✅ Equipamiento muestra depto y responsable

### 8.3 Botones Condicionados

**Pasos**:
1. Con ADMIN, ir a cualquier CRUD
2. Verificar botones presentes
3. Logout y login con ENFERMERO
4. Ir a Equipamiento
5. Comparar botones

**Esperado**:
- ✅ ADMIN tiene más botones que ENFERMERO
- ✅ Botones se muestran/ocultan según permisos

---

## 🔄 TEST 9: FLUJO COMPLETO

### Escenario: Crear hospital con departamentos y empleados

**Pasos**:
1. Login como ADMIN
2. Crear nueva sede: "Hospital Nuevo"
3. Crear departamento: "Radiología" en "Hospital Nuevo"
4. Crear empleado: "Dra. María López" (MEDICO) en Radiología
5. Crear equipamiento: "Ecógrafo Ultrasound-100" en Radiología
6. Asignar "Dra. María López" como responsable
7. Verificar tabla de equipamiento

**Esperado**:
- ✅ Todos los registros creados exitosamente
- ✅ Relaciones correctas entre modelos
- ✅ Datos coherentes en tablas

---

## 📈 TEST 10: RENDIMIENTO

### 10.1 Carga de Muchos Registros

**Pasos**:
1. Crear 50+ registros en una tabla
2. Observar tiempo de carga

**Esperado**:
- ✅ Carga en menos de 2 segundos
- ⚠️ Si es más lento, considerar paginación

### 10.2 Operaciones de Edición

**Pasos**:
1. Editar 5 registros consecutivamente
2. Observar tiempo de respuesta

**Esperado**:
- ✅ Cada edición tarda menos de 1 segundo

---

## 📋 Checklist Final

Marcar como completado cada test:

### Sedes Hospitalarias
- [ ] Crear ✅
- [ ] Editar ✅
- [ ] Eliminar ✅
- [ ] Tabla carga ✅
- [ ] Permisos OK ✅

### Departamentos
- [ ] Crear ✅
- [ ] Editar ✅
- [ ] Eliminar ✅
- [ ] Relación con sedes ✅
- [ ] Tabla carga ✅
- [ ] Permisos OK ✅

### Empleados
- [ ] Crear ✅
- [ ] Editar ✅
- [ ] Eliminar ✅
- [ ] Email validado ✅
- [ ] Rol seleccionable ✅
- [ ] Depto relacionado ✅
- [ ] Tabla carga ✅
- [ ] Permisos OK ✅

### Equipamiento
- [ ] Crear ✅
- [ ] Editar ✅
- [ ] Eliminar ✅
- [ ] Estados funcionan ✅
- [ ] Responsable asignable ✅
- [ ] ENFERMERO puede editar ✅
- [ ] ADM puede crear ✅
- [ ] Tabla carga ✅

### Permisos
- [ ] ADMIN accede a todo ✅
- [ ] MEDICO solo lectura ✅
- [ ] ENFERMERO edita equipamiento ✅
- [ ] ADM crea equipamiento ✅

### Errores
- [ ] Email duplicado manejado ✅
- [ ] Campos requeridos validados ✅
- [ ] Conexión fallida manejada ✅

---

## 🎯 Resultado Esperado

Si todos los tests pasan: ✅ **IMPLEMENTACIÓN EXITOSA**

---

**Última actualización**: 2025-12-05  
**Estado**: Listo para pruebas
