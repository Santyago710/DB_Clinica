from rest_framework import serializers
from .models import (
    SedeHospitalaria,
    Departamento,
    Paciente,
    Cita,
    Empleado,
    Medicamento,
    Equipamiento,
    HistoriaClinica,
    Prescripcion,
    AuditoriaAcceso,
)


class SedeHospitalariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SedeHospitalaria
        fields = "__all__"


class DepartamentoSerializer(serializers.ModelSerializer):
    sede = SedeHospitalariaSerializer(read_only=True)
    sede_id = serializers.PrimaryKeyRelatedField(
        source="sede", queryset=SedeHospitalaria.objects.all(), write_only=True
    )

    class Meta:
        model = Departamento
        fields = ["id", "nom_dept", "sede", "sede_id"]
    
    def to_representation(self, instance):
        """Asegurar que siempre se devuelve la sede completa"""
        data = super().to_representation(instance)
        if not data.get('sede'):
            data['sede'] = SedeHospitalariaSerializer(instance.sede).data
        return data


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = "__all__"


class EmpleadoPublicSerializer(serializers.ModelSerializer):
    depto = DepartamentoSerializer(read_only=True)

    class Meta:
        model = Empleado
        fields = ["id", "nom_emp", "correo", "rol", "cargo", "depto"]


class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)
    paciente_id = serializers.PrimaryKeyRelatedField(
        source="paciente", queryset=Paciente.objects.all(), write_only=True
    )
    empleado = EmpleadoPublicSerializer(read_only=True)
    empleado_id = serializers.PrimaryKeyRelatedField(
        source="empleado", queryset=Empleado.objects.all(), write_only=True
    )
    depto = DepartamentoSerializer(read_only=True)
    depto_id = serializers.PrimaryKeyRelatedField(
        source="depto", queryset=Departamento.objects.all(), write_only=True
    )

    class Meta:
        model = Cita
        fields = ["id", "paciente", "paciente_id", "empleado", "empleado_id", "depto", "depto_id", "fecha", "hora", "tipo_servicio", "estado"]


class EmpleadoCreateSerializer(serializers.ModelSerializer):
    depto_id = serializers.PrimaryKeyRelatedField(
        source="depto", queryset=Departamento.objects.all(), write_only=True
    )

    class Meta:
        model = Empleado
        fields = ["nom_emp", "correo", "tel_emp", "cargo", "rol", "depto_id", "hash_contra"]
        extra_kwargs = {
            "hash_contra": {"write_only": True},
        }

    def create(self, validated_data):
        empleado = Empleado.objects.create(**validated_data)
        return empleado


class EmpleadoSerializer(serializers.ModelSerializer):
    depto = DepartamentoSerializer(read_only=True)
    depto_id = serializers.PrimaryKeyRelatedField(
        source="depto", queryset=Departamento.objects.all(), write_only=True
    )

    class Meta:
        model = Empleado
        fields = ["id", "nom_emp", "correo", "tel_emp", "cargo", "rol", "depto", "depto_id"]


class MedicamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicamento
        fields = "__all__"


class EquipamientoSerializer(serializers.ModelSerializer):
    depto = DepartamentoSerializer(read_only=True)
    depto_id = serializers.PrimaryKeyRelatedField(
        source="depto", queryset=Departamento.objects.all(), write_only=True
    )
    responsable = EmpleadoPublicSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        source="responsable", queryset=Empleado.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Equipamiento
        fields = ["id", "nom_eq", "depto", "depto_id", "estado", "fecha_mantenimiento", "responsable", "responsable_id"]


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)
    paciente_id = serializers.PrimaryKeyRelatedField(
        source="paciente", queryset=Paciente.objects.all(), write_only=True
    )
    empleado = EmpleadoPublicSerializer(read_only=True)
    empleado_id = serializers.PrimaryKeyRelatedField(
        source="empleado", queryset=Empleado.objects.all(), write_only=True
    )
    sede = SedeHospitalariaSerializer(read_only=True)
    sede_id = serializers.PrimaryKeyRelatedField(
        source="sede", queryset=SedeHospitalaria.objects.all(), write_only=True
    )

    class Meta:
        model = HistoriaClinica
        fields = ["id", "paciente", "paciente_id", "empleado", "empleado_id", "sede", "sede_id", "fecha_registro", "diagnostico"]


class PrescripcionSerializer(serializers.ModelSerializer):
    historia = HistoriaClinicaSerializer(read_only=True)
    historia_id = serializers.PrimaryKeyRelatedField(
        source="historia", queryset=HistoriaClinica.objects.all(), write_only=True
    )
    medicamento = MedicamentoSerializer(read_only=True)
    medicamento_id = serializers.PrimaryKeyRelatedField(
        source="medicamento", queryset=Medicamento.objects.all(), write_only=True
    )

    class Meta:
        model = Prescripcion
        fields = ["id", "historia", "historia_id", "medicamento", "medicamento_id", "dosis", "frecuencia", "duracion", "fecha_emision"]


class AuditoriaAccesoSerializer(serializers.ModelSerializer):
    empleado = EmpleadoPublicSerializer(read_only=True)

    class Meta:
        model = AuditoriaAcceso
        fields = ["id", "empleado", "accion", "tabla_afectada", "fecha_evento", "ip_origen"]
        ordering = ["-fecha_evento"]
