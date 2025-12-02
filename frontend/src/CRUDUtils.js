// Utilidades para operaciones CRUD

export const fetchData = async (url, headers = {}) => {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createData = async (url, data, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateData = async (url, data, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (url, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`Error ${response.status}`);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

// Componente de tabla CRUD reutilizable
export const TableCRUD = ({
  datos,
  columnas,
  titulo,
  onEditar,
  onEliminar,
  puedeEditar = true,
  puedeEliminar = true,
  cargando = false,
  error = null,
}) => {
  if (cargando) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (datos.length === 0) return <p>No hay datos disponibles.</p>;

  return (
    <div>
      <h3>{titulo}</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columnas.map((col) => (
                <th key={col.key} style={thStyle}>
                  {col.label}
                </th>
              ))}
              {(puedeEditar || puedeEliminar) && (
                <th style={thStyle}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id}>
                {columnas.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                {(puedeEditar || puedeEliminar) && (
                  <td style={tdStyle}>
                    {puedeEditar && (
                      <button
                        onClick={() => onEditar(item)}
                        style={btnEditarStyle}
                      >
                        Editar
                      </button>
                    )}
                    {puedeEliminar && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Está seguro de que desea eliminar este registro?"
                            )
                          ) {
                            onEliminar(item.id);
                          }
                        }}
                        style={btnEliminarStyle}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  marginTop: "1rem",
  border: "1px solid #ddd",
};

const thStyle = {
  padding: "0.75rem",
  textAlign: "left",
  borderBottom: "2px solid #1565c0",
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "0.75rem",
  borderBottom: "1px solid #ddd",
};

const btnEditarStyle = {
  padding: "0.4rem 0.8rem",
  marginRight: "0.5rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#1976d2",
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const btnEliminarStyle = {
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.85rem",
};
