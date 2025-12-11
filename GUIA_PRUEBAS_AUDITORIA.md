# 🧪 Guía de Prueba - Página de Auditoría

## 🚀 Pasos para Probar

### 1. Iniciar la Aplicación
```bash
docker compose up --build
```

Espera a que termine de compilar (2-3 minutos).

### 2. Acceder al Sistema
Abre tu navegador y ve a: `http://localhost:3000`

### 3. Iniciar Sesión como Admin
```
📧 Email: admin@hospital.com
🔑 Contraseña: admin123
```

### 4. Acceder a la Página de Auditoría
1. En el menú lateral izquierdo, busca "🔍 Auditoría"
2. Haz click en ella
3. Deberías ver un listado de registros con tarjetas visuales

## 📊 Qué Esperar Ver

Al abrir la página de auditoría verás:

```
✅ Múltiples tarjetas con registros
✅ Cada tarjeta muestra:
   - Tipo de acción (GET, POST, PUT, DELETE)
   - Tabla afectada
   - Usuario que hizo la acción
   - IP de origen
   - Fecha y hora exacta
✅ Filtros arriba para filtrar datos
✅ Estadísticas al final
```

## 🔍 Pruebas Interactivas

### Prueba 1: Ver Todos los Registros
1. La página carga automáticamente todos los registros
2. Deberías ver 20+ registros del seed data
3. Verifica que estén ordenados por fecha descendente (más recientes primero)

### Prueba 2: Filtrar por Tabla
1. En el dropdown "Filtrar por Tabla", selecciona "Pacientes"
2. Haz click en "🔄 Actualizar"
3. Solo deberían mostrarse registros con tabla_afectada = "Pacientes"
4. Los datos cambian dinámicamente

### Prueba 3: Filtrar por Acción
1. En el dropdown "Filtrar por Acción", selecciona "GET"
2. Haz click en "🔄 Actualizar"
3. Solo verás acciones de lectura (GET)
4. Las tarjetas mostrarán el icono 👁️ y color azul

### Prueba 4: Generar Nuevos Registros (Auditoría en Tiempo Real)
1. Abre otra pestaña del navegador
2. Ve a `http://localhost:3000` y abre el menú de Pacientes
3. Crea un nuevo paciente con datos aleatorios
4. Vuelve a la pestaña de Auditoría
5. Haz click en "🔄 Actualizar"
6. **Deberías ver un nuevo registro** con acción "POST"

### Prueba 5: Colores por Acción
Verifica que los colores sean:
- 🔵 Azul: Acciones GET (lectura)
- 🟢 Verde: Acciones POST (creación)
- 🟠 Naranja: Acciones PUT (actualización)
- 🔴 Rojo: Acciones DELETE (eliminación)

### Prueba 6: Información del Usuario
1. Busca un registro que haya hecho otro usuario (que no sea admin)
2. Haz click para ver los detalles
3. Deberías ver:
   - Nombre del empleado
   - Rol del empleado (MEDICO, ENFERMERO, ADM, etc.)
   - IP de origen

### Prueba 7: Estadísticas
Desplázate al final de la página y verifica:
```
┌─────────────┬──────────┬────────────────┬─────────────┐
│ Total       │ Creadas  │ Actualizadas   │ Eliminadas  │
├─────────────┼──────────┼────────────────┼─────────────┤
│ (número)    │ (número) │ (número)       │ (número)    │
└─────────────┴──────────┴────────────────┴─────────────┘
```

## ❌ Restricciones a Probar

### Prueba 8: Acceso Restringido
1. Cierra sesión de Admin
2. Inicia sesión como Médico:
   ```
   📧 Email: medico1@hospital.com
   🔑 Contraseña: medico1
   ```
3. **Verifica que NO hay opción "🔍 Auditoría" en el menú**
4. El usuario no puede acceder a la página

### Prueba 9: Protección en Backend
1. Con el navegador abierto como Médico
2. Abre la consola (F12)
3. Intenta hacer una llamada manual:
   ```javascript
   fetch('http://localhost:8000/api/auditoria/', {
     headers: {
       'X-Empleado-Id': 2  // ID de médico
     }
   })
   ```
4. **Deberías recibir error 403 Forbidden**

## 🛠️ Troubleshooting

### Si no ves la página de Auditoría:
```
1. ¿Estás logueado como Admin?
   Email: admin@hospital.com
2. ¿Hace scroll en el menú lateral para verla?
3. ¿Está construido correctamente Docker?
   docker compose logs backend | grep "seed_data"
```

### Si los registros no cargan:
```
1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica que el backend esté corriendo:
   docker compose logs backend
```

### Si los filtros no funcionan:
```
1. Asegúrate de hacer click en "🔄 Actualizar"
2. Verifica la consola para errores de red
3. Intenta recargar la página (F5)
```

## 📈 Verificar Datos Reales

Para ver qué datos se cargaron desde seed_data:
```bash
# Acceder a la base de datos
docker compose exec db psql -U postgres -d his_central_db

# Ver registros de auditoría
SELECT * FROM "Auditoria_Accesos" ORDER BY fecha_evento DESC LIMIT 10;

# Contar registros por tabla
SELECT tabla_afectada, COUNT(*) FROM "Auditoria_Accesos" GROUP BY tabla_afectada;
```

## ✅ Lista de Verificación

- [ ] Página carga sin errores
- [ ] Se ven múltiples tarjetas
- [ ] Los filtros funcionan correctamente
- [ ] Las estadísticas se actualizan
- [ ] Los colores cambian según la acción
- [ ] La información del usuario se muestra
- [ ] Los no-Admin no pueden acceder
- [ ] Puedo crear nuevos registros y verlos reflejados
- [ ] La página es visualmente atractiva
- [ ] No hay errores en la consola

## 🎉 Si Todo Funciona

¡Felicitaciones! La página de auditoría está completamente implementada y funcional.

Ahora los administradores pueden:
- ✅ Monitorear todos los accesos
- ✅ Detectar actividades sospechosas
- ✅ Generar reportes de auditoría
- ✅ Investigar incidentes de seguridad
- ✅ Mantener registros detallados de cambios

