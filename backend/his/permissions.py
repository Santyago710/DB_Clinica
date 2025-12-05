from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from django.utils.translation import gettext_lazy as _
from .models import Empleado


def get_empleado_from_request(request: Request) -> Empleado:
    """
    Obtiene el empleado a partir del header X-Empleado-Id.
    Lanza AuthenticationFailed si no es válido.
    """
    emp_id = request.headers.get("X-Empleado-Id")
    if not emp_id:
        raise AuthenticationFailed(_("Falta encabezado X-Empleado-Id."))

    try:
        emp_id_int = int(emp_id)
    except ValueError:
        raise AuthenticationFailed(_("El encabezado X-Empleado-Id no es válido."))

    try:
        empleado = Empleado.objects.select_related("depto", "depto__sede").get(id=emp_id_int)
    except Empleado.DoesNotExist:
        raise AuthenticationFailed(_("Empleado no encontrado."))

    return empleado


# Mapa HTTP -> acción CRUD
def metodo_a_accion(method: str) -> str:
    """
    Convierte método HTTP a acción CRUD:
    GET/HEAD/OPTIONS -> R
    POST -> C
    PUT/PATCH -> U
    DELETE -> D
    """
    method = method.upper()
    if method in ("GET", "HEAD", "OPTIONS"):
        return "R"
    if method == "POST":
        return "C"
    if method in ("PUT", "PATCH"):
        return "U"
    if method == "DELETE":
        return "D"
    return ""


# MATRIZ DE PERMISOS POR ROL Y MODELO
# Clave de modelo = Nombre de la clase del modelo de Django
PERMISOS_POR_ROL = {
    "ADMIN": {
        "SedeHospitalaria": set("CRUD"),
        "Departamento": set("CRUD"),
        "Empleado": set("CRUD"),
        "Paciente": set("CRUD"),
        "Cita": set("CRUD"),
        "HistoriaClinica": set("RU"),     # sin D
        "Prescripcion": set("RU"),        # sin D
        "Medicamento": set("CRUD"),
        "Equipamiento": set("CRUD"),
        "AuditoriaAcceso": set("R"),      # solo lectura
        "ReporteMedico": set("CRUD"),
    },
    "MEDICO": {
        "SedeHospitalaria": set("R"),
        "Departamento": set("R"),
        "Empleado": set("R"),             # consulta básica
        "Paciente": set("CRU"),           # no D
        "Cita": set("CRU"),               # incluye C opcional
        "HistoriaClinica": set("CRU"),    # no D
        "Prescripcion": set("CRU"),       # no D
        "Medicamento": set("R"),
        "Equipamiento": set("R"),
        "ReporteMedico": set("R"),        # ver reportes
        # sin acceso a AuditoriaAcceso
    },
    "ENFERMERO": {
        "SedeHospitalaria": set("R"),
        "Departamento": set("R"),
        "Empleado": set("R"),             # idealmente filtrado a sí mismo
        # Paciente: típicamente R,U; si quieres permitir C, agrega "C"
        "Paciente": set("RU"),
        # Cita: R,U (+ opcional C). Aquí permitimos también C.
        "Cita": set("CRU"),
        "HistoriaClinica": set("R"),
        "Prescripcion": set("R"),
        "Medicamento": set("R"),
        # Equipamiento: R, U
        "Equipamiento": set("RU"),
        "ReporteMedico": set("R"),
        # sin acceso a AuditoriaAcceso
    },
    "ADM": {
        "SedeHospitalaria": set("R"),
        "Departamento": set("R"),
        "Empleado": set("R"),             # vista básica
        "Paciente": set("CRU"),           # no D real (mejor baja lógica)
        "Cita": set("CRUD"),
        # sin acceso a HistoriaClinica / Prescripcion
        # Medicamento: caso general -> solo R (si fuera farmacia, se podría ampliar a CRU)
        "Medicamento": set("R"),
        # Equipamiento: C, R, U
        "Equipamiento": set("CRU"),
        "ReporteMedico": set("R"),
        # sin acceso a AuditoriaAcceso
    },
}


def empleado_tiene_permiso(empleado: Empleado, model_name: str, accion: str) -> bool:
    
    rol = empleado.rol
    if not rol:
        return False

    modelo_permisos = PERMISOS_POR_ROL.get(rol, {})
    acciones_permitidas = modelo_permisos.get(model_name, set())
    return accion in acciones_permitidas


class PermisoPorRolModelo(BasePermission):
    

    def has_permission(self, request, view):
        try:
            empleado = get_empleado_from_request(request)
        except AuthenticationFailed:
            return False

        # Guardamos el empleado para uso posterior en la vista
        request.empleado_actual = empleado

        # Determinar el modelo sobre el que actúa la vista
        model = getattr(getattr(view, "queryset", None), "model", None)
        # También permitimos que la vista defina explícitamente permission_model
        if hasattr(view, "permission_model") and view.permission_model is not None:
            model = view.permission_model

        if model is None:
            # Si la vista no tiene modelo asociado, por seguridad negamos
            return False

        model_name = model.__name__
        accion = metodo_a_accion(request.method)

        if not accion:
            # Métodos raros: denegamos
            return False

        return empleado_tiene_permiso(empleado, model_name, accion)


class EsEmpleadoAutenticado(BasePermission):
    

    def has_permission(self, request, view):
        try:
            empleado = get_empleado_from_request(request)
            request.empleado_actual = empleado
            return True
        except AuthenticationFailed:
            return False


class EsAdmin(BasePermission):
    

    def has_permission(self, request, view):
        try:
            empleado = get_empleado_from_request(request)
            request.empleado_actual = empleado
            return empleado.rol == "ADMIN"
        except AuthenticationFailed:
            return False


class EsMedico(BasePermission):
    

    def has_permission(self, request, view):
        try:
            empleado = get_empleado_from_request(request)
            request.empleado_actual = empleado
            return empleado.rol == "MEDICO"
        except AuthenticationFailed:
            return False
