import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { 
  PacientesPage, 
  CitasPage, 
  MedicamentosPage,
  SedesHospitaliariasPage,
  DepartamentosPage,
  EmpleadosPage,
  EquipamientoPage,
  HistoriaClinicaPage,
  PrescripcionesPage,
  AuditoriaPage
} from "./CRUDPages";
import { API_BASE_URL } from "./apiConfig";

//console.log("API_BASE_URL =>", API_BASE_URL);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

function App() {
  // Estado de autenticación
  const [empleado, setEmpleado] = useState(null);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Estado de navegación
  const [paginaActual, setPaginaActual] = useState("inicio");

  // Estado de analítica
  const [analiticalData, setAnaliticaData] = useState({
    resumen: null,
    frecuenciaEnfermedades: [],
    consumoMedicamentos: [],
    utilizacionEquipamiento: [],
    indicesAtencion: [],
  });
  const [cargandoAnalitica, setCargandoAnalitica] = useState(false);
  const [errorAnalitica, setErrorAnalitica] = useState(null);

  // Matriz de permisos por rol
  const matrizPermisos = {
    ADMIN: {
      "Sedes Hospitalarias": "CRUD",
      "Departamentos": "CRUD",
      "Empleados": "CRUD",
      "Pacientes": "CRUD",
      "Citas": "CRUD",
      "Historia Clínica": "RU",
      "Prescripciones": "RU",
      "Medicamentos": "CRUD",
      "Equipamiento": "CRUD",
      "Auditoría": "R",
      "Reportes": "CRUD",
    },
    MEDICO: {
      "Sedes Hospitalarias": "R",
      "Departamentos": "R",
      "Empleados": "R",
      "Pacientes": "CRU",
      "Citas": "CRU",
      "Historia Clínica": "CRU",
      "Prescripciones": "CRU",
      "Medicamentos": "R",
      "Equipamiento": "R",
      "Auditoría": "-",
      "Reportes": "R",
    },
    ENFERMERO: {
      "Sedes Hospitalarias": "R",
      "Departamentos": "R",
      "Empleados": "R",
      "Pacientes": "RU",
      "Citas": "CRU",
      "Historia Clínica": "R",
      "Prescripciones": "R",
      "Medicamentos": "R",
      "Equipamiento": "RU",
      "Auditoría": "-",
      "Reportes": "R",
    },
    ADM: {
      "Sedes Hospitalarias": "R",
      "Departamentos": "R",
      "Empleados": "R",
      "Pacientes": "CRU",
      "Citas": "CRUD",
      "Historia Clínica": "-",
      "Prescripciones": "-",
      "Medicamentos": "R",
      "Equipamiento": "CRU",
      "Auditoría": "-",
      "Reportes": "R",
    },
  };

  // Estado de registro
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [formRegistro, setFormRegistro] = useState({
    nom_emp: "",
    correo: "",
    tel_emp: "",
    cargo: "",
    rol: "ADM",
    depto_id: "",
    hash_contra: "",
    confirmPassword: "",
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [registroError, setRegistroError] = useState(null);
  const [registroLoading, setRegistroLoading] = useState(false);
  const [registroSuccess, setRegistroSuccess] = useState(null);

  // Cargar departamentos cuando se abre el formulario de registro
  useEffect(() => {
    if (mostrarRegistro) {
      const fetchDepartamentos = async () => {
        try {
          const resp = await fetch(`${API_BASE_URL}/api/departamentos/`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (resp.ok) {
            const data = await resp.json();
            setDepartamentos(data.results || data);
          }
        } catch (err) {
          console.error("Error al cargar departamentos:", err);
        }
      };
      fetchDepartamentos();
    }
  }, [mostrarRegistro]);

  // Estado de métricas
  const [datos, setDatos] = useState([]);
  const [cargandoMetricas, setCargandoMetricas] = useState(false);
  const [errorMetricas, setErrorMetricas] = useState(null);

  // Estados para métricas avanzadas
  const [medicosConsultas, setMedicosConsultas] = useState([]);
  const [tiempoPromedio, setTiempoPromedio] = useState(null);
  const [auditoriaHistorias, setAuditoriaHistorias] = useState([]);
  const [departamentosCompartidos, setDepartamentosCompartidos] = useState({});
  const [pacientesEnfermedad, setPacientesEnfermedad] = useState([]);
  const [historiasReplicadas, setHistoriasReplicadas] = useState([]);
  const [cargandoMetricasAvanzadas, setCargandoMetricasAvanzadas] = useState(false);
  const [errorMetricasAvanzadas, setErrorMetricasAvanzadas] = useState(null);

  // Handler de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      if (!resp.ok) {
        const dataError = await resp.json().catch(() => null);
        const msg =
          dataError && dataError.detail
            ? dataError.detail
            : `Error HTTP: ${resp.status}`;
        throw new Error(msg);
      }

      const data = await resp.json();
      setEmpleado(data.empleado);
      setCorreo("");
      setPassword("");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handler de registro
  const handleRegistroChange = (e) => {
    const { name, value } = e.target;
    setFormRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setRegistroError(null);
    setRegistroSuccess(null);
    setRegistroLoading(true);

    // Validar que las contraseñas coincidan
    if (formRegistro.hash_contra !== formRegistro.confirmPassword) {
      setRegistroError("Las contraseñas no coinciden");
      setRegistroLoading(false);
      return;
    }

    const datosRegistro = {
      nom_emp: formRegistro.nom_emp,
      correo: formRegistro.correo,
      tel_emp: formRegistro.tel_emp,
      cargo: formRegistro.cargo,
      rol: formRegistro.rol,
      depto_id: parseInt(formRegistro.depto_id),
      hash_contra: formRegistro.hash_contra,
    };

    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosRegistro),
      });

      if (!resp.ok) {
        const dataError = await resp.json().catch(() => null);
        const msg =
          dataError && dataError.detail
            ? dataError.detail
            : `Error HTTP: ${resp.status}`;
        throw new Error(msg);
      }

      setRegistroSuccess("¡Empleado registrado exitosamente!");
      setFormRegistro({
        nom_emp: "",
        correo: "",
        tel_emp: "",
        cargo: "",
        rol: "ADM",
        depto_id: "",
        hash_contra: "",
        confirmPassword: "",
      });

      // Cerrar el formulario después de 2 segundos
      setTimeout(() => {
        setMostrarRegistro(false);
      }, 2000);
    } catch (err) {
      setRegistroError(err.message);
    } finally {
      setRegistroLoading(false);
    }
  };

  
  // Cuando haya empleado logueado **y** la página actual sea "metricas", cargamos las métricas
  useEffect(() => {
    if (!empleado || paginaActual !== "metricas") {
      return;
    }

    const fetchMetricas = async () => {
      setCargandoMetricas(true);
      setErrorMetricas(null);

      try {
        const resp = await fetch(
          `${API_BASE_URL}/api/metricas/medicamentos-mas-recetados/`,
          {
            headers: {
              "X-Empleado-Id": empleado.id,
            },
          }
        );

        if (!resp.ok) {
          throw new Error(`Error HTTP: ${resp.status}`);
        }

        const data = await resp.json();
        setDatos(data);
      } catch (err) {
        setErrorMetricas(err.message);
      } finally {
        setCargandoMetricas(false);
      }
    };

    fetchMetricas();
  }, [empleado, paginaActual]); // 👈 ahora depende también de paginaActual

  // Cargar métricas avanzadas cuando la página es "metricas_avanzadas"
  useEffect(() => {
    if (!empleado || paginaActual !== "metricas_avanzadas") {
      return;
    }

    const fetchMetricasAvanzadas = async () => {
      setCargandoMetricasAvanzadas(true);
      setErrorMetricasAvanzadas(null);

      try {
        const headers = {
          "Content-Type": "application/json",
          "X-Empleado-Id": String(empleado.id),
        };

        console.log("Headers enviados:", headers);
        console.log("Empleado ID:", empleado.id);

        const [
          respMedicos,
          respTiempo,
          respAuditoria,
          respDepartamentos,
          respPacientes,
          respHistorias
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/metricas/medicos-mas-consultas/`, { headers, method: "GET" }),
          fetch(`${API_BASE_URL}/api/metricas/tiempo-cita-diagnostico/`, { headers, method: "GET" }),
          fetch(`${API_BASE_URL}/api/metricas/auditoria-historias/`, { headers, method: "GET" }),
          fetch(`${API_BASE_URL}/api/metricas/departamentos-compartidos/`, { headers, method: "GET" }),
          fetch(`${API_BASE_URL}/api/metricas/pacientes-por-enfermedad-sede/`, { headers, method: "GET" }),
          fetch(`${API_BASE_URL}/api/metricas/historias-replicadas/`, { headers, method: "GET" }),
        ]);

        // Validar respuestas
        const responses = [
          { name: "Médicos", resp: respMedicos },
          { name: "Tiempo", resp: respTiempo },
          { name: "Auditoría", resp: respAuditoria },
          { name: "Departamentos", resp: respDepartamentos },
          { name: "Pacientes", resp: respPacientes },
          { name: "Historias", resp: respHistorias },
        ];

        for (const { name, resp } of responses) {
          if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({}));
            console.error(`Error en ${name}:`, resp.status, errorData);
            throw new Error(`Error en ${name}: ${resp.status} - ${errorData.detail || resp.statusText}`);
          }
        }

        const dataMedicos = await respMedicos.json();
        const dataTiempo = await respTiempo.json();
        const dataAuditoria = await respAuditoria.json();
        const dataDepartamentos = await respDepartamentos.json();
        const dataPacientes = await respPacientes.json();
        const dataHistorias = await respHistorias.json();

        setMedicosConsultas(dataMedicos);
        setTiempoPromedio(dataTiempo);
        setAuditoriaHistorias(dataAuditoria);
        setDepartamentosCompartidos(dataDepartamentos);
        setPacientesEnfermedad(dataPacientes);
        setHistoriasReplicadas(dataHistorias);
      } catch (err) {
        setErrorMetricasAvanzadas(err.message);
      } finally {
        setCargandoMetricasAvanzadas(false);
      }
    };

    fetchMetricasAvanzadas();
  }, [empleado, paginaActual]);

  // Cargar analítica cuando la página es "analitica"
  useEffect(() => {
    if (!empleado || paginaActual !== "analitica") {
      return;
    }
    cargarAnalitica();
  }, [empleado, paginaActual]);

  // Preparar datos para la gráfica
  const labels = datos.map((item) => `${item.nom_med} (${item.sede})`);
  const valores = datos.map((item) => item.total_prescripciones);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total de prescripciones",
        data: valores,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Medicamentos más recetados por sede (último mes)",
      },
    },
  };

  const handleLogout = () => {
    setEmpleado(null);
    setDatos([]);
    setPaginaActual("inicio");
  };

  // Función para cargar datos de analítica
  const cargarAnalitica = async () => {
    if (!empleado) return;
    
    setCargandoAnalitica(true);
    setErrorAnalitica(null);

    try {
      const headers = {
        "X-Empleado-Id": empleado.id,
      };

      // Cargar resumen
      const resumenResp = await fetch(
        `${API_BASE_URL}/api/analytics/resumen/`,
        { headers }
      );
      const resumenData = resumenResp.ok ? await resumenResp.json() : null;

      // Cargar frecuencia de enfermedades
      const enfermedadesResp = await fetch(
        `${API_BASE_URL}/api/analytics/frecuencia-enfermedades/`,
        { headers }
      );
      const enfermedadesData = enfermedadesResp.ok ? await enfermedadesResp.json() : [];

      // Cargar consumo de medicamentos
      const medicamentosResp = await fetch(
        `${API_BASE_URL}/api/analytics/consumo-medicamentos/`,
        { headers }
      );
      const medicamentosData = medicamentosResp.ok ? await medicamentosResp.json() : [];

      // Cargar utilización de equipamiento
      const equipamientoResp = await fetch(
        `${API_BASE_URL}/api/analytics/utilizacion-equipamiento/`,
        { headers }
      );
      const equipamientoData = equipamientoResp.ok ? await equipamientoResp.json() : [];

      // Cargar índices de atención
      const indicesResp = await fetch(
        `${API_BASE_URL}/api/analytics/indices-atencion/`,
        { headers }
      );
      const indicesData = indicesResp.ok ? await indicesResp.json() : [];

      setAnaliticaData({
        resumen: resumenData,
        frecuenciaEnfermedades: enfermedadesData,
        consumoMedicamentos: medicamentosData,
        utilizacionEquipamiento: equipamientoData,
        indicesAtencion: indicesData,
      });
    } catch (err) {
      setErrorAnalitica(err.message);
    } finally {
      setCargandoAnalitica(false);
    }
  };

  // Definir opciones de menú por rol
  const getMenuPorRol = () => {
    const rolMenus = {
      ADMIN: [
        { id: "inicio", label: "Inicio", icon: "🏠" },
        { id: "analitica", label: "Analítica Médica", icon: "📈" },
        { id: "metricas", label: "Métricas", icon: "📊" },
        { id: "metricas_avanzadas", label: "Métricas Avanzadas", icon: "📉" },
        { id: "sedes", label: "Sedes Hospitalarias", icon: "🏥" },
        { id: "departamentos", label: "Departamentos", icon: "🏢" },
        { id: "empleados", label: "Gestionar Empleados", icon: "👥" },
        { id: "pacientes", label: "Pacientes", icon: "🩺" },
        { id: "citas", label: "Citas", icon: "📅" },
        { id: "medicamentos", label: "Medicamentos", icon: "💊" },
        { id: "equipamiento", label: "Equipamiento", icon: "🔧" },
        { id: "historias", label: "Historias Clínicas", icon: "📋" },
        { id: "prescripciones", label: "Prescripciones", icon: "📝" },
        { id: "auditoria", label: "Auditoría", icon: "🔍" },
      ],
      MEDICO: [
        { id: "inicio", label: "Inicio", icon: "🏠" },
        { id: "analitica", label: "Analítica Médica", icon: "📈" },
        { id: "metricas", label: "Reportes", icon: "📊" },
        { id: "metricas_avanzadas", label: "Métricas Avanzadas", icon: "📉" },
        { id: "pacientes", label: "Mis Pacientes", icon: "🩺" },
        { id: "citas", label: "Citas", icon: "📅" },
        { id: "historias", label: "Historias Clínicas", icon: "📋" },
        { id: "prescripciones", label: "Prescripciones", icon: "📝" },
      ],
      ENFERMERO: [
        { id: "inicio", label: "Inicio", icon: "🏠" },
        { id: "analitica", label: "Analítica Médica", icon: "📈" },
        { id: "pacientes", label: "Pacientes", icon: "🩺" },
        { id: "citas", label: "Citas", icon: "📅" },
        { id: "equipamiento", label: "Equipamiento", icon: "🔧" },
      ],
      ADM: [
        { id: "inicio", label: "Inicio", icon: "🏠" },
        { id: "analitica", label: "Analítica Médica", icon: "📈" },
        { id: "pacientes", label: "Pacientes", icon: "🩺" },
        { id: "citas", label: "Citas", icon: "📅" },
        { id: "equipamiento", label: "Equipamiento", icon: "🔧" },
      ],
    };
    return rolMenus[empleado?.rol] || [];
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Si NO está logueado, mostramos el formulario de login */}
      {!empleado && (
        <>
          <h1>HIS+ - Login</h1>
          
          {/* Mostrar formulario de registro o login */}
          {!mostrarRegistro ? (
            <>
              <form
                onSubmit={handleLogin}
                style={{
                  maxWidth: "400px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <label>
                  Correo:
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Contraseña:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </label>

                {loginError && (
                  <p style={{ color: "red" }}>Error de login: {loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                >
                  {loginLoading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>

              <p style={{ marginTop: "1rem" }}>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => setMostrarRegistro(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1976d2",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Registrate aquí
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Registrar Nuevo Empleado</h2>
              <form
                onSubmit={handleRegistro}
                style={{
                  maxWidth: "500px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <label>
                  Nombre Completo:
                  <input
                    type="text"
                    name="nom_emp"
                    value={formRegistro.nom_emp}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Correo:
                  <input
                    type="email"
                    name="correo"
                    value={formRegistro.correo}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Teléfono:
                  <input
                    type="tel"
                    name="tel_emp"
                    value={formRegistro.tel_emp}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Cargo:
                  <input
                    type="text"
                    name="cargo"
                    value={formRegistro.cargo}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Rol:
                  <select
                    name="rol"
                    value={formRegistro.rol}
                    onChange={handleRegistroChange}
                    style={inputStyle}
                  >
                    <option value="MEDICO">Médico</option>
                    <option value="ENFERMERO">Enfermero</option>
                    <option value="ADM">Personal Administrativo</option>
                  </select>
                </label>

                <label>
                  Departamento:
                  <select
                    name="depto_id"
                    value={formRegistro.depto_id}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  >
                    <option value="">Selecciona un departamento</option>
                    {departamentos.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nom_dept} - {dept.sede?.nom_sede}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Contraseña:
                  <input
                    type="password"
                    name="hash_contra"
                    value={formRegistro.hash_contra}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Confirmar Contraseña:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formRegistro.confirmPassword}
                    onChange={handleRegistroChange}
                    required
                    style={inputStyle}
                  />
                </label>

                {registroError && (
                  <p style={{ color: "red" }}>Error: {registroError}</p>
                )}

                {registroSuccess && (
                  <p style={{ color: "green" }}>{registroSuccess}</p>
                )}

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={registroLoading}
                    style={{
                      padding: "0.5rem 1rem",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      borderRadius: "4px",
                      flex: 1,
                    }}
                  >
                    {registroLoading ? "Registrando..." : "Registrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarRegistro(false)}
                    style={{
                      padding: "0.5rem 1rem",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: "#757575",
                      color: "#fff",
                      borderRadius: "4px",
                      flex: 1,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}

      {/* Si SÍ está logueado, mostramos el dashboard */}
      {empleado && (
        <div style={{ display: "flex", minHeight: "100vh", gap: "2rem" }}>
          {/* Sidebar de navegación */}
          <nav style={navbarStyle}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ color: "#fff", margin: "0 0 0.5rem 0" }}>HIS+</h2>
              <p style={{ color: "#ddd", margin: 0, fontSize: "0.9rem" }}>
                {empleado.nom_emp}
              </p>
              <p style={{ color: "#aaa", margin: "0.25rem 0 0 0", fontSize: "0.8rem" }}>
                {empleado.rol}
              </p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {getMenuPorRol().map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setPaginaActual(item.id)}
                    style={{
                      ...menuItemStyle,
                      backgroundColor:
                        paginaActual === item.id ? "#1565c0" : "transparent",
                    }}
                  >
                    <span style={{ marginRight: "0.5rem" }}>{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleLogout}
              style={{
                ...menuItemStyle,
                backgroundColor: "#d32f2f",
                marginTop: "auto",
                width: "100%",
              }}
            >
              🚪 Cerrar sesión
            </button>
          </nav>

          {/* Contenido principal */}
          <div style={{ flex: 1, paddingRight: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid #ddd",
              }}
            >
              <div>
                <h1 style={{ margin: "0 0 0.5rem 0" }}>Dashboard HIS+</h1>
                <p style={{ margin: 0, color: "#666" }}>
                  {empleado.depto?.sede?.nom_sede} - {empleado.depto?.nom_dept}
                </p>
              </div>
            </div>

            {/* Página de Inicio */}
            {paginaActual === "inicio" && (
              <div>
                <h2 style={{ marginBottom: "2rem" }}>
                  Bienvenido, {empleado.nom_emp}
                </h2>
                <div style={gridStyle}>
                  {getMenuPorRol()
                    .filter((item) => item.id !== "inicio")
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setPaginaActual(item.id)}
                        style={tarjetaStyle}
                      >
                        <div
                          style={{
                            fontSize: "3rem",
                            marginBottom: "1rem",
                            textAlign: "center",
                          }}
                        >
                          {item.icon}
                        </div>
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>{item.label}</h3>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                          Acceder a {item.label.toLowerCase()}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Matriz de Permisos */}
                <div style={{ marginTop: "3rem" }}>
                  <h3>Matriz de Permisos para {empleado.rol}</h3>
                  <p style={{ color: "#666", marginBottom: "1rem" }}>
                    Leyenda: C = Crear, R = Leer, U = Actualizar, D = Eliminar, - = Sin acceso
                  </p>
                  <table style={permisosTableStyle}>
                    <thead>
                      <tr style={{ backgroundColor: "#1565c0", color: "#fff" }}>
                        <th style={permisosTh}>Módulo</th>
                        <th style={permisosTh}>Permisos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(matrizPermisos[empleado.rol] || {}).map(
                        ([modulo, permisos], idx) => (
                          <tr
                            key={modulo}
                            style={{
                              backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                            }}
                          >
                            <td style={permisosTd}>{modulo}</td>
                            <td
                              style={{
                                ...permisosTd,
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                color:
                                  permisos === "-" ? "#999" : "#1565c0",
                              }}
                            >
                              {permisos}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Página de Métricas */}
            {paginaActual === "metricas" && (
              <div>
                <h2>Métricas: Medicamentos más recetados (último mes)</h2>

                {cargandoMetricas && <p>Cargando métricas...</p>}

                {errorMetricas && (
                  <p style={{ color: "red" }}>
                    Error al cargar métricas: {errorMetricas}
                  </p>
                )}

                {!cargandoMetricas && !errorMetricas && datos.length === 0 && (
                  <p>No hay datos de prescripciones en el último mes.</p>
                )}

                {!cargandoMetricas && !errorMetricas && datos.length > 0 && (
                  <>
                    <div style={{ maxWidth: "800px", marginTop: "2rem" }}>
                      <Bar data={chartData} options={chartOptions} />
                    </div>

                    <h3 style={{ marginTop: "2rem" }}>Detalle en tabla</h3>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Sede</th>
                          <th style={thStyle}>Medicamento</th>
                          <th style={thStyle}>Total prescripciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datos.map((item, idx) => (
                          <tr key={idx}>
                            <td style={tdStyle}>{item.sede}</td>
                            <td style={tdStyle}>{item.nom_med}</td>
                            <td style={tdStyle}>{item.total_prescripciones}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}

            {/* Página de Analítica Médica */}
            {paginaActual === "analitica" && (
              <div>
                <h2>Analítica Médica</h2>

                {cargandoAnalitica && <p>Cargando datos de analítica...</p>}

                {errorAnalitica && (
                  <p style={{ color: "red" }}>
                    Error al cargar analítica: {errorAnalitica}
                  </p>
                )}

                {!cargandoAnalitica && !errorAnalitica && analiticalData.resumen && (
                  <>
                    {/* Resumen General */}
                    <div style={{ 
                      backgroundColor: "#f5f5f5", 
                      padding: "1.5rem", 
                      borderRadius: "8px",
                      marginBottom: "2rem"
                    }}>
                      <h3>Resumen General (Último Mes)</h3>
                      <div style={gridStyle}>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1976d2" }}>
                            {analiticalData.resumen.resumen_mes.pacientes_atendidos}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            Pacientes Atendidos
                          </div>
                        </div>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#388e3c" }}>
                            {analiticalData.resumen.resumen_mes.total_prescripciones}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            Prescripciones Totales
                          </div>
                        </div>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f57c00" }}>
                            {analiticalData.resumen.resumen_mes.medicamento_top}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            Medicamento Top
                          </div>
                        </div>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7b1fa2" }}>
                            {analiticalData.resumen.resumen_mes.departamento_top}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            Depto. más Activo
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Equipamiento */}
                    <div style={{ marginBottom: "2rem" }}>
                      <h3>Estado del Equipamiento</h3>
                      <div style={gridStyle}>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#388e3c" }}>
                            {analiticalData.resumen.equipamiento.operativo}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            Operativo
                          </div>
                        </div>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ff9800" }}>
                            {analiticalData.resumen.equipamiento.en_mantenimiento}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            En Mantenimiento
                          </div>
                        </div>
                        <div style={tarjetaResumenStyle}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#d32f2f" }}>
                            {analiticalData.resumen.equipamiento.fuera_servicio}
                          </div>
                          <div style={{ color: "#666", marginTop: "0.5rem" }}>
                            Fuera de Servicio
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Frecuencia de Enfermedades */}
                    {analiticalData.frecuenciaEnfermedades.length > 0 && (
                      <div style={{ marginBottom: "2rem" }}>
                        <h3>Frecuencia de Enfermedades (Último Año)</h3>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>Diagnóstico</th>
                              <th style={thStyle}>Frecuencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analiticalData.frecuenciaEnfermedades.slice(0, 10).map((item, idx) => (
                              <tr key={idx}>
                                <td style={tdStyle}>{item.diagnostico}</td>
                                <td style={tdStyle}>{item.frecuencia}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Consumo de Medicamentos por Departamento */}
                    {analiticalData.consumoMedicamentos.length > 0 && (
                      <div style={{ marginBottom: "2rem" }}>
                        <h3>Consumo de Medicamentos por Departamento (Último Mes)</h3>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>Sede</th>
                              <th style={thStyle}>Departamento</th>
                              <th style={thStyle}>Medicamento</th>
                              <th style={thStyle}>Prescripciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analiticalData.consumoMedicamentos.slice(0, 15).map((item, idx) => (
                              <tr key={idx}>
                                <td style={tdStyle}>{item.sede}</td>
                                <td style={tdStyle}>{item.departamento}</td>
                                <td style={tdStyle}>{item.medicamento}</td>
                                <td style={tdStyle}>{item.cantidad_prescripciones}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Índices de Atención por Sede */}
                    {analiticalData.indicesAtencion.length > 0 && (
                      <div style={{ marginBottom: "2rem" }}>
                        <h3>Índices de Atención por Sede (Último Mes)</h3>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>Sede</th>
                              <th style={thStyle}>Total Citas</th>
                              <th style={thStyle}>Atendidas</th>
                              <th style={thStyle}>Pendientes</th>
                              <th style={thStyle}>Canceladas</th>
                              <th style={thStyle}>% Cumplimiento</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analiticalData.indicesAtencion.map((item, idx) => (
                              <tr key={idx}>
                                <td style={tdStyle}>{item.sede}</td>
                                <td style={tdStyle}>{item.total_citas}</td>
                                <td style={tdStyle}>{item.citas_atendidas}</td>
                                <td style={tdStyle}>{item.citas_pendientes}</td>
                                <td style={tdStyle}>{item.citas_canceladas}</td>
                                <td style={{...tdStyle, color: item.porcentaje_cumplimiento > 80 ? "#388e3c" : "#ff9800" }}>
                                  {item.porcentaje_cumplimiento}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Utilización de Equipamiento */}
                    {analiticalData.utilizacionEquipamiento.length > 0 && (
                      <div style={{ marginBottom: "2rem" }}>
                        <h3>Utilización de Equipamiento</h3>
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={thStyle}>Sede</th>
                              <th style={thStyle}>Departamento</th>
                              <th style={thStyle}>Estado</th>
                              <th style={thStyle}>Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analiticalData.utilizacionEquipamiento.map((item, idx) => (
                              <tr key={idx}>
                                <td style={tdStyle}>{item.sede}</td>
                                <td style={tdStyle}>{item.departamento}</td>
                                <td style={{...tdStyle, fontWeight: "bold", color: 
                                  item.estado === "OPERATIVO" ? "#388e3c" :
                                  item.estado === "EN_MANTENIMIENTO" ? "#ff9800" : "#d32f2f"
                                }}>
                                  {item.estado}
                                </td>
                                <td style={tdStyle}>{item.cantidad}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Página de Métricas Avanzadas */}
            {paginaActual === "metricas_avanzadas" && (
              <div style={{ padding: "2rem" }}>
                <h2>📊 Métricas Avanzadas del Sistema</h2>

                {cargandoMetricasAvanzadas && (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Cargando métricas avanzadas...</p>
                  </div>
                )}

                {errorMetricasAvanzadas && (
                  <div style={{
                    backgroundColor: "#ffebee",
                    border: "1px solid #ef5350",
                    color: "#c62828",
                    padding: "1rem",
                    borderRadius: "4px",
                    marginBottom: "2rem"
                  }}>
                    Error al cargar métricas: {errorMetricasAvanzadas}
                  </div>
                )}

                {!cargandoMetricasAvanzadas && !errorMetricasAvanzadas && (
                  <>
                    {/* 1. Médicos con más consultas */}
                    {medicosConsultas.length > 0 && (
                      <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <h3 style={{ color: "#1976d2", marginBottom: "1.5rem" }}>
                          👨‍⚕️ Médicos con Mayor Número de Consultas (Última Semana)
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                          <div>
                            {medicosConsultas.length > 0 && (
                              <Bar
                                data={{
                                  labels: medicosConsultas.map(m => m.nombre_medico),
                                  datasets: [{
                                    label: "Total de Consultas",
                                    data: medicosConsultas.map(m => m.total_consultas),
                                    backgroundColor: [
                                      "#1976d2", "#388e3c", "#f57c00", "#7b1fa2",
                                      "#c62828", "#00897b", "#6f5c00", "#283593"
                                    ],
                                    borderRadius: 8,
                                    borderSkipped: false,
                                  }]
                                }}
                                options={{
                                  indexAxis: "y",
                                  responsive: true,
                                  plugins: {
                                    legend: { display: false },
                                  },
                                  scales: {
                                    x: { beginAtZero: true }
                                  }
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <table style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              backgroundColor: "white"
                            }}>
                              <thead>
                                <tr style={{ backgroundColor: "#1976d2", color: "white" }}>
                                  <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #1976d2" }}>
                                    Médico
                                  </th>
                                  <th style={{ padding: "0.75rem", textAlign: "right", borderBottom: "2px solid #1976d2" }}>
                                    Consultas
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {medicosConsultas.map((item, idx) => (
                                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #ddd" }}>
                                      {item.nombre_medico}
                                    </td>
                                    <td style={{
                                      padding: "0.75rem",
                                      textAlign: "right",
                                      borderBottom: "1px solid #ddd",
                                      fontWeight: "bold",
                                      color: "#1976d2"
                                    }}>
                                      {item.total_consultas}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Tiempo promedio cita - diagnóstico */}
                    {tiempoPromedio && (
                      <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <h3 style={{ color: "#388e3c", marginBottom: "1.5rem" }}>
                          ⏱️ Tiempo Promedio: Cita → Diagnóstico
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                          <div style={{
                            backgroundColor: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "3px solid #388e3c"
                          }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#388e3c" }}>
                              {tiempoPromedio.tiempo_promedio_horas}h
                            </div>
                            <div style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                              Horas Promedio
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "3px solid #1976d2"
                          }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1976d2" }}>
                              {tiempoPromedio.tiempo_promedio_dias}d
                            </div>
                            <div style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                              Días Promedio
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "3px solid #f57c00"
                          }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f57c00" }}>
                              {tiempoPromedio.total_historias_analizadas}
                            </div>
                            <div style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                              Historias Analizadas
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Auditoría de Historias Clínicas */}
                    {auditoriaHistorias.length > 0 && (
                      <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <h3 style={{ color: "#d32f2f", marginBottom: "1.5rem" }}>
                          🔍 Últimos 10 Accesos a Historias Clínicas
                        </h3>
                        <table style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          backgroundColor: "white"
                        }}>
                          <thead>
                            <tr style={{ backgroundColor: "#d32f2f", color: "white" }}>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #d32f2f" }}>
                                Fecha/Hora
                              </th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #d32f2f" }}>
                                Acción
                              </th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #d32f2f" }}>
                                Empleado
                              </th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #d32f2f" }}>
                                Rol
                              </th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #d32f2f" }}>
                                IP Origen
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditoriaHistorias.map((item, idx) => (
                              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                                <td style={{ padding: "0.75rem", borderBottom: "1px solid #ddd", fontSize: "0.85rem" }}>
                                  {new Date(item.fecha_evento).toLocaleString()}
                                </td>
                                <td style={{
                                  padding: "0.75rem",
                                  borderBottom: "1px solid #ddd",
                                  fontWeight: "bold",
                                  color: item.accion === "CREATE" ? "#4caf50" : item.accion === "UPDATE" ? "#ff9800" : "#d32f2f"
                                }}>
                                  {item.accion}
                                </td>
                                <td style={{ padding: "0.75rem", borderBottom: "1px solid #ddd" }}>
                                  {item.empleado}
                                </td>
                                <td style={{
                                  padding: "0.75rem",
                                  borderBottom: "1px solid #ddd",
                                  fontWeight: "bold",
                                  color: "#1976d2"
                                }}>
                                  {item.rol}
                                </td>
                                <td style={{ padding: "0.75rem", borderBottom: "1px solid #ddd", fontSize: "0.85rem", fontFamily: "monospace" }}>
                                  {item.ip_origen}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 4. Departamentos que comparten equipamiento */}
                    {Object.keys(departamentosCompartidos).length > 0 && (
                      <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <h3 style={{ color: "#7b1fa2", marginBottom: "1.5rem" }}>
                          🔗 Equipamiento Compartido Entre Sedes
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                          {Object.entries(departamentosCompartidos).map(([tipo, equipos], idx) => (
                            <div key={tipo} style={{
                              backgroundColor: "white",
                              padding: "1.5rem",
                              borderRadius: "8px",
                              border: "2px solid #7b1fa2"
                            }}>
                              <h4 style={{ color: "#7b1fa2", marginBottom: "1rem", marginTop: 0 }}>
                                {tipo}
                              </h4>
                              <ul style={{ marginLeft: "1.5rem", color: "#333" }}>
                                {equipos.map((equipo, i) => (
                                  <li key={i} style={{ marginBottom: "0.5rem" }}>
                                    <strong>{equipo.depto_nombre}</strong> ({equipo.sede_nombre})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Pacientes por enfermedad y sede */}
                    {pacientesEnfermedad.length > 0 && (
                      <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <h3 style={{ color: "#00897b", marginBottom: "1.5rem" }}>
                          🏥 Pacientes Atendidos por Enfermedad y Sede
                        </h3>
                        <table style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          backgroundColor: "white"
                        }}>
                          <thead>
                            <tr style={{ backgroundColor: "#00897b", color: "white" }}>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #00897b" }}>
                                Enfermedad/Diagnóstico
                              </th>
                              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #00897b" }}>
                                Sede
                              </th>
                              <th style={{ padding: "0.75rem", textAlign: "center", borderBottom: "2px solid #00897b" }}>
                                Total Pacientes
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pacientesEnfermedad.slice(0, 15).map((item, idx) => (
                              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                                <td style={{ padding: "0.75rem", borderBottom: "1px solid #ddd" }}>
                                  {item.enfermedad}
                                </td>
                                <td style={{ padding: "0.75rem", borderBottom: "1px solid #ddd" }}>
                                  {item.sede}
                                </td>
                                <td style={{
                                  padding: "0.75rem",
                                  borderBottom: "1px solid #ddd",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: "#00897b",
                                  fontSize: "1.1rem"
                                }}>
                                  {item.total_pacientes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 6. Historias clínicas replicadas */}
                    {historiasReplicadas.length > 0 && (
                      <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        <h3 style={{ color: "#6f5c00", marginBottom: "1.5rem" }}>
                          📋 Historias Clínicas Replicadas Entre Sedes
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                          {historiasReplicadas.map((paciente, idx) => (
                            <div key={idx} style={{
                              backgroundColor: "white",
                              padding: "1.5rem",
                              borderRadius: "8px",
                              border: "2px solid #6f5c00",
                              marginBottom: "1rem"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h4 style={{ margin: 0, color: "#333" }}>
                                  {paciente.nombre_paciente}
                                </h4>
                                <div style={{
                                  display: "inline-block",
                                  backgroundColor: "#6f5c00",
                                  color: "white",
                                  padding: "0.5rem 1rem",
                                  borderRadius: "4px",
                                  fontWeight: "bold"
                                }}>
                                  {paciente.total_sedes} sedes • {paciente.total_historias} registros
                                </div>
                              </div>
                              <div style={{ marginLeft: "1rem" }}>
                                {paciente.historias_por_sede.map((historia, i) => (
                                  <div key={i} style={{
                                    backgroundColor: "#f9f9f9",
                                    padding: "0.75rem",
                                    marginBottom: "0.5rem",
                                    borderLeft: "4px solid #6f5c00",
                                    borderRadius: "4px"
                                  }}>
                                    <strong style={{ color: "#6f5c00" }}>
                                      {historia.sede_nombre}
                                    </strong>
                                    <div style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                                      <span>📅 {new Date(historia.fecha_registro).toLocaleDateString()} • </span>
                                      <span>🔬 {historia.diagnostico}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {historiasReplicadas.length === 0 && medicosConsultas.length === 0 && (
                      <div style={{
                        textAlign: "center",
                        padding: "2rem",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        color: "#999"
                      }}>
                        <p>No hay datos disponibles en este momento.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Página de Pacientes */}
            {paginaActual === "pacientes" && (
              <PacientesPage empleado={empleado} />
            )}

            {/* Página de Citas */}
            {paginaActual === "citas" && (
              <CitasPage empleado={empleado} />
            )}

            {/* Página de Medicamentos */}
            {paginaActual === "medicamentos" && (
              <MedicamentosPage empleado={empleado} />
            )}

            {/* Página de Sedes */}
            {paginaActual === "sedes" && empleado.rol === "ADMIN" && (
              <SedesHospitaliariasPage empleado={empleado} />
            )}

            {/* Página de Departamentos */}
            {paginaActual === "departamentos" && empleado.rol === "ADMIN" && (
              <DepartamentosPage empleado={empleado} />
            )}

            {/* Página de Empleados */}
            {paginaActual === "empleados" && empleado.rol === "ADMIN" && (
              <EmpleadosPage empleado={empleado} />
            )}

            {/* Página de Historias Clínicas */}
            {paginaActual === "historias" && (["ADMIN", "MEDICO", "ENFERMERO"].includes(empleado.rol)) && (
              <HistoriaClinicaPage empleado={empleado} />
            )}

            {/* Página de Prescripciones */}
            {paginaActual === "prescripciones" && (["ADMIN", "MEDICO"].includes(empleado.rol)) && (
              <PrescripcionesPage empleado={empleado} />
            )}

            {/* Página de Equipamiento */}
            {paginaActual === "equipamiento" && (["ADMIN", "ENFERMERO", "ADM"].includes(empleado.rol)) && (
              <EquipamientoPage empleado={empleado} />
            )}

            {/* Página de Auditoría (Solo Admin) */}
            {paginaActual === "auditoria" && empleado.rol === "ADMIN" && (
              <AuditoriaPage empleado={empleado} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  backgroundColor: "#f5f5f5",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.4rem",
  marginTop: "0.25rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const navbarStyle = {
  width: "250px",
  backgroundColor: "#1565c0",
  color: "#fff",
  padding: "1.5rem 1rem",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const menuItemStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "none",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "1rem",
  borderRadius: "4px",
  marginBottom: "0.5rem",
  transition: "background-color 0.3s",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginTop: "2rem",
};

const tarjetaStyle = {
  padding: "2rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  ":hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
};

const tarjetaResumenStyle = {
  padding: "1.5rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  marginTop: "1rem",
};

const permisosTableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  marginTop: "1rem",
  border: "1px solid #ddd",
};

const permisosTh = {
  padding: "0.75rem",
  textAlign: "left",
  borderBottom: "2px solid #1565c0",
};

const permisosTd = {
  padding: "0.75rem",
  borderBottom: "1px solid #ddd",
};

export default App; 

