from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status

from django.utils import timezone
from datetime import timedelta
from django.db.models import Count
from django.contrib.auth.hashers import check_password

from .models import (
    SedeHospitalaria,
    Departamento,
    Paciente,
    Cita,
    Prescripcion,          
    Medicamento,
    Empleado,           
)
from .serializers import (
    SedeHospitalariaSerializer,
    DepartamentoSerializer,
    PacienteSerializer,
    CitaSerializer,
    EmpleadoPublicSerializer,
)
from .permissions import (
    PermisoPorRolModelo,
    EsEmpleadoAutenticado,
)


class SedeHospitalariaViewSet(viewsets.ModelViewSet):
    queryset = SedeHospitalaria.objects.all()
    serializer_class = SedeHospitalariaSerializer
    permission_classes = [PermisoPorRolModelo]


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.select_related("sede").all()
    serializer_class = DepartamentoSerializer
    permission_classes = [PermisoPorRolModelo]


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [PermisoPorRolModelo]


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related("paciente", "empleado", "depto").all()
    serializer_class = CitaSerializer
    permission_classes = [PermisoPorRolModelo]

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
    permission_classes = [EsEmpleadoAutenticado]
    permission_model = Prescripcion   # 👈 clave: para auditoría y permisos futuros

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


    
class AuthLoginView(APIView):
    

    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo or not password:
            return Response(
                {"detail": "Debe enviar correo y password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            empleado = Empleado.objects.select_related("depto", "depto__sede").get(correo=correo)
        except Empleado.DoesNotExist:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not empleado.hash_contra:
            return Response(
                {"detail": "El usuario no tiene contraseña configurada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(password, empleado.hash_contra):
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Si todo OK, devolvemos los datos públicos del empleado
        serializer = EmpleadoPublicSerializer(empleado)
        return Response(
            {
                "detail": "Login exitoso.",
                "empleado": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


