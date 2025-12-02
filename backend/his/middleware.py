from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin

from .models import AuditoriaAcceso
from .permissions import get_empleado_from_request, metodo_a_accion


class AuditoriaAccesosMiddleware(MiddlewareMixin):
    """
    Middleware que registra accesos a las tablas del modelo.

    - Obtiene el empleado desde X-Empleado-Id (si existe y es válido).
    - Determina qué modelo está asociado a la vista (queryset.model o permission_model).
    - Traduce el método HTTP a acción CRUD (C/R/U/D).
    - Guarda un registro en Auditoria_Accesos solo si la respuesta es exitosa (< 400).

    No audita:
    - /api/auth/login/
    - /admin/ (opcional)
    """

    def process_view(self, request, view_func, view_args, view_kwargs):
        # No auditamos el login, el admin ni las métricas (son reportes, no accesos directos a datos)
        path = request.path or ""
        if (path.startswith("/admin/") or 
            path.startswith("/api/auth/login/") or 
            path.startswith("/api/metricas/")):
            return None

        # Intentamos obtener el empleado; si no hay, no auditamos
        try:
            empleado = get_empleado_from_request(request)
        except Exception:
            # No autenticado o header inválido -> no auditamos
            return None

        # Determinar la clase de vista (para DRF / CBV)
        view_class = getattr(view_func, "view_class", None) or getattr(view_func, "cls", None)
        model = None

        if view_class is not None:
            # Si la vista define un permission_model explícito, lo usamos
            if hasattr(view_class, "permission_model") and view_class.permission_model is not None:
                model = view_class.permission_model
            else:
                queryset = getattr(view_class, "queryset", None)
                if queryset is not None:
                    model = getattr(queryset, "model", None)

        if model is None:
            # Si no pudimos determinar el modelo, no auditamos
            return None

        accion = metodo_a_accion(request.method)
        if not accion:
            return None

        # Guardamos info en el request para usarla en process_response
        request._auditoria_info = {
            "empleado": empleado,
            "accion": accion,
            "tabla": model._meta.db_table,
        }

        return None

    def process_response(self, request, response):
        info = getattr(request, "_auditoria_info", None)
        if info is None:
            return response

        # Solo auditamos respuestas exitosas
        if response.status_code >= 400:
            return response

        empleado = info["empleado"]
        accion = info["accion"]
        tabla = info["tabla"]

        ip = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip:
            ip = ip.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "0.0.0.0")

        try:
            AuditoriaAcceso.objects.create(
                empleado=empleado,
                accion=accion,
                tabla_afectada=tabla,
                fecha_evento=timezone.now(),
                ip_origen=ip,
            )
        except Exception:
            # Nunca reventar la app por un error de auditoría
            pass

        return response
