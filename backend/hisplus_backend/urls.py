from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from his.views import (
    SedeHospitalariaViewSet,
    DepartamentoViewSet,
    PacienteViewSet,
    CitaViewSet,
    MedicamentosMasRecetadosView,  
)


router = routers.DefaultRouter()
router.register(r"sedes", SedeHospitalariaViewSet, basename="sede")
router.register(r"departamentos", DepartamentoViewSet, basename="departamento")
router.register(r"pacientes", PacienteViewSet, basename="paciente")
router.register(r"citas", CitaViewSet, basename="cita")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path(
        "api/metricas/medicamentos-mas-recetados/",
        MedicamentosMasRecetadosView.as_view(),
        name="medicamentos-mas-recetados",
    ),
]
