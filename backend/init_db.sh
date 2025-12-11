#!/bin/bash

echo "🚀 Inicializando base de datos HIS+"
echo "─────────────────────────────────"

echo "📦 Ejecutando migraciones..."
python manage.py migrate

echo ""
echo "📊 Cargando datos iniciales..."
python manage.py seed_data

echo ""
echo "✅ Base de datos lista para usar"
