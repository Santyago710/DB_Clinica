# 🗄️ Inyección de Datos Iniciales - HIS+

## ¿Qué se incluye?

El sistema carga automáticamente datos de prueba:

### 📋 Datos Incluidos
- **2 Sedes Hospitalarias** (Bogotá y Medellín)
- **16 Departamentos** (4 por sede)
- **7 Empleados** con diferentes roles:
  - 1 Administrador
  - 3 Médicos
  - 2 Enfermeros
  - 2 Personal Administrativo
- **8 Pacientes** con información completa
- **8 Medicamentos** comunes
- **5 Citas** programadas
- **3 Historias Clínicas** con prescripciones
- **24 Equipos** distribuidos en departamentos

## 🚀 Cómo Usar

### Opción 1: Docker (Automático)
```bash
docker compose up --build
```
Al iniciar el contenedor, automáticamente:
1. Ejecuta las migraciones
2. Carga los datos iniciales
3. Inicia el servidor Django

### Opción 2: Manual (Desarrollo Local)
```bash
# Realizar migraciones
python manage.py migrate

# Cargar datos iniciales
python manage.py seed_data
```

### Opción 3: Script Python
```bash
python init_db.py
```

## 📝 Credenciales de Prueba

### Admin (Acceso Total)
```
Email: admin@hospital.com
Contraseña: admin123
```

### Médico
```
Email: medico1@hospital.com
Contraseña: medico1
```

### Enfermero
```
Email: enfermero1@hospital.com
Contraseña: enfermero1
```

### Personal Administrativo
```
Email: admin1@hospital.com
Contraseña: admin1
```

## 🔧 Personalizar Datos

Para agregar más datos o modificar los existentes, edita:

```
backend/his/management/commands/seed_data.py
```

Estructura del comando:
1. Crear sedes
2. Crear departamentos
3. Crear empleados
4. Crear pacientes
5. Crear medicamentos
6. Crear citas
7. Crear historias clínicas
8. Crear equipamiento

## ⚡ Características

✅ **Idempotente**: Puede ejecutarse múltiples veces sin duplicar datos
✅ **Automático**: Se ejecuta al iniciar Docker
✅ **Completo**: Incluye todas las relaciones entre modelos
✅ **Realista**: Datos de prueba coherentes
✅ **Mensajes informativos**: Muestra credenciales al terminar

## 📊 Estructura de Datos Inyectados

```
Sede 1 (Bogotá)
├── Urgencias
│   ├── 1 Médico
│   ├── 1 Enfermero
│   └── 2 Equipos
├── Cardiología
│   ├── 1 Médico
│   └── 2 Equipos
├── Pediatría
│   ├── 1 Médico
│   └── 2 Equipos
└── Cirugía
    ├── 1 Admin (ADM)
    └── 2 Equipos

Sede 2 (Medellín)
├── Urgencias
├── Cardiología
├── Pediatría
└── Cirugía
    (Misma estructura)
```

## 🔄 Reinicializar Base de Datos

Si quieres empezar de nuevo:

```bash
# Eliminar todo
python manage.py flush

# O, con Docker:
docker compose down -v  # Elimina volúmenes
docker compose up --build  # Reinicia limpio
```

## 🛡️ Notas de Seguridad

⚠️ **IMPORTANTE**: Las contraseñas en seed_data.py son SOLO para desarrollo.
- En producción, NUNCA uses credenciales hardcodeadas
- Cambia las contraseñas inmediatamente
- Usa variables de entorno para datos sensibles

