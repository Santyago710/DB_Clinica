import React, { useState, useEffect } from "react";
import { fetchData, createData, updateData, deleteData, TableCRUD } from "./CRUDUtils";
import { API_BASE } from "./apiConfig";


// ==================== PACIENTES ====================
export const PacientesPage = ({ empleado }) => {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_pac: "",
    fecha_nac: "",
    genero: "",
    dir_pac: "",
    tel_pac: "",
    tipo_doc: "CC",
    num_doc: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    setCargando(true);
    try {
      const data = await fetchData(`${API_BASE}/pacientes/`, headers);
      setPacientes(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await updateData(`${API_BASE}/pacientes/${editandoId}/`, formData, headers);
      } else {
        await createData(`${API_BASE}/pacientes/`, formData, headers);
      }
      cargarPacientes();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/pacientes/${id}/`, headers);
      cargarPacientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (paciente) => {
    setFormData(paciente);
    setEditandoId(paciente.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom_pac: "",
      fecha_nac: "",
      genero: "",
      dir_pac: "",
      tel_pac: "",
      tipo_doc: "CC",
      num_doc: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "nom_pac", label: "Nombre" },
    { key: "num_doc", label: "Documento" },
    { key: "tel_pac", label: "Teléfono" },
    { key: "genero", label: "Género" },
  ];

  return (
    <div>
      <h2>Gestión de Pacientes</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        style={btnPrimaryStyle}
      >
        {mostrarForm ? "Cancelar" : "Nuevo Paciente"}
      </button>

      {mostrarForm && (
        <form onSubmit={handleGuardar} style={formStyle}>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nom_pac}
            onChange={(e) =>
              setFormData({ ...formData, nom_pac: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="date"
            value={formData.fecha_nac}
            onChange={(e) =>
              setFormData({ ...formData, fecha_nac: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Género"
            value={formData.genero}
            onChange={(e) =>
              setFormData({ ...formData, genero: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formData.dir_pac}
            onChange={(e) =>
              setFormData({ ...formData, dir_pac: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.tel_pac}
            onChange={(e) =>
              setFormData({ ...formData, tel_pac: e.target.value })
            }
            required
            style={inputStyle}
          />
          <select
            value={formData.tipo_doc}
            onChange={(e) =>
              setFormData({ ...formData, tipo_doc: e.target.value })
            }
            style={inputStyle}
          >
            <option value="CC">Cédula de ciudadanía</option>
            <option value="TI">Tarjeta de identidad</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="PP">Pasaporte</option>
          </select>
          <input
            type="text"
            placeholder="Número de documento"
            value={formData.num_doc}
            onChange={(e) =>
              setFormData({ ...formData, num_doc: e.target.value })
            }
            required
            style={inputStyle}
          />
          <button type="submit" style={btnPrimaryStyle}>
            {editandoId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <TableCRUD
        datos={pacientes}
        columnas={columnas}
        titulo="Pacientes"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={true}
        puedeEliminar={empleado.rol === "ADMIN"}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== CITAS ====================
export const CitasPage = ({ empleado }) => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [formData, setFormData] = useState({
    paciente_id: "",
    empleado_id: empleado.id,
    depto_id: "",
    fecha: "",
    hora: "",
    tipo_servicio: "",
    estado: "PENDIENTE",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [citasData, pacientesData, deptosData] = await Promise.all([
        fetchData(`${API_BASE}/citas/`, headers),
        fetchData(`${API_BASE}/pacientes/`, headers),
        fetchData(`${API_BASE}/departamentos/`, headers),
      ]);
      setCitas(citasData.results || citasData);
      setPacientes(pacientesData.results || pacientesData);
      setDepartamentos(deptosData.results || deptosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén completos
    if (!formData.paciente_id || !formData.depto_id || !formData.fecha || !formData.hora || !formData.tipo_servicio) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      if (editandoId) {
        await updateData(`${API_BASE}/citas/${editandoId}/`, formData, headers);
      } else {
        await createData(`${API_BASE}/citas/`, formData, headers);
      }
      cargarDatos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/citas/${id}/`, headers);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (cita) => {
    setFormData({
      paciente_id: cita.paciente.id,
      empleado_id: cita.empleado.id,
      depto_id: cita.depto.id,
      fecha: cita.fecha,
      hora: cita.hora,
      tipo_servicio: cita.tipo_servicio,
      estado: cita.estado,
    });
    setEditandoId(cita.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      paciente_id: "",
      empleado_id: empleado.id,
      depto_id: "",
      fecha: "",
      hora: "",
      tipo_servicio: "",
      estado: "PENDIENTE",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "paciente", label: "Paciente", render: (item) => item.paciente?.nom_pac },
    { key: "fecha", label: "Fecha" },
    { key: "hora", label: "Hora" },
    { key: "estado", label: "Estado" },
    { key: "tipo_servicio", label: "Servicio" },
  ];

  return (
    <div>
      <h2>Gestión de Citas</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        style={btnPrimaryStyle}
      >
        {mostrarForm ? "Cancelar" : "Nueva Cita"}
      </button>

      {mostrarForm && (
        <form onSubmit={handleGuardar} style={formStyle}>
          <select
            value={formData.paciente_id}
            onChange={(e) =>
              setFormData({ ...formData, paciente_id: e.target.value })
            }
            required
            style={inputStyle}
          >
            <option value="">Seleccionar Paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom_pac}
              </option>
            ))}
          </select>
          <select
            value={formData.depto_id}
            onChange={(e) =>
              setFormData({ ...formData, depto_id: e.target.value })
            }
            required
            style={inputStyle}
          >
            <option value="">Seleccionar Departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nom_dept} - {d.sede?.nom_sede}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) =>
              setFormData({ ...formData, fecha: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="time"
            value={formData.hora}
            onChange={(e) =>
              setFormData({ ...formData, hora: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Tipo de Servicio"
            value={formData.tipo_servicio}
            onChange={(e) =>
              setFormData({ ...formData, tipo_servicio: e.target.value })
            }
            required
            style={inputStyle}
          />
          <select
            value={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.value })
            }
            style={inputStyle}
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="ATENDIDA">Atendida</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <button type="submit" style={btnPrimaryStyle}>
            {editandoId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <TableCRUD
        datos={citas}
        columnas={columnas}
        titulo="Citas"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={true}
        puedeEliminar={empleado.rol === "ADMIN" || empleado.rol === "ADM"}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== MEDICAMENTOS ====================
export const MedicamentosPage = ({ empleado }) => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_med: "",
    descripcion: "",
    stock: "",
    unidad: "",
    proveedor: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    setCargando(true);
    try {
      const data = await fetchData(`${API_BASE}/medicamentos/`, headers);
      setMedicamentos(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, stock: parseInt(formData.stock) };
      if (editandoId) {
        await updateData(
          `${API_BASE}/medicamentos/${editandoId}/`,
          dataToSend,
          headers
        );
      } else {
        await createData(`${API_BASE}/medicamentos/`, dataToSend, headers);
      }
      cargarMedicamentos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/medicamentos/${id}/`, headers);
      cargarMedicamentos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (medicamento) => {
    setFormData(medicamento);
    setEditandoId(medicamento.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom_med: "",
      descripcion: "",
      stock: "",
      unidad: "",
      proveedor: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "nom_med", label: "Medicamento" },
    { key: "stock", label: "Stock" },
    { key: "unidad", label: "Unidad" },
    { key: "proveedor", label: "Proveedor" },
  ];

  return (
    <div>
      <h2>Gestión de Medicamentos</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {empleado.rol === "ADMIN" && (
        <>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={btnPrimaryStyle}
          >
            {mostrarForm ? "Cancelar" : "Nuevo Medicamento"}
          </button>

          {mostrarForm && (
            <form onSubmit={handleGuardar} style={formStyle}>
              <input
                type="text"
                placeholder="Nombre del medicamento"
                value={formData.nom_med}
                onChange={(e) =>
                  setFormData({ ...formData, nom_med: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Unidad"
                value={formData.unidad}
                onChange={(e) =>
                  setFormData({ ...formData, unidad: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Proveedor"
                value={formData.proveedor}
                onChange={(e) =>
                  setFormData({ ...formData, proveedor: e.target.value })
                }
                required
                style={inputStyle}
              />
              <button type="submit" style={btnPrimaryStyle}>
                {editandoId ? "Actualizar" : "Crear"}
              </button>
            </form>
          )}
        </>
      )}

      <TableCRUD
        datos={medicamentos}
        columnas={columnas}
        titulo="Medicamentos"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={empleado.rol === "ADMIN"}
        puedeEliminar={empleado.rol === "ADMIN"}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// Estilos reutilizables
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginBottom: "2rem",
  padding: "1rem",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  border: "1px solid #ddd",
};

const inputStyle = {
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
  fontFamily: "Arial",
};

const btnPrimaryStyle = {
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#1976d2",
  color: "#fff",
  cursor: "pointer",
  fontSize: "1rem",
  marginBottom: "1rem",
};
