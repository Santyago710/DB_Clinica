# 🏥 DB_Clinica

**DB_Clinica** es un proyecto full-stack orientado a la **gestión integral de una clínica**, abarcando desde la administración de pacientes y médicos hasta la gestión de turnos y procesos internos. El sistema está diseñado bajo principios de **modularidad, escalabilidad y mantenibilidad**, preparado tanto para entornos académicos como para escenarios reales de desarrollo profesional.

El repositorio integra **frontend, backend, base de datos y configuración de entorno**, con soporte para **Docker**, documentación técnica y datos de prueba. En resumen: todo lo necesario para levantar el sistema sin rituales extraños ni sacrificios al dios de los errores.

---

## 📌 Características principales

- Arquitectura **full-stack** claramente separada
- Backend con API REST para lógica de negocio
- Frontend interactivo y desacoplado
- Contenerización con **Docker y Docker Compose**
- Documentación técnica incluida
- Datos de prueba (Seed Data)
- Scripts de pruebas rápidas
- Preparado para desarrollo y despliegue

---

## 🧱 Estructura del proyecto

DB_Clinica/
│
├── backend/ # Lógica del servidor y API
├── frontend/ # Interfaz de usuario
│
├── docker-compose.yml # Orquestación de servicios
├── .env.dev # Variables de entorno (desarrollo)
├── .env2.dev # Variables de entorno alternativas
│
├── SEED_DATA.md # Datos de prueba y cómo cargarlos
├── DOCUMENTACION_INDICE.md # Índice de documentación del proyecto
├── GUIA_PRUEBAS.md # Guía de pruebas funcionales
├── IMPLEMENTACION_PAGINAS.md # Detalles de implementación de la UI
├── AUDITORIA.md # Auditoría y análisis del proyecto
│
├── quick_test.sh # Script de pruebas rápidas
└── README.md # Documentación principal




---

## 🛠️ Tecnologías utilizadas

### 🔹 Backend
- Lenguaje y framework según implementación del proyecto
- API REST
- Conexión a base de datos relacional
- Manejo de variables de entorno

### 🔹 Frontend
- Framework SPA moderno
- Comunicación con backend vía HTTP
- Arquitectura modular de componentes

### 🔹 DevOps / Herramientas
- Docker
- Docker Compose
- Git
- Variables de entorno
- Scripts automatizados

---

## 🚀 Instalación y ejecución

### 🔹 Requisitos previos

Asegúrate de tener instalados:

- Git
- Docker
- Docker Compose
- Node.js (si ejecutas frontend manualmente)
- Python u otro runtime del backend (si aplica)

---

### 🔹 Clonar el repositorio

```bash
git clone https://github.com/Santyago710/DB_Clinica.git
cd DB_Clinica
```
Copia los archivos de entorno y ajústalos según tu configuración:
```
cp .env.dev .env
cp .env2.dev .env2
```

### 🐋 Ejecutar con Docker
```
docker compose up --build
```

Este comando levanta:

= Backend
= Frontend
= Base de datos
= Servicios auxiliares necesarios

Una vez iniciado, podrás acceder al sistema desde el navegador según los puertos configurados.


### 🌿 DATOS DE PRUEBA (SEED DATA)

El proyecto incluye datos de prueba para facilitar:

- Pruebas funcionales

- Validación de endpoints

- Simulación de flujos reales

- Consultar el archivo SEED_DATA.md para conocer el procedimiento de carga.

## 📁 Archivos del Proyecto
- **Script de datos de prueba:** [seed_data.py](https://github.com/Santyago710/DB_Clinica/blob/master/backend/his/management/commands/seed_data.py)

### Flujo recomendado:
- Levantar el sistema
- Ejecutar pruebas del backend
- Probar endpoints con Postman o Insomnia
- Validar flujos completos desde el frontend
- El script quick_test.sh puede utilizarse para verificaciones rápidas.
