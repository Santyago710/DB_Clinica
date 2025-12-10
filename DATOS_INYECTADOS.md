# 🚀 RESUMEN: Inyección de Datos a la BD

## 📦 Archivos Creados

```
backend/
├── init_db.py                          (Script Python para inicializar)
├── init_db.sh                          (Script Bash para inicializar)
├── Dockerfile                          (Actualizado - ejecuta seed automáticamente)
└── his/
    └── management/
        └── commands/
            ├── __init__.py
            └── seed_data.py            (Comando Django de carga de datos)
```

## ⚡ Cómo Funciona

### 1️⃣ Al Ejecutar Docker (AUTOMÁTICO)
```bash
docker compose up --build
```
**Proceso:**
- Inicia contenedor backend
- Ejecuta: `python manage.py migrate`
- Ejecuta: `python manage.py seed_data`
- Inicia servidor en puerto 8000
- ✅ Base de datos lista con datos de prueba

### 2️⃣ Manual (Desarrollo Local)
```bash
cd backend
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### 3️⃣ Script Automatizado
```bash
cd backend
python init_db.py
```

## 📊 Datos Que Se Cargan

| Entidad | Cantidad | Detalles |
|---------|----------|---------|
| Sedes | 2 | Bogotá, Medellín |
| Departamentos | 16 | 4 por sede (Urgencias, Cardiología, Pediatría, Cirugía) |
| Empleados | 7 | 1 Admin + 3 Médicos + 2 Enfermeros + 2 ADM |
| Pacientes | 8 | Con documentos, fechas y contactos |
| Medicamentos | 8 | Comunes en hospitales |
| Citas | 5 | Programadas para los próximos días |
| Historias Clínicas | 3 | Con prescripciones asociadas |
| Prescripciones | 6+ | Asociadas a historias clínicas |
| Equipamiento | 24 | Distribuido en departamentos |

## 🔑 Credenciales Predefinidas

```
┌─ ADMIN ─────────────────────────────┐
│ Email: admin@hospital.com           │
│ Contraseña: admin123                │
│ Acceso: TODOS los módulos           │
└─────────────────────────────────────┘

┌─ MÉDICO ────────────────────────────┐
│ Email: medico1@hospital.com         │
│ Contraseña: medico1                 │
│ Acceso: Pacientes, Citas, Historias │
└─────────────────────────────────────┘

┌─ ENFERMERO ─────────────────────────┐
│ Email: enfermero1@hospital.com      │
│ Contraseña: enfermero1              │
│ Acceso: Pacientes, Citas, Equipos   │
└─────────────────────────────────────┘

┌─ ADM ───────────────────────────────┐
│ Email: admin1@hospital.com          │
│ Contraseña: admin1                  │
│ Acceso: Pacientes, Citas, Equipos   │
└─────────────────────────────────────┘
```

## 🎯 Ventajas del Enfoque

✅ **Automático**: Se ejecuta sin intervención manual  
✅ **Rápido**: Carga todos los datos en segundos  
✅ **Idempotente**: No duplica datos si se ejecuta múltiples veces  
✅ **Coherente**: Todas las relaciones están bien formadas  
✅ **Realista**: Datos que simulan un hospital real  
✅ **Documentado**: Incluye comentarios y mensajes informativos  
✅ **Seguro**: Usa `get_or_create()` para evitar duplicados  

## 📝 Modificar Datos

Para agregar/modificar datos, edita:
```
backend/his/management/commands/seed_data.py
```

Luego ejecuta:
```bash
python manage.py seed_data
```

O con Docker:
```bash
docker compose up --build
```

## 🔄 Reiniciar Base de Datos

```bash
# Opción 1: Con Docker
docker compose down -v
docker compose up --build

# Opción 2: Manual
python manage.py flush  # Elimina TODO
python manage.py migrate  # Recrea tablas
python manage.py seed_data  # Carga datos nuevamente
```

## ✨ Resultado Final

Después de ejecutar cualquiera de los métodos:
- ✅ Base de datos inicializada
- ✅ Todas las tablas creadas
- ✅ Datos de prueba listos
- ✅ 7 usuarios diferentes para probar roles
- ✅ Relaciones entre modelos funcionando
- ✅ Sistema listo para pruebas

