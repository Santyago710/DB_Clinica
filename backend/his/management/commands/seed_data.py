from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from his.models import (
    SedeHospitalaria, Departamento, Empleado, Paciente, Cita,
    HistoriaClinica, Medicamento, Prescripcion, Equipamiento
)
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = "Carga datos iniciales en la base de datos"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Iniciando carga de datos..."))

        # 1. Crear Sedes Hospitalarias
        self.stdout.write("Creando sedes hospitalarias...")
        sede1, _ = SedeHospitalaria.objects.get_or_create(
            nom_sede="Hospital Central Bogotá",
            defaults={
                "ciudad": "Bogotá",
                "direccion": "Carrera 7 #100-50",
                "telefono": "601-1234567"
            }
        )
        
        sede2, _ = SedeHospitalaria.objects.get_or_create(
            nom_sede="Clínica San Francisco",
            defaults={
                "ciudad": "Medellín",
                "direccion": "Calle 50 #80-30",
                "telefono": "604-5678901"
            }
        )

        # 2. Crear Departamentos
        self.stdout.write("Creando departamentos...")
        depts = []
        for sede in [sede1, sede2]:
            for dept_name in ["Urgencias", "Cardiología", "Pediatría", "Cirugía"]:
                dept, _ = Departamento.objects.get_or_create(
                    nom_dept=dept_name,
                    sede=sede
                )
                depts.append(dept)

        # 3. Crear Empleados
        self.stdout.write("Creando empleados...")
        empleados = []
        
        # Admin
        emp_admin, _ = Empleado.objects.get_or_create(
            correo="admin@hospital.com",
            defaults={
                "nom_emp": "Dr. Carlos Administrador",
                "tel_emp": "3001234567",
                "depto": depts[0],
                "cargo": "Administrador General",
                "rol": "ADMIN",
                "hash_contra": make_password("admin123")
            }
        )
        empleados.append(emp_admin)

        # Médicos
        for i in range(3):
            emp, _ = Empleado.objects.get_or_create(
                correo=f"medico{i+1}@hospital.com",
                defaults={
                    "nom_emp": f"Dr. Médico {i+1}",
                    "tel_emp": f"300123456{i}",
                    "depto": depts[i % len(depts)],
                    "cargo": "Médico Especialista",
                    "rol": "MEDICO",
                    "hash_contra": make_password(f"medico{i+1}")
                }
            )
            empleados.append(emp)

        # Enfermeros
        for i in range(2):
            emp, _ = Empleado.objects.get_or_create(
                correo=f"enfermero{i+1}@hospital.com",
                defaults={
                    "nom_emp": f"Enfermero {i+1}",
                    "tel_emp": f"310123456{i}",
                    "depto": depts[(i+1) % len(depts)],
                    "cargo": "Enfermero",
                    "rol": "ENFERMERO",
                    "hash_contra": make_password(f"enfermero{i+1}")
                }
            )
            empleados.append(emp)

        # Personal Administrativo
        for i in range(2):
            emp, _ = Empleado.objects.get_or_create(
                correo=f"admin{i+1}@hospital.com",
                defaults={
                    "nom_emp": f"Admin {i+1}",
                    "tel_emp": f"320123456{i}",
                    "depto": depts[(i+2) % len(depts)],
                    "cargo": "Personal Administrativo",
                    "rol": "ADM",
                    "hash_contra": make_password(f"admin{i+1}")
                }
            )
            empleados.append(emp)

        # 4. Crear Pacientes
        self.stdout.write("Creando pacientes...")
        pacientes = []
        nombres_pacientes = [
            ("Juan Pérez", "1990-05-15"),
            ("María García", "1985-08-20"),
            ("Carlos López", "1992-03-10"),
            ("Ana Martínez", "1988-12-25"),
            ("Pedro Rodríguez", "1995-07-30"),
            ("Laura Sánchez", "1993-11-05"),
            ("Jorge Díaz", "1991-01-18"),
            ("Sandra Castro", "1989-06-22"),
        ]

        for nom, fecha in nombres_pacientes:
            paciente, _ = Paciente.objects.get_or_create(
                num_doc=f"{1000000 + len(pacientes)}",
                defaults={
                    "nom_pac": nom,
                    "fecha_nac": datetime.strptime(fecha, "%Y-%m-%d").date(),
                    "genero": "M" if len(pacientes) % 2 == 0 else "F",
                    "dir_pac": f"Calle {20 + len(pacientes)} #{100 + len(pacientes)}-50",
                    "tel_pac": f"310123456{len(pacientes)}",
                    "tipo_doc": "CC"
                }
            )
            pacientes.append(paciente)

        # 5. Crear Medicamentos
        self.stdout.write("Creando medicamentos...")
        medicamentos_list = [
            ("Amoxicilina 500mg", "Antibiótico de amplio espectro", 150, "Cápsula", "Farmacéutica ABC"),
            ("Ibuprofeno 400mg", "Analgésico y antiinflamatorio", 300, "Tableta", "Farmacéutica XYZ"),
            ("Metformina 850mg", "Antidiabético oral", 200, "Tableta", "Farmacéutica 123"),
            ("Lisinopril 10mg", "Inhibidor de ECA para presión arterial", 180, "Tableta", "Farmacéutica DEF"),
            ("Atorvastatina 20mg", "Medicamento para colesterol", 220, "Tableta", "Farmacéutica GHI"),
            ("Omeprazol 20mg", "Protector gástrico", 250, "Cápsula", "Farmacéutica JKL"),
            ("Paracetamol 500mg", "Analgésico y antipirético", 500, "Tableta", "Farmacéutica MNO"),
            ("Salbutamol", "Broncodilatador para asma", 80, "Inhalador", "Farmacéutica PQR"),
        ]

        medicamentos = []
        for nom, desc, stock, unidad, proveedor in medicamentos_list:
            med, _ = Medicamento.objects.get_or_create(
                nom_med=nom,
                defaults={
                    "descripcion": desc,
                    "stock": stock,
                    "unidad": unidad,
                    "proveedor": proveedor
                }
            )
            medicamentos.append(med)

        # 6. Crear Citas
        self.stdout.write("Creando citas...")
        medicos = [e for e in empleados if e.rol == "MEDICO"]
        for i, paciente in enumerate(pacientes[:5]):
            fecha_cita = datetime.now().date() + timedelta(days=i+1)
            cita, _ = Cita.objects.get_or_create(
                paciente=paciente,
                fecha=fecha_cita,
                hora="10:00:00",
                defaults={
                    "empleado": medicos[i % len(medicos)],
                    "depto": depts[i % len(depts)],
                    "tipo_servicio": "Consulta General",
                    "estado": "PENDIENTE"
                }
            )

        # 7. Crear Historias Clínicas
        self.stdout.write("Creando historias clínicas...")
        for i, paciente in enumerate(pacientes[:3]):
            historia, _ = HistoriaClinica.objects.get_or_create(
                paciente=paciente,
                fecha_registro=datetime.now(),
                defaults={
                    "empleado": medicos[i % len(medicos)],
                    "sede": sede1,
                    "diagnostico": f"Paciente con síntomas de {['hipertensión', 'diabetes', 'asma'][i]}"
                }
            )

            # Crear prescripciones para cada historia
            for j in range(2):
                prescripcion, _ = Prescripcion.objects.get_or_create(
                    historia=historia,
                    medicamento=medicamentos[(i*2 + j) % len(medicamentos)],
                    defaults={
                        "dosis": "1 tableta",
                        "frecuencia": "Cada 8 horas",
                        "duracion": "10 días",
                        "fecha_emision": datetime.now()
                    }
                )

        # 8. Crear Equipamiento
        self.stdout.write("Creando equipamiento...")
        equipos_list = [
            ("Monitor cardíaco", "OPERATIVO"),
            ("Desfibrilador", "OPERATIVO"),
            ("Ventilador mecánico", "EN_MANTENIMIENTO"),
            ("Incubadora", "OPERATIVO"),
            ("Máquina de rayos X", "OPERATIVO"),
            ("Ecógrafo", "FUERA_SERVICIO"),
        ]

        for nom, estado in equipos_list:
            for dept in depts[:4]:
                equipo, _ = Equipamiento.objects.get_or_create(
                    nom_eq=f"{nom} - {dept.nom_dept}",
                    depto=dept,
                    defaults={
                        "estado": estado,
                        "responsable": medicos[0] if estado == "OPERATIVO" else None,
                    }
                )

        self.stdout.write(self.style.SUCCESS("✅ Datos cargados exitosamente"))
        self.stdout.write(self.style.WARNING("\n📋 Datos de acceso para pruebas:"))
        self.stdout.write("─" * 50)
        self.stdout.write("Admin:")
        self.stdout.write("  Email: admin@hospital.com")
        self.stdout.write("  Contraseña: admin123")
        self.stdout.write("\nMédicos:")
        self.stdout.write("  Email: medico1@hospital.com")
        self.stdout.write("  Contraseña: medico1")
        self.stdout.write("\nEnfermeros:")
        self.stdout.write("  Email: enfermero1@hospital.com")
        self.stdout.write("  Contraseña: enfermero1")
        self.stdout.write("\nPersonal ADM:")
        self.stdout.write("  Email: admin1@hospital.com")
        self.stdout.write("  Contraseña: admin1")
        self.stdout.write("─" * 50)
