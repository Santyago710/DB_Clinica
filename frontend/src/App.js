import { useEffect, useState } from "react";

function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resp = await fetch(
          "http://localhost:8000/api/metricas/medicamentos-mas-recetados/"
        );
        if (!resp.ok) {
          throw new Error(`Error HTTP: ${resp.status}`);
        }
        const data = await resp.json();
        setDatos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard HIS+ - Medicamentos más recetados (último mes)</h1>

      {cargando && <p>Cargando datos...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error al cargar datos: {error}
        </p>
      )}

      {!cargando && !error && datos.length === 0 && (
        <p>No hay datos de prescripciones en el último mes.</p>
      )}

      {!cargando && !error && datos.length > 0 && (
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

export default App;
