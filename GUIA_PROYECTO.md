# 🚀 Guía de Despliegue — App Web con Django + React + PostgreSQL Distribuido

## Descripción general

Este proyecto corre dos instancias de la app (Django + React) sobre Docker Compose, respaldadas por una base de datos PostgreSQL distribuida con replicación lógica entre nodos.

---

## Arquitectura

```
┌────────────────────┐        ┌────────────────────┐
│   Instancia 1      │        │   Instancia 2       │
│  react-frontend    │        │  react-frontend2    │
│  :3001             │        │  :3002              │
│  django-web        │        │  django-web2        │
│  :8000             │        │  :8001              │
│  .env.dev          │        │  .env2.dev          │
└────────┬───────────┘        └─────────┬───────────┘
         │                              │
         ▼                              ▼
  ┌─────────────┐              ┌──────────────────┐
  │ his_central │──replica──►  │  his_norte_db    │
  │ _db (MASTER)│              │  (NODO réplica)  │
  └─────────────┘              └──────────────────┘
```

---

## Paso 1 — Build y levantar servicios

> Ejecutar siempre que haya cambios en el código o en los `Dockerfile`.

```bash
# Build desde cero (sin caché)
sudo docker compose build --no-cache

# Levantar todos los servicios en background
sudo docker compose up -d

# Verificar que todos los contenedores estén corriendo
sudo docker compose ps
```

---

## Paso 2 — Migraciones y datos — Instancia 1 (Master)

> ⚠️ Esta es la instancia **master**. Las migraciones y el seed de datos se aplican aquí primero.

```bash
# Entrar al contenedor
docker exec -it django-web bash

# Dentro del contenedor:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data

exit
```

---

## Paso 3 — Migraciones y datos — Instancia 2

> Solo ejecutar si la Instancia 2 **no** apunta al nodo réplica.  
> Si apunta al réplica, los datos llegarán automáticamente desde el master (ver Paso 5).

```bash
# Entrar al contenedor
docker exec -it django-web2 bash

# Dentro del contenedor:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data

exit
```

---

## Paso 4 — Ver logs si algo falla

```bash
# Ver logs de todos los servicios en tiempo real
sudo docker compose logs -f

# Ver logs de un servicio específico
sudo docker compose logs -f django-web
sudo docker compose logs -f django-web2
sudo docker compose logs -f react-frontend
```

---

## Paso 5 — Configuración de base de datos distribuida (Replicación lógica PostgreSQL)

Este paso configura la replicación lógica entre nodos para que la base de datos sea distribuida.  
Se realiza **una sola vez**, después de que el master ya tiene las migraciones y datos cargados.

### 5.1 — Configurar la PUBLICACIÓN en el nodo Master (`his_central_db`)

```bash
sudo -u postgres psql -d his_central_db
```

```sql
CREATE PUBLICATION pub_clinica FOR ALL TABLES;
```

> Esto expone **todas las tablas** del master para que los nodos puedan suscribirse y recibir cambios.

### 5.2 — Configurar la SUSCRIPCIÓN en el nodo réplica (`his_norte_db`)

> Reemplaza `10.0.1.x` con la IP real del servidor master.

```bash
sudo -u postgres psql -d his_norte_db
```

```sql
CREATE SUBSCRIPTION sub_clinica
  CONNECTION 'host=10.0.1.x port=5432 user=postgres password=1qaw3edr5 dbname=his_central_db'
  PUBLICATION pub_clinica;
```

> A partir de este momento, cualquier cambio en `his_central_db` se replica automáticamente hacia `his_norte_db`.

---

## Paso 6 — Comandos útiles del día a día

```bash
# Reiniciar un servicio específico
sudo docker compose restart django-web

# Detener todos los servicios
sudo docker compose down

# Detener y eliminar volúmenes (⚠️ BORRA TODOS LOS DATOS)
sudo docker compose down -v

# Rebuild y reiniciar solo un servicio
sudo docker compose build --no-cache django-web
sudo docker compose up -d django-web
```

---

## URLs de acceso

| Servicio      | URL                      |
|---------------|--------------------------|
| Frontend 1    | http://localhost:3001    |
| Backend 1     | http://localhost:8000    |
| Frontend 2    | http://localhost:3002    |
| Backend 2     | http://localhost:8001    |

---

## ⚠️ Notas importantes

- Las migraciones (`migrate`) y el seed (`seed_data`) se deben correr **solo en el master** (`django-web` con `.env.dev`) cuando la replicación está activa.
- El nodo réplica (`his_norte_db`) recibe los datos automáticamente vía la suscripción creada en el Paso 5.
- No correr `seed_data` en `django-web2` si ese servicio apunta al nodo réplica, ya que generaría conflictos de datos.
- La publicación (`pub_clinica`) se crea una sola vez en el master.
- La suscripción (`sub_clinica`) se crea una sola vez en cada nodo réplica.
