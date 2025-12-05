from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from his.views import (
    SedeHospitalariaViewSet,
    DepartamentoViewSet,
    PacienteViewSet,
    CitaViewSet,
    MedicamentoViewSet,
    EquipamientoViewSet,
    HistoriaClinicaViewSet,
    PrescripcionViewSet,
    MedicamentosMasRecetadosView,
    AuthRegisterView,
    AuthLoginView,
    FrecuenciaEnfermedadesView,
    ConsumoMedicamentosDeptView,
    UtilizacionEquipamientoView,
    IndicesAtencionView,
    ResumenAnaliticaView,
)


router = routers.DefaultRouter()
router.register(r"sedes", SedeHospitalariaViewSet, basename="sede")
router.register(r"departamentos", DepartamentoViewSet, basename="departamento")
router.register(r"pacientes", PacienteViewSet, basename="paciente")
router.register(r"citas", CitaViewSet, basename="cita")
router.register(r"medicamentos", MedicamentoViewSet, basename="medicamento")
router.register(r"equipamiento", EquipamientoViewSet, basename="equipamiento")
router.register(r"historias-clinicas", HistoriaClinicaViewSet, basename="historia-clinica")
router.register(r"prescripciones", PrescripcionViewSet, basename="prescripcion")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path(
        "api/metricas/medicamentos-mas-recetados/",
        MedicamentosMasRecetadosView.as_view(),
        name="medicamentos-mas-recetados",
    ),
    path(
        "api/auth/register/",
        AuthRegisterView.as_view(),
        name="auth-register",
    ),
    path(
        "api/auth/login/",
        AuthLoginView.as_view(),
        name="auth-login",
    ),
    # Endpoints de analítica médica
    path(
        "api/analytics/frecuencia-enfermedades/",
        FrecuenciaEnfermedadesView.as_view(),
        name="frecuencia-enfermedades",
    ),
    path(
        "api/analytics/consumo-medicamentos/",
        ConsumoMedicamentosDeptView.as_view(),
        name="consumo-medicamentos",
    ),
    path(
        "api/analytics/utilizacion-equipamiento/",
        UtilizacionEquipamientoView.as_view(),
        name="utilizacion-equipamiento",
    ),
    path(
        "api/analytics/indices-atencion/",
        IndicesAtencionView.as_view(),
        name="indices-atencion",
    ),
    path(
        "api/analytics/resumen/",
        ResumenAnaliticaView.as_view(),
        name="resumen-analitica",
    ),
]
