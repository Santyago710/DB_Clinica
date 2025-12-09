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

// ==================== SEDES HOSPITALARIAS ====================
export const SedesHospitaliariasPage = ({ empleado }) => {
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_sede: "",
    ciudad: "",
    direccion: "",
    telefono: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarSedes();
  }, []);

  const cargarSedes = async () => {
    setCargando(true);
    try {
      const data = await fetchData(`${API_BASE}/sedes/`, headers);
      setSedes(data.results || data);
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
        await updateData(`${API_BASE}/sedes/${editandoId}/`, formData, headers);
      } else {
        await createData(`${API_BASE}/sedes/`, formData, headers);
      }
      cargarSedes();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/sedes/${id}/`, headers);
      cargarSedes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (sede) => {
    setFormData(sede);
    setEditandoId(sede.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom_sede: "",
      ciudad: "",
      direccion: "",
      telefono: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "nom_sede", label: "Nombre" },
    { key: "ciudad", label: "Ciudad" },
    { key: "direccion", label: "Dirección" },
    { key: "telefono", label: "Teléfono" },
  ];

  const puedeEditar = empleado.rol === "ADMIN";
  const puedeEliminar = empleado.rol === "ADMIN";

  return (
    <div>
      <h2>Gestión de Sedes Hospitalarias</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {puedeEditar && (
        <>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={btnPrimaryStyle}
          >
            {mostrarForm ? "Cancelar" : "Nueva Sede"}
          </button>

          {mostrarForm && (
            <form onSubmit={handleGuardar} style={formStyle}>
              <input
                type="text"
                placeholder="Nombre de la sede"
                value={formData.nom_sede}
                onChange={(e) =>
                  setFormData({ ...formData, nom_sede: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={(e) =>
                  setFormData({ ...formData, ciudad: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
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
        datos={sedes}
        columnas={columnas}
        titulo="Sedes Hospitalarias"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== DEPARTAMENTOS ====================
export const DepartamentosPage = ({ empleado }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_dept: "",
    sede_id: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [deptosData, sedesData] = await Promise.all([
        fetchData(`${API_BASE}/departamentos/`, headers),
        fetchData(`${API_BASE}/sedes/`, headers),
      ]);
      setDepartamentos(deptosData.results || deptosData);
      setSedes(sedesData.results || sedesData);
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
        await updateData(
          `${API_BASE}/departamentos/${editandoId}/`,
          formData,
          headers
        );
      } else {
        await createData(`${API_BASE}/departamentos/`, formData, headers);
      }
      cargarDatos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/departamentos/${id}/`, headers);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (depto) => {
    setFormData({
      nom_dept: depto.nom_dept,
      sede_id: depto.sede?.id,
    });
    setEditandoId(depto.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom_dept: "",
      sede_id: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "nom_dept", label: "Departamento" },
    {
      key: "sede",
      label: "Sede",
      render: (item) => item.sede?.nom_sede,
    },
  ];

  const puedeEditar = empleado.rol === "ADMIN";
  const puedeEliminar = empleado.rol === "ADMIN";

  return (
    <div>
      <h2>Gestión de Departamentos</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {puedeEditar && (
        <>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={btnPrimaryStyle}
          >
            {mostrarForm ? "Cancelar" : "Nuevo Departamento"}
          </button>

          {mostrarForm && (
            <form onSubmit={handleGuardar} style={formStyle}>
              <input
                type="text"
                placeholder="Nombre del departamento"
                value={formData.nom_dept}
                onChange={(e) =>
                  setFormData({ ...formData, nom_dept: e.target.value })
                }
                required
                style={inputStyle}
              />
              <select
                value={formData.sede_id}
                onChange={(e) =>
                  setFormData({ ...formData, sede_id: e.target.value })
                }
                required
                style={inputStyle}
              >
                <option value="">Seleccionar Sede</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom_sede}
                  </option>
                ))}
              </select>
              <button type="submit" style={btnPrimaryStyle}>
                {editandoId ? "Actualizar" : "Crear"}
              </button>
            </form>
          )}
        </>
      )}

      <TableCRUD
        datos={departamentos}
        columnas={columnas}
        titulo="Departamentos"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== EMPLEADOS ====================
