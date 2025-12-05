from django.contrib import admin
from .models import (
    SedeHospitalaria,
    Departamento,
    Empleado,
    Paciente,
    Cita,
    HistoriaClinica,
    Medicamento,
    Prescripcion,
    Equipamiento,
    AuditoriaAcceso,
    ReporteMedico,
)


@admin.register(SedeHospitalaria)
class SedeHospitalariaAdmin(admin.ModelAdmin):
    list_display = ("id", "nom_sede", "ciudad", "telefono")
    search_fields = ("nom_sede", "ciudad")


@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ("id", "nom_dept", "sede")
    list_filter = ("sede",)
    search_fields = ("nom_dept",)


@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ("id", "nom_emp", "correo", "rol", "depto")
    list_filter = ("rol", "depto")
    search_fields = ("nom_emp", "correo")


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ("id", "nom_pac", "num_doc", "tipo_doc", "genero", "fecha_nac")
    search_fields = ("nom_pac", "num_doc")
    list_filter = ("genero", "tipo_doc")


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ("id", "paciente", "empleado", "depto", "fecha", "hora", "tipo_servicio", "estado")
    list_filter = ("estado", "depto", "fecha")
    search_fields = ("paciente__nom_pac", "empleado__nom_emp")


@admin.register(HistoriaClinica)
class HistoriaClinicaAdmin(admin.ModelAdmin):
    list_display = ("id", "paciente", "empleado", "sede", "fecha_registro")
    list_filter = ("sede", "fecha_registro")
    search_fields = ("paciente__nom_pac", "empleado__nom_emp")


@admin.register(Medicamento)
class MedicamentoAdmin(admin.ModelAdmin):
    list_display = ("id", "nom_med", "stock", "unidad", "proveedor")
    search_fields = ("nom_med", "proveedor")


@admin.register(Prescripcion)
class PrescripcionAdmin(admin.ModelAdmin):
    list_display = ("id", "historia", "medicamento", "dosis", "frecuencia", "fecha_emision")
    list_filter = ("fecha_emision", "medicamento")


@admin.register(Equipamiento)
class EquipamientoAdmin(admin.ModelAdmin):
    list_display = ("id", "nom_eq", "depto", "estado", "fecha_mantenimiento", "responsable")
    list_filter = ("estado", "depto")


@admin.register(AuditoriaAcceso)
class AuditoriaAccesoAdmin(admin.ModelAdmin):
    list_display = ("id", "empleado", "accion", "tabla_afectada", "fecha_evento", "ip_origen")
    list_filter = ("tabla_afectada", "fecha_evento")
    search_fields = ("empleado__nom_emp", "tabla_afectada", "accion")


@admin.register(ReporteMedico)
class ReporteMedicoAdmin(admin.ModelAdmin):
    list_display = ("id", "sede", "tipo_reporte", "fecha_generacion")
    list_filter = ("sede", "tipo_reporte", "fecha_generacion")
