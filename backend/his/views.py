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
    HistoriaClinica,
    Equipamiento,
    AuditoriaAcceso,
)
from .serializers import (
    SedeHospitalariaSerializer,
    DepartamentoSerializer,
    PacienteSerializer,
    CitaSerializer,
    EmpleadoPublicSerializer,
    EmpleadoCreateSerializer,
    EmpleadoSerializer,
    MedicamentoSerializer,
    EquipamientoSerializer,
    HistoriaClinicaSerializer,
    PrescripcionSerializer,
    AuditoriaAccesoSerializer,
)
from .permissions import (
    PermisoPorRolModelo,
    EsEmpleadoAutenticado,
    EsAdmin,
)


class SedeHospitalariaViewSet(viewsets.ModelViewSet):
    queryset = SedeHospitalaria.objects.all()
    serializer_class = SedeHospitalariaSerializer
    permission_classes = [PermisoPorRolModelo]


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.select_related("sede").all()
    serializer_class = DepartamentoSerializer

    def get_permissions(self):
        """
        Permite GET (listar) sin autenticación, pero requiere autenticación para crear/editar/eliminar
        """
        if self.request.method == "GET":
            return []
        return [PermisoPorRolModelo()]


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


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.select_related("depto", "depto__sede").all()
    serializer_class = EmpleadoSerializer
    permission_classes = [PermisoPorRolModelo]

    def get_serializer_class(self):
        """
        Usa EmpleadoCreateSerializer para POST, EmpleadoSerializer para otros
        """
        if self.request.method == "POST":
            return EmpleadoCreateSerializer
        return EmpleadoSerializer

    def create(self, request, *args, **kwargs):
        """
        Permite crear empleados con hash de contraseña
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MedicamentoViewSet(viewsets.ModelViewSet):
    queryset = Medicamento.objects.all()
    serializer_class = MedicamentoSerializer
    permission_classes = [PermisoPorRolModelo]


class EquipamientoViewSet(viewsets.ModelViewSet):
    queryset = Equipamiento.objects.select_related("depto", "depto__sede", "responsable").all()
    serializer_class = EquipamientoSerializer
    permission_classes = [PermisoPorRolModelo]


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.select_related("paciente", "empleado", "sede").all()
    serializer_class = HistoriaClinicaSerializer
    permission_classes = [PermisoPorRolModelo]


class PrescripcionViewSet(viewsets.ModelViewSet):
    queryset = Prescripcion.objects.select_related("historia", "medicamento").all()
    serializer_class = PrescripcionSerializer
    permission_classes = [PermisoPorRolModelo]
    

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


    
class AuthRegisterView(APIView):
    """
    Vista para crear un nuevo empleado (registro)
    No requiere autenticación para permitir el registro desde el frontend
    """
    permission_classes = []

    def post(self, request):
        serializer = EmpleadoCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "detail": "Empleado creado exitosamente.",
                    "empleado": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"detail": "Errores en la validación.", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


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


# ==================== MÓDULO DE ANALÍTICA MÉDICA ====================

class FrecuenciaEnfermedadesView(APIView):
    """
    Devuelve la frecuencia de enfermedades tratadas en el último año.
    Agrupa por diagnóstico y cuenta historias clínicas.
    """
    permission_classes = [EsEmpleadoAutenticado]
    permission_model = HistoriaClinica

    def get(self, request):
        from .models import HistoriaClinica
        
        hace_un_ano = timezone.now() - timedelta(days=365)

        queryset = (
            HistoriaClinica.objects.filter(fecha_registro__gte=hace_un_ano)
            .values("diagnostico")
            .annotate(total=Count("id"))
            .order_by("-total")[:20]
        )

        data = [
            {
                "diagnostico": item["diagnostico"],
                "frecuencia": item["total"],
            }
            for item in queryset
        ]

        return Response(data, status=status.HTTP_200_OK)


class ConsumoMedicamentosDeptView(APIView):
    """
    Devuelve el consumo de medicamentos por departamento en el último mes.
    Agrupa por departamento y medicamento.
    """
    permission_classes = [EsEmpleadoAutenticado]
    permission_model = Prescripcion

    def get(self, request):
        hace_un_mes = timezone.now() - timedelta(days=30)

        queryset = (
            Prescripcion.objects.filter(fecha_emision__gte=hace_un_mes)
            .values(
                "historia__sede__nom_sede",
                "historia__empleado__depto__nom_dept",
                "medicamento__nom_med",
                "medicamento__id",
            )
            .annotate(cantidad=Count("id"))
            .order_by(
                "historia__empleado__depto__nom_dept",
                "-cantidad"
            )
        )

        data = [
            {
                "sede": item["historia__sede__nom_sede"],
                "departamento": item["historia__empleado__depto__nom_dept"],
                "medicamento": item["medicamento__nom_med"],
                "medicamento_id": item["medicamento__id"],
                "cantidad_prescripciones": item["cantidad"],
            }
            for item in queryset
        ]

        return Response(data, status=status.HTTP_200_OK)


class UtilizacionEquipamientoView(APIView):
    """
    Devuelve el estado y utilización del equipamiento por departamento.
    """
    permission_classes = [EsEmpleadoAutenticado]
    permission_model = Equipamiento

    def get(self, request):
        from .models import Equipamiento
        
        queryset = (
            Equipamiento.objects.select_related("depto", "depto__sede")
            .values(
                "depto__sede__nom_sede",
                "depto__nom_dept",
                "estado",
            )
            .annotate(total=Count("id"))
            .order_by("depto__nom_dept", "estado")
        )

        data = [
            {
                "sede": item["depto__sede__nom_sede"],
                "departamento": item["depto__nom_dept"],
                "estado": item["estado"],
                "cantidad": item["total"],
            }
            for item in queryset
        ]

        return Response(data, status=status.HTTP_200_OK)


class IndicesAtencionView(APIView):
    """
    Devuelve índices de atención y tiempos promedio de espera por sede.
    Calcula:
    - Total de citas (últimos 30 días)
    - Citas atendidas
    - Citas pendientes
    - Citas canceladas
    - Porcentaje de cumplimiento
    """
    permission_classes = [EsEmpleadoAutenticado]
    permission_model = Cita

    def get(self, request):
        hace_un_mes = timezone.now() - timedelta(days=30)

        # Estadísticas por sede
        queryset = (
            Cita.objects.filter(fecha__gte=hace_un_mes.date())
            .values("depto__sede__nom_sede", "depto__sede__id", "estado")
            .annotate(total=Count("id"))
            .order_by("depto__sede__nom_sede", "estado")
        )

        # Agrupar datos por sede
        sedes_data = {}
        for item in queryset:
            sede_nombre = item["depto__sede__nom_sede"]
            sede_id = item["depto__sede__id"]
            estado = item["estado"]
            total = item["total"]

            if sede_nombre not in sedes_data:
                sedes_data[sede_nombre] = {
                    "sede_id": sede_id,
                    "sede": sede_nombre,
                    "total_citas": 0,
                    "atendidas": 0,
                    "pendientes": 0,
                    "canceladas": 0,
                }

            sedes_data[sede_nombre]["total_citas"] += total
            if estado == "ATENDIDA":
                sedes_data[sede_nombre]["atendidas"] = total
            elif estado == "PENDIENTE":
                sedes_data[sede_nombre]["pendientes"] = total
            elif estado == "CANCELADA":
                sedes_data[sede_nombre]["canceladas"] = total

        # Calcular porcentajes
        data = []
        for sede_nombre, stats in sedes_data.items():
            total = stats["total_citas"]
            porcentaje_cumplimiento = (
                (stats["atendidas"] / total * 100) if total > 0 else 0
            )
            data.append({
                "sede_id": stats["sede_id"],
                "sede": stats["sede"],
                "total_citas": stats["total_citas"],
                "citas_atendidas": stats["atendidas"],
                "citas_pendientes": stats["pendientes"],
                "citas_canceladas": stats["canceladas"],
                "porcentaje_cumplimiento": round(porcentaje_cumplimiento, 2),
            })

        data.sort(key=lambda x: x["sede"])
        return Response(data, status=status.HTTP_200_OK)


class ResumenAnaliticaView(APIView):
    """
    Devuelve un resumen consolidado de todas las métricas de analítica.
    """
    permission_classes = [EsEmpleadoAutenticado]

    def get(self, request):
        hace_un_mes = timezone.now() - timedelta(days=30)
        hace_un_ano = timezone.now() - timedelta(days=365)

        # 1. Total de pacientes atendidos en el último mes
        pacientes_atendidos = (
            HistoriaClinica.objects.filter(fecha_registro__gte=hace_un_mes)
            .values("paciente_id")
            .distinct()
            .count()
        )

        # 2. Total de prescripciones en el último mes
        total_prescripciones = (
            Prescripcion.objects.filter(fecha_emision__gte=hace_un_mes).count()
        )

        # 3. Medicamento más recetado
        medicamento_top = (
            Prescripcion.objects.filter(fecha_emision__gte=hace_un_mes)
            .values("medicamento__nom_med")
            .annotate(total=Count("id"))
            .order_by("-total")
            .first()
        )

        # 4. Departamento con más citas
        depto_top = (
            Cita.objects.filter(fecha__gte=hace_un_mes.date())
            .values("depto__nom_dept")
            .annotate(total=Count("id"))
            .order_by("-total")
            .first()
        )

        # 5. Diagnóstico más frecuente en el último año
        diagnostico_top = (
            HistoriaClinica.objects.filter(fecha_registro__gte=hace_un_ano)
            .values("diagnostico")
            .annotate(total=Count("id"))
            .order_by("-total")
            .first()
        )

        # 6. Estado del equipamiento
        equipamiento_operativo = (
            Equipamiento.objects.filter(estado="OPERATIVO").count()
        )
        equipamiento_mantenimiento = (
            Equipamiento.objects.filter(estado="EN_MANTENIMIENTO").count()
        )
        equipamiento_fuera = (
            Equipamiento.objects.filter(estado="FUERA_SERVICIO").count()
        )

        return Response({
            "resumen_mes": {
                "pacientes_atendidos": pacientes_atendidos,
                "total_prescripciones": total_prescripciones,
                "medicamento_top": medicamento_top.get("medicamento__nom_med") if medicamento_top else None,
                "medicamento_top_cantidad": medicamento_top.get("total") if medicamento_top else 0,
                "departamento_top": depto_top.get("depto__nom_dept") if depto_top else None,
                "departamento_top_citas": depto_top.get("total") if depto_top else 0,
            },
            "resumen_anual": {
                "diagnostico_frecuente": diagnostico_top.get("diagnostico") if diagnostico_top else None,
                "diagnostico_frecuente_total": diagnostico_top.get("total") if diagnostico_top else 0,
            },
            "equipamiento": {
                "operativo": equipamiento_operativo,
                "en_mantenimiento": equipamiento_mantenimiento,
                "fuera_servicio": equipamiento_fuera,
            }
        }, status=status.HTTP_200_OK)


class AuditoriaAccesoViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para ver registros de auditoría (solo lectura)"""
    queryset = AuditoriaAcceso.objects.select_related("empleado").order_by("-fecha_evento").all()
    serializer_class = AuditoriaAccesoSerializer
    permission_classes = [EsAdmin]
    
    def get_queryset(self):
        """Retornar registros más recientes primero"""
        queryset = super().get_queryset()
        
        # Filtrar por tabla si se especifica
        tabla = self.request.query_params.get("tabla")
        if tabla:
            queryset = queryset.filter(tabla_afectada=tabla)
        
        # Filtrar por empleado si se especifica
        empleado_id = self.request.query_params.get("empleado_id")
        if empleado_id:
            queryset = queryset.filter(empleado_id=empleado_id)
        
        # Filtrar por acción si se especifica
        accion = self.request.query_params.get("accion")
        if accion:
            queryset = queryset.filter(accion=accion)
        
        return queryset