export const EmpleadosPage = ({ empleado }) => {
  const [empleados, setEmpleados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_emp: "",
    correo: "",
    tel_emp: "",
    cargo: "",
    rol: "ENFERMERO",
    depto_id: "",
    hash_contra: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [empsData, deptosData] = await Promise.all([
        fetchData(`${API_BASE}/empleados/`, headers),
        fetchData(`${API_BASE}/departamentos/`, headers),
      ]);
      setEmpleados(empsData.results || empsData);
      setDepartamentos(deptosData.results || deptosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (editandoId) {
        await updateData(
          `${API_BASE}/empleados/${editandoId}/`,
          dataToSend,
          headers
        );
      } else {
        await createData(`${API_BASE}/empleados/`, dataToSend, headers);
      }
      cargarDatos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/empleados/${id}/`, headers);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (emp) => {
    setFormData({
      nom_emp: emp.nom_emp,
      correo: emp.correo,
      tel_emp: emp.tel_emp,
      cargo: emp.cargo,
      rol: emp.rol,
      depto_id: emp.depto?.id,
      hash_contra: "",
    });
    setEditandoId(emp.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom_emp: "",
      correo: "",
      tel_emp: "",
      cargo: "",
      rol: "ENFERMERO",
      depto_id: "",
      hash_contra: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "nom_emp", label: "Nombre" },
    { key: "correo", label: "Correo" },
    { key: "cargo", label: "Cargo" },
    { key: "rol", label: "Rol" },
    {
      key: "depto",
      label: "Departamento",
      render: (item) => item.depto?.nom_dept,
    },
  ];

  const puedeEditar = empleado.rol === "ADMIN";
  const puedeEliminar = empleado.rol === "ADMIN";

  return (
    <div>
      <h2>Gestión de Empleados</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {puedeEditar && (
        <>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={btnPrimaryStyle}
          >
            {mostrarForm ? "Cancelar" : "Nuevo Empleado"}
          </button>

          {mostrarForm && (
            <form onSubmit={handleGuardar} style={formStyle}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nom_emp}
                onChange={(e) =>
                  setFormData({ ...formData, nom_emp: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.tel_emp}
                onChange={(e) =>
                  setFormData({ ...formData, tel_emp: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Cargo"
                value={formData.cargo}
                onChange={(e) =>
                  setFormData({ ...formData, cargo: e.target.value })
                }
                required
                style={inputStyle}
              />
              <select
                value={formData.rol}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value })
                }
                style={inputStyle}
              >
                <option value="ENFERMERO">Enfermero</option>
                <option value="MEDICO">Médico</option>
                <option value="ADM">Personal Administrativo</option>
                <option value="ADMIN">Administrador</option>
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
              {!editandoId && (
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={formData.hash_contra}
                  onChange={(e) =>
                    setFormData({ ...formData, hash_contra: e.target.value })
                  }
                  required={!editandoId}
                  style={inputStyle}
                />
              )}
              <button type="submit" style={btnPrimaryStyle}>
                {editandoId ? "Actualizar" : "Crear"}
              </button>
            </form>
          )}
        </>
      )}

      <TableCRUD
        datos={empleados}
        columnas={columnas}
        titulo="Empleados"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== EQUIPAMIENTO ====================
export const EquipamientoPage = ({ empleado }) => {
  const [equipos, setEquipos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nom_eq: "",
    depto_id: "",
    estado: "OPERATIVO",
    fecha_mantenimiento: "",
    responsable_id: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [equipsData, deptosData, empsData] = await Promise.all([
        fetchData(`${API_BASE}/equipamiento/`, headers),
        fetchData(`${API_BASE}/departamentos/`, headers),
        fetchData(`${API_BASE}/empleados/`, headers),
      ]);
      setEquipos(equipsData.results || equipsData);
      setDepartamentos(deptosData.results || deptosData);
      setEmpleados(empsData.results || empsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        responsable_id: formData.responsable_id || null,
      };
      if (editandoId) {
        await updateData(
          `${API_BASE}/equipamiento/${editandoId}/`,
          dataToSend,
          headers
        );
      } else {
        await createData(`${API_BASE}/equipamiento/`, dataToSend, headers);
      }
      cargarDatos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/equipamiento/${id}/`, headers);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (equipo) => {
    setFormData({
      nom_eq: equipo.nom_eq,
      depto_id: equipo.depto?.id,
      estado: equipo.estado,
      fecha_mantenimiento: equipo.fecha_mantenimiento,
      responsable_id: equipo.responsable?.id || "",
    });
    setEditandoId(equipo.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom_eq: "",
      depto_id: "",
      estado: "OPERATIVO",
      fecha_mantenimiento: "",
      responsable_id: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    { key: "nom_eq", label: "Equipo" },
    {
      key: "depto",
      label: "Departamento",
      render: (item) => item.depto?.nom_dept,
    },
    { key: "estado", label: "Estado" },
    {
      key: "responsable",
      label: "Responsable",
      render: (item) => item.responsable?.nom_emp || "Sin asignar",
    },
  ];

  const puedeEditar =
    empleado.rol === "ADMIN" ||
    empleado.rol === "ENFERMERO" ||
    empleado.rol === "ADM";
  const puedeEliminar = empleado.rol === "ADMIN" || empleado.rol === "ADM";

  return (
    <div>
      <h2>Gestión de Equipamiento</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {puedeEditar && (
        <>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={btnPrimaryStyle}
          >
            {mostrarForm ? "Cancelar" : "Nuevo Equipo"}
          </button>

          {mostrarForm && (
            <form onSubmit={handleGuardar} style={formStyle}>
              <input
                type="text"
                placeholder="Nombre del equipo"
                value={formData.nom_eq}
                onChange={(e) =>
                  setFormData({ ...formData, nom_eq: e.target.value })
                }
                required
                style={inputStyle}
              />
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
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                style={inputStyle}
              >
                <option value="OPERATIVO">Operativo</option>
                <option value="EN_MANTENIMIENTO">En mantenimiento</option>
                <option value="FUERA_SERVICIO">Fuera de servicio</option>
              </select>
              <input
                type="date"
                value={formData.fecha_mantenimiento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fecha_mantenimiento: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <select
                value={formData.responsable_id}
                onChange={(e) =>
                  setFormData({ ...formData, responsable_id: e.target.value })
                }
                style={inputStyle}
              >
                <option value="">Sin responsable</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom_emp}
                  </option>
                ))}
              </select>
              <button type="submit" style={btnPrimaryStyle}>
                {editandoId ? "Actualizar" : "Crear"}
              </button>
            </form>
          )}
        </>
      )}

      <TableCRUD
        datos={equipos}
        columnas={columnas}
        titulo="Equipamiento"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== HISTORIA CLINICA ====================
export const HistoriaClinicaPage = ({ empleado }) => {
  const [historias, setHistorias] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: "",
    empleado_id: empleado.id,
    sede_id: "",
    fecha_registro: new Date().toISOString().split("T")[0],
    diagnostico: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  // Determinar permisos basado en rol
  const puedeCrear = ["ADMIN", "MEDICO"].includes(empleado.rol);
  const puedeEditar = ["ADMIN", "MEDICO"].includes(empleado.rol);
  const puedeEliminar = false; // Nunca puede eliminar historia clínica
  const puedeLeer = ["ADMIN", "MEDICO", "ENFERMERO"].includes(empleado.rol);

  useEffect(() => {
    if (puedeLeer) {
      cargarDatos();
    }
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [historiasData, pacientesData, sedesData] = await Promise.all([
        fetchData(`${API_BASE}/historias-clinicas/`, headers),
        fetchData(`${API_BASE}/pacientes/`, headers),
        fetchData(`${API_BASE}/sedes/`, headers),
      ]);
      setHistorias(historiasData.results || historiasData);
      setPacientes(pacientesData.results || pacientesData);
      setSedes(sedesData.results || sedesData);
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
        await updateData(
          `${API_BASE}/historias-clinicas/${editandoId}/`,
          formData,
          headers
        );
      } else {
        await createData(`${API_BASE}/historias-clinicas/`, formData, headers);
      }
      cargarDatos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/historias-clinicas/${id}/`, headers);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (historia) => {
    setFormData({
      paciente_id: historia.paciente?.id,
      empleado_id: historia.empleado?.id,
      sede_id: historia.sede?.id,
      fecha_registro: historia.fecha_registro ? historia.fecha_registro.split("T")[0] : "",
      diagnostico: historia.diagnostico,
    });
    setEditandoId(historia.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      paciente_id: "",
      empleado_id: empleado.id,
      sede_id: "",
      fecha_registro: new Date().toISOString().split("T")[0],
      diagnostico: "",
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    {
      key: "paciente",
      label: "Paciente",
      render: (item) => item.paciente?.nom_pac,
    },
    {
      key: "empleado",
      label: "Registrado por",
      render: (item) => item.empleado?.nom_emp,
    },
    {
      key: "sede",
      label: "Sede",
      render: (item) => item.sede?.nom_sede,
    },
    { key: "fecha_registro", label: "Fecha Registro" },
    {
      key: "diagnostico",
      label: "Diagnóstico",
      render: (item) => item.diagnostico.substring(0, 50) + (item.diagnostico.length > 50 ? "..." : ""),
    },
  ];

  return (
    <div>
      <h2>Historias Clínicas</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {puedeCrear && (
        <>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={btnPrimaryStyle}
          >
            {mostrarForm ? "Cancelar" : "Nueva Historia"}
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
                value={formData.sede_id}
                onChange={(e) =>
                  setFormData({ ...formData, sede_id: e.target.value })
                }
                required
                style={inputStyle}
              >
                <option value="">Seleccionar Sede</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom_sede}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={formData.fecha_registro}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_registro: e.target.value })
                }
                required
                style={inputStyle}
              />

              <textarea
                placeholder="Diagnóstico"
                value={formData.diagnostico}
                onChange={(e) =>
                  setFormData({ ...formData, diagnostico: e.target.value })
                }
                required
                style={{...inputStyle, minHeight: "100px", fontFamily: "Arial"}}
                rows="4"
              />

              <button type="submit" style={btnPrimaryStyle}>
                {editandoId ? "Actualizar" : "Crear"}
              </button>
            </form>
          )}
        </>
      )}

      <TableCRUD
        datos={historias}
        columnas={columnas}
        titulo="Historias Clínicas"
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        cargando={cargando}
        error={error}
      />
    </div>
  );
};

// ==================== PRESCRIPCIONES ====================
export const PrescripcionesPage = ({ empleado }) => {
  const [prescripciones, setPrescripciones] = useState([]);
  const [historias, setHistorias] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    historia_id: "",
    medicamento_id: "",
    dosis: "",
    frecuencia: "",
    duracion: "",
    fecha_emision: new Date().toISOString().split("T")[0],
  });
  const [editandoId, setEditandoId] = useState(null);

  const headers = { "X-Empleado-Id": empleado.id };

  // Determinar permisos basado en rol
  const puedeCrear = ["ADMIN", "MEDICO"].includes(empleado.rol);
  const puedeEditar = ["ADMIN", "MEDICO"].includes(empleado.rol);
  const puedeEliminar = false; // Nunca puede eliminar prescripción
  const puedeLeer = ["ADMIN", "MEDICO"].includes(empleado.rol);

  useEffect(() => {
    if (puedeLeer) {
      cargarDatos();
    }
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [prescripcionesData, historiasData, medicamentosData] = await Promise.all([
        fetchData(`${API_BASE}/prescripciones/`, headers),
        fetchData(`${API_BASE}/historias-clinicas/`, headers),
        fetchData(`${API_BASE}/medicamentos/`, headers),
      ]);
      setPrescripciones(prescripcionesData.results || prescripcionesData);
      setHistorias(historiasData.results || historiasData);
      setMedicamentos(medicamentosData.results || medicamentosData);
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
        await updateData(
          `${API_BASE}/prescripciones/${editandoId}/`,
          formData,
          headers
        );
      } else {
        await createData(`${API_BASE}/prescripciones/`, formData, headers);
      }
      cargarDatos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteData(`${API_BASE}/prescripciones/${id}/`, headers);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (prescripcion) => {
    setFormData({
      historia_id: prescripcion.historia?.id,
      medicamento_id: prescripcion.medicamento?.id,
      dosis: prescripcion.dosis,
      frecuencia: prescripcion.frecuencia,
      duracion: prescripcion.duracion,
      fecha_emision: prescripcion.fecha_emision ? prescripcion.fecha_emision.split("T")[0] : "",
    });
    setEditandoId(prescripcion.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({
      historia_id: "",
      medicamento_id: "",
      dosis: "",
      frecuencia: "",
      duracion: "",
      fecha_emision: new Date().toISOString().split("T")[0],
    });
    setEditandoId(null);
    setMostrarForm(false);
  };

  const columnas = [
    {
      key: "historia",
      label: "Paciente",
      render: (item) => item.historia?.paciente?.nom_pac,
    },
    {
      key: "medicamento",
      label: "Medicamento",
      render: (item) => item.medicamento?.nom_med,
    },
    { key: "dosis", label: "Dosis" },
    { key: "frecuencia", label: "Frecuencia" },
    { key: "duracion", label: "Duración" },
    { key: "fecha_emision", label: "Fecha Emisión" },
  ];

  return (
    <div>
      <h2>Prescripciones Médicas</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!puedeLeer && (
        <p style={{ color: "#d32f2f", fontWeight: "bold" }}>
          No tienes permisos para acceder a esta sección.
        </p>
      )}

      {puedeLeer && (
        <>
          {puedeCrear && (
            <>
              <button
                onClick={() => setMostrarForm(!mostrarForm)}
                style={btnPrimaryStyle}
              >
                {mostrarForm ? "Cancelar" : "Nueva Prescripción"}
              </button>

              {mostrarForm && (
                <form onSubmit={handleGuardar} style={formStyle}>
                  <select
                    value={formData.historia_id}
                    onChange={(e) =>
                      setFormData({ ...formData, historia_id: e.target.value })
                    }
                    required
                    style={inputStyle}
                  >
                    <option value="">Seleccionar Historia Clínica</option>
                    {historias.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.paciente?.nom_pac} - {h.sede?.nom_sede}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.medicamento_id}
                    onChange={(e) =>
                      setFormData({ ...formData, medicamento_id: e.target.value })
                    }
                    required
                    style={inputStyle}
                  >
                    <option value="">Seleccionar Medicamento</option>
                    {medicamentos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nom_med} (Stock: {m.stock})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Dosis (ej: 500mg)"
                    value={formData.dosis}
                    onChange={(e) =>
                      setFormData({ ...formData, dosis: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    placeholder="Frecuencia (ej: Cada 8 horas)"
                    value={formData.frecuencia}
                    onChange={(e) =>
                      setFormData({ ...formData, frecuencia: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    placeholder="Duración (ej: 7 días)"
                    value={formData.duracion}
                    onChange={(e) =>
                      setFormData({ ...formData, duracion: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />

                  <input
                    type="date"
                    value={formData.fecha_emision}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_emision: e.target.value })
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
            datos={prescripciones}
            columnas={columnas}
            titulo="Prescripciones Médicas"
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            puedeEditar={puedeEditar}
            puedeEliminar={puedeEliminar}
            cargando={cargando}
            error={error}
          />
        </>
      )}
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
