import React from 'react';
import { useState, useEffect } from 'react';

// Catálogo de anomalías con severidad FIJA (no editable por el operador).
// El valor 'severidad: null' marca la opción libre, que sí permite elegir severidad.
const CATALOGO_ANOMALIAS = [
  { value: 'Permanencia fuera del horario autorizado', label: 'Exceso de tiempo', severidad: 'Baja' },
  { value: 'Apertura de rack no autorizado', label: 'Apertura de rack indebido', severidad: 'Alta' },
  { value: 'Intrusión en zona adyacente', label: 'Merodeo en zona no autorizada', severidad: 'Media' },
  { value: 'Tailgating detectado', label: 'Ingreso con persona no autorizada', severidad: 'Alta' },
  { value: 'Otra', label: 'Otra (especificar)', severidad: null }
];

export default function MonitoreoTiempoReal() {
  const [accesosActivos, setAccesosActivos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario de reporte, por solicitud (id -> { tipo, tipoLibre, severidad, observaciones })
  const [formularios, setFormularios] = useState({});

  const fetchActivos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/requests/pending');
      const data = await res.json();
      // El SOC solo monitorea a quienes ya están físicamente dentro
      setAccesosActivos(data.filter(s => s.estado === 'En uso'));
    } catch (err) {
      console.error("Error cargando accesos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivos(); }, []);

  // Devuelve el formulario actual de una solicitud (con valores por defecto si no existe aún)
  const getFormulario = (id) => {
    return formularios[id] || {
      tipo: CATALOGO_ANOMALIAS[0].value,
      tipoLibre: '',
      severidad: CATALOGO_ANOMALIAS[0].severidad,
      observaciones: ''
    };
  };

  const actualizarFormulario = (id, cambios) => {
    setFormularios(prev => ({
      ...prev,
      [id]: { ...getFormulario(id), ...cambios }
    }));
  };

  const handleCambioTipo = (id, nuevoTipo) => {
    const anomalia = CATALOGO_ANOMALIAS.find(a => a.value === nuevoTipo);
    // Si el tipo elegido tiene severidad fija, se la asignamos automáticamente.
    // Solo 'Otra' (severidad: null) deja la severidad editable para el operador.
    actualizarFormulario(id, {
      tipo: nuevoTipo,
      severidad: anomalia.severidad ?? getFormulario(id).severidad ?? 'Media'
    });
  };

  const reportarIncidencia = async (id, tipoAnomalia, severidad, observaciones) => {
    const confirmar = window.confirm(`¿Confirmar alerta de seguridad: ${tipoAnomalia}?`);
    if (!confirmar) return;

    try {
      const res = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitud_id: id,
          tipo_incidente: tipoAnomalia,
          severidad: severidad,
          observaciones: observaciones || undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("🚨 Alerta registrada: " + data.msg);
        fetchActivos();
      } else {
        alert("Error: " + (data.msg || data.error));
      }
    } catch (err) {
      console.error("Error al registrar incidencia:", err);
      alert("Fallo de conexión con el servidor SOC");
    }
  };

  if (loading) return <div className="text-white">Conectando con cámaras y sensores...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-slate-900 text-white p-6 rounded-lg shadow-xl border-l-4 border-rose-600">
      <div className="mb-6 flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-rose-500 flex items-center gap-2">
            <span className="animate-pulse">🔴</span> SOC: Monitoreo en Tiempo Real
          </h2>
          <p className="text-sm text-slate-400">Vigilancia de accesos en estado "En uso"</p>
        </div>
      </div>

      {accesosActivos.length === 0 ? (
        <div className="bg-slate-800 text-center p-8 rounded border border-slate-700 text-emerald-400 font-medium">
          Operación normal. No hay personal en zonas restringidas.
        </div>
      ) : (
        <div className="grid gap-4">
          {accesosActivos.map(s => {
            const form = getFormulario(s.id);
            const esLibre = form.tipo === 'Otra';

            return (
              <div key={s.id} className="bg-slate-800 p-4 rounded border border-slate-600 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-mono bg-blue-900 text-blue-200 px-2 py-1 rounded">ID: {s.id}</span>
                  <p className="font-bold text-lg mt-2">{s.solicitante}</p>
                  <p className="text-sm text-slate-400">Interviniendo: <span className="text-white font-medium">{s.zona}</span></p>
                  <p className="text-xs text-slate-500 mt-1">Límite de tiempo: {s.hora_fin}</p>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <p className="text-xs text-slate-400 mb-1">Registrar Anomalía:</p>

                  <select
                    value={form.tipo}
                    onChange={(e) => handleCambioTipo(s.id, e.target.value)}
                    className="p-1.5 bg-slate-700 text-xs rounded border border-slate-600"
                  >
                    {CATALOGO_ANOMALIAS.map(a => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>

                  {esLibre && (
                    <input
                      type="text"
                      value={form.tipoLibre}
                      onChange={(e) => actualizarFormulario(s.id, { tipoLibre: e.target.value })}
                      placeholder="Describe el tipo de anomalía"
                      className="p-1.5 bg-slate-700 text-xs rounded border border-slate-600"
                    />
                  )}

                  <div className="flex gap-2">
                    {/* La severidad solo es editable cuando el tipo es libre ('Otra').
                        Para las anomalías predefinidas, queda fija y deshabilitada. */}
                    <select
                      value={form.severidad}
                      onChange={(e) => actualizarFormulario(s.id, { severidad: e.target.value })}
                      disabled={!esLibre}
                      className="p-1.5 bg-slate-700 text-xs rounded border border-slate-600 w-1/3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Critica">Crítica</option>
                    </select>

                    <input
                      type="text"
                      value={form.observaciones}
                      onChange={(e) => actualizarFormulario(s.id, { observaciones: e.target.value })}
                      placeholder="Observaciones (ej. sujeto lleva mochila sospechosa)"
                      className="p-1.5 bg-slate-700 text-xs rounded border border-slate-600 w-2/3"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const tipoFinal = esLibre ? (form.tipoLibre.trim() || 'Otra') : form.tipo;
                      reportarIncidencia(s.id, tipoFinal, form.severidad, form.observaciones);
                    }}
                    disabled={esLibre && !form.tipoLibre.trim()}
                    className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs px-4 py-2 rounded font-medium transition-colors mt-1"
                  >
                    🚨 Generar Alerta
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
