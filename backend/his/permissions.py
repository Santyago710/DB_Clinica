from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from .models import Empleado


def get_empleado_from_request(request):
    
    emp_id = request.headers.get("X-Empleado-Id")
    if not emp_id:
        raise AuthenticationFailed("Falta encabezado X-Empleado-Id.")

    try:
        emp_id_int = int(emp_id)
    except ValueError:
        raise AuthenticationFailed("El encabezado X-Empleado-Id no es válido.")

    try:
        empleado = Empleado.objects.select_related("depto", "depto__sede").get(id=emp_id_int)
    except Empleado.DoesNotExist:
        raise AuthenticationFailed("Empleado no encontrado.")

    return empleado


class EsEmpleadoAutenticado(BasePermission):
    
    def has_permission(self, request, view):
        try:
            empleado = get_empleado_from_request(request)
            # Adjuntamos el empleado al request para que la vista pueda usarlo
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
