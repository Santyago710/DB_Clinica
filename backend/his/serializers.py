from rest_framework import serializers
from .models import (
    SedeHospitalaria,
    Departamento,
    Paciente,
    Cita,
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


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = "__all__"


class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)

    class Meta:
        model = Cita
        fields = "__all__"
