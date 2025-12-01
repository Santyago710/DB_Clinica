import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  // Estado de autenticación
  const [empleado, setEmpleado] = useState(null);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Estado de métricas
  const [datos, setDatos] = useState([]);
  const [cargandoMetricas, setCargandoMetricas] = useState(false);
  const [errorMetricas, setErrorMetricas] = useState(null);

  // Handler de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const resp = await fetch("http://localhost:8000/api/auth/login/", {
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

  // Cuando haya empleado logueado, cargamos las métricas
  useEffect(() => {
    if (!empleado) {
      return;
    }

    const fetchMetricas = async () => {
      setCargandoMetricas(true);
      setErrorMetricas(null);

      try {
        const resp = await fetch(
          "http://localhost:8000/api/metricas/medicamentos-mas-recetados/",
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
  }, [empleado]);


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
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Si NO está logueado, mostramos el formulario de login */}
      {!empleado && (
        <>
          <h1>HIS+ - Login</h1>
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
        </>
      )}

      {/* Si SÍ está logueado, mostramos el dashboard */}
      {empleado && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h1>Dashboard HIS+</h1>
              <p>
                Sesión iniciada como: <strong>{empleado.nom_emp}</strong> (
                {empleado.rol}) - {empleado.depto?.nom_dept} /{" "}
                {empleado.depto?.sede?.nom_sede}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#d32f2f",
                color: "#fff",
                borderRadius: "4px",
                height: "fit-content",
              }}
            >
              Cerrar sesión
            </button>
          </div>

          <h2>Métrica: Medicamentos más recetados (último mes)</h2>

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
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
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
        </>
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
};

export default App;
