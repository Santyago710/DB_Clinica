from django.db import models
from django.contrib.auth.hashers import make_password


class SedeHospitalaria(models.Model):
    nom_sede = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)

    class Meta:
        db_table = "Sedes_Hospitalarias"

    def __str__(self):
        return self.nom_sede


class Departamento(models.Model):
    nom_dept = models.CharField(max_length=100)
    sede = models.ForeignKey(SedeHospitalaria, on_delete=models.CASCADE, related_name="departamentos")

    class Meta:
        db_table = "Departamentos"

    def __str__(self):
        return f"{self.nom_dept} - {self.sede.nom_sede}"


class Empleado(models.Model):
    ROLE_CHOICES = [
        ("ADMIN", "Administrador"),
        ("MEDICO", "Médico"),
        ("ENFERMERO", "Enfermero"),
        ("ADM", "Personal Administrativo"),
    ]

    nom_emp = models.CharField(max_length=150)
    correo = models.EmailField(unique=True)
    tel_emp = models.CharField(max_length=20)
    depto = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name="empleados")
    cargo = models.CharField(max_length=100)
    rol = models.CharField(max_length=20, choices=ROLE_CHOICES)
    hash_contra = models.CharField(max_length=255)

    class Meta:
        db_table = "Empleados"

    def __str__(self):
        return f"{self.nom_emp} ({self.rol})"
    def save(self, *args, **kwargs):
        
        if self.hash_contra and not str(self.hash_contra).startswith("pbkdf2_"):
            self.hash_contra = make_password(self.hash_contra)
        super().save(*args, **kwargs)


class Paciente(models.Model):
    TIPO_DOC_CHOICES = [
        ("CC", "Cédula de ciudadanía"),
        ("TI", "Tarjeta de identidad"),
        ("CE", "Cédula de extranjería"),
        ("PP", "Pasaporte"),
    ]

    nom_pac = models.CharField(max_length=150)
    fecha_nac = models.DateField()
    genero = models.CharField(max_length=20)
    dir_pac = models.CharField(max_length=200)
    tel_pac = models.CharField(max_length=20)
    tipo_doc = models.CharField(max_length=5, choices=TIPO_DOC_CHOICES)
    num_doc = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "Pacientes"

    def __str__(self):
        return f"{self.nom_pac} - {self.num_doc}"


class Cita(models.Model):
    ESTADO_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("ATENDIDA", "Atendida"),
        ("CANCELADA", "Cancelada"),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="citas")
    empleado = models.ForeignKey(Empleado, on_delete=models.PROTECT, related_name="citas")
    depto = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name="citas")
    fecha = models.DateField()
    hora = models.TimeField()
    tipo_servicio = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="PENDIENTE")

    class Meta:
        db_table = "Citas"

    def __str__(self):
        return f"Cita {self.id} - {self.paciente.nom_pac} ({self.fecha} {self.hora})"


class HistoriaClinica(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="historias_clinicas")
    empleado = models.ForeignKey(Empleado, on_delete=models.PROTECT, related_name="historias_registradas")
    sede = models.ForeignKey(SedeHospitalaria, on_delete=models.PROTECT, related_name="historias_clinicas")
    fecha_registro = models.DateTimeField()
    diagnostico = models.TextField()

    class Meta:
        db_table = "Historias_Clinicas"

    def __str__(self):
        return f"HC {self.id} - {self.paciente.nom_pac}"


class Medicamento(models.Model):
    nom_med = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    stock = models.IntegerField()
    unidad = models.CharField(max_length=50)
    proveedor = models.CharField(max_length=150)

    class Meta:
        db_table = "Medicamentos"

    def __str__(self):
        return self.nom_med


class Prescripcion(models.Model):
    historia = models.ForeignKey(HistoriaClinica, on_delete=models.CASCADE, related_name="prescripciones")
    medicamento = models.ForeignKey(Medicamento, on_delete=models.PROTECT, related_name="prescripciones")
    dosis = models.CharField(max_length=100)
    frecuencia = models.CharField(max_length=100)
    duracion = models.CharField(max_length=100)
    fecha_emision = models.DateTimeField()

    class Meta:
        db_table = "Prescripciones"

    def __str__(self):
        return f"Prescripción {self.id} - {self.medicamento.nom_med}"


class Equipamiento(models.Model):
    ESTADO_CHOICES = [
        ("OPERATIVO", "Operativo"),
        ("EN_MANTENIMIENTO", "En mantenimiento"),
        ("FUERA_SERVICIO", "Fuera de servicio"),
    ]

    nom_eq = models.CharField(max_length=150)
    depto = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name="equipos")
    estado = models.CharField(max_length=30, choices=ESTADO_CHOICES)
    fecha_mantenimiento = models.DateField(null=True, blank=True)
    responsable = models.ForeignKey(Empleado, on_delete=models.SET_NULL, null=True, blank=True, related_name="equipos_asignados")

    class Meta:
        db_table = "Equipamiento"

    def __str__(self):
        return self.nom_eq


class AuditoriaAcceso(models.Model):
    empleado = models.ForeignKey(Empleado, on_delete=models.SET_NULL, null=True, related_name="eventos_auditoria")
    accion = models.CharField(max_length=100)
    tabla_afectada = models.CharField(max_length=100)
    fecha_evento = models.DateTimeField()
    ip_origen = models.GenericIPAddressField()

    class Meta:
        db_table = "Auditoria_Accesos"

    def __str__(self):
        return f"{self.fecha_evento} - {self.accion} - {self.tabla_afectada}"


class ReporteMedico(models.Model):
    sede = models.ForeignKey(SedeHospitalaria, on_delete=models.CASCADE, related_name="reportes_medicos")
    fecha_generacion = models.DateTimeField()
    tipo_reporte = models.CharField(max_length=100)
    resumen = models.TextField()

    class Meta:
        db_table = "Reportes_Medicos"

    def __str__(self):
        return f"Reporte {self.id} - {self.tipo_reporte} - {self.sede.nom_sede}"
