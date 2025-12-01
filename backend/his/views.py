from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count

from .models import (
    SedeHospitalaria,
    Departamento,
    Paciente,
    Cita,
    Prescripcion,          
    Medicamento,           
)
from .serializers import (
    SedeHospitalariaSerializer,
    DepartamentoSerializer,
    PacienteSerializer,
    CitaSerializer,
)


class SedeHospitalariaViewSet(viewsets.ModelViewSet):
    queryset = SedeHospitalaria.objects.all()
    serializer_class = SedeHospitalariaSerializer


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.select_related("sede").all()
    serializer_class = DepartamentoSerializer


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related("paciente", "empleado", "depto").all()
    serializer_class = CitaSerializer

    # Ejemplo de acción personalizada básica (luego podemos hacer métricas)
    @action(detail=False, methods=["get"])
    def por_estado(self, request):
        """
        Devuelve conteo de citas por estado.
        """
        from django.db.models import Count

        data = (
            Cita.objects.values("estado")
            .annotate(total=Count("id"))
            .order_by("estado")
        )
        return Response(list(data))
    
class MedicamentosMasRecetadosView(APIView):
    """
    Devuelve los medicamentos más recetados por sede en el último mes.
    Agrupa por sede y medicamento, ordenado por total de prescripciones.
    """

    def get(self, request):
        hace_un_mes = timezone.now() - timedelta(days=30)

        queryset = (
            Prescripcion.objects.filter(fecha_emision__gte=hace_un_mes)
            .values(
                "historia__sede__id",
                "historia__sede__nom_sede",
                "medicamento__id",
                "medicamento__nom_med",
            )
            .annotate(total_prescripciones=Count("id"))
            .order_by("-total_prescripciones")
        )

        # Renombrar claves para que la respuesta quede más clara
        data = [
            {
                "sede_id": item["historia__sede__id"],
                "sede": item["historia__sede__nom_sede"],
                "medicamento_id": item["medicamento__id"],
                "nom_med": item["medicamento__nom_med"],
                "total_prescripciones": item["total_prescripciones"],
            }
            for item in queryset
        ]

        return Response(data, status=status.HTTP_200_OK)

