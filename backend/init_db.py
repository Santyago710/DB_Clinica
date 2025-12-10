#!/usr/bin/env python
"""
Script de inicialización rápida de datos para HIS+
Ejecutar: python init_db.py
"""

import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hisplus_backend.settings')
django.setup()

from django.core.management import call_command

def init_database():
    """Inicializa la base de datos con migraciones y datos seed"""
    
    print("🚀 Inicializando HIS+")
    print("─" * 50)
    
    # 1. Ejecutar migraciones
    print("\n📦 Ejecutando migraciones...")
    try:
        call_command('migrate', verbosity=1)
        print("✅ Migraciones completadas")
    except Exception as e:
        print(f"❌ Error en migraciones: {e}")
        sys.exit(1)
    
    # 2. Cargar datos seed
    print("\n📊 Cargando datos iniciales...")
    try:
        call_command('seed_data')
        print("✅ Datos iniciales cargados")
    except Exception as e:
        print(f"❌ Error cargando datos: {e}")
        sys.exit(1)
    
    print("\n" + "─" * 50)
    print("🎉 Base de datos inicializada correctamente")

if __name__ == "__main__":
    init_database()
