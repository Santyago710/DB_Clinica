from rest_framework import serializers
from .models import (
    SedeHospitalaria,
    Departamento,
    Paciente,
    Cita,
    Empleado
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


class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)

    class Meta:
        model = Cita
        fields = "__all__"

class EmpleadoPublicSerializer(serializers.ModelSerializer):
    depto = DepartamentoSerializer(read_only=True)

    class Meta:
        model = Empleado
        fields = ["id", "nom_emp", "correo", "rol", "cargo", "depto"]


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
