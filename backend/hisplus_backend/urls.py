from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from his.views import (
    SedeHospitalariaViewSet,
    DepartamentoViewSet,
    PacienteViewSet,
    CitaViewSet,
    EmpleadoViewSet,
    MedicamentoViewSet,
    EquipamientoViewSet,
    HistoriaClinicaViewSet,
    PrescripcionViewSet,
    AuditoriaAccesoViewSet,
    MedicamentosMasRecetadosView,
    AuthRegisterView,
    AuthLoginView,
    FrecuenciaEnfermedadesView,
    ConsumoMedicamentosDeptView,
    UtilizacionEquipamientoView,
    IndicesAtencionView,
    ResumenAnaliticaView,
    MedicosConMasConsultasView,
    TiempoPromedioCitaDiagnosticoView,
    AuditoriaHistoriasView,
    DepartamentosCompartidosView,
    PacientesPorEnfermedadSedeView,
    HistoriasClinicasReplicadasView,
)


router = routers.DefaultRouter()
router.register(r"sedes", SedeHospitalariaViewSet, basename="sede")
router.register(r"departamentos", DepartamentoViewSet, basename="departamento")
router.register(r"empleados", EmpleadoViewSet, basename="empleado")
router.register(r"pacientes", PacienteViewSet, basename="paciente")
router.register(r"citas", CitaViewSet, basename="cita")
router.register(r"medicamentos", MedicamentoViewSet, basename="medicamento")
router.register(r"equipamiento", EquipamientoViewSet, basename="equipamiento")
router.register(r"historias-clinicas", HistoriaClinicaViewSet, basename="historia-clinica")
router.register(r"prescripciones", PrescripcionViewSet, basename="prescripcion")
router.register(r"auditoria", AuditoriaAccesoViewSet, basename="auditoria")


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
    # Nuevas métricas avanzadas
    path(
        "api/metricas/medicos-mas-consultas/",
        MedicosConMasConsultasView.as_view(),
        name="medicos-mas-consultas",
    ),
    path(
        "api/metricas/tiempo-cita-diagnostico/",
        TiempoPromedioCitaDiagnosticoView.as_view(),
        name="tiempo-cita-diagnostico",
    ),
    path(
        "api/metricas/auditoria-historias/",
        AuditoriaHistoriasView.as_view(),
        name="auditoria-historias",
    ),
    path(
        "api/metricas/departamentos-compartidos/",
        DepartamentosCompartidosView.as_view(),
        name="departamentos-compartidos",
    ),
    path(
        "api/metricas/pacientes-por-enfermedad-sede/",
        PacientesPorEnfermedadSedeView.as_view(),
        name="pacientes-por-enfermedad-sede",
    ),
    path(
        "api/metricas/historias-replicadas/",
        HistoriasClinicasReplicadasView.as_view(),
        name="historias-replicadas",
    ),
]

