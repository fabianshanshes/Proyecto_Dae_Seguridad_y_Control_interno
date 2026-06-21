import React from 'react';
import { useState, useEffect } from 'react';

export default function ControlGuardia() {
  const [ingresosPendientes, setIngresosPendientes] = useState([]);
  const [visitasActivas, setVisitasActivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/requests/pending');
      if (!res.ok) throw new Error('Error al conectar con la base de datos');
      const data = await res.json();

      // Separación lógica del flujo según el estado actual en MariaDB
      setIngresosPendientes(data.filter(s => s.estado === 'Aprobada'));
      setVisitasActivas(data.filter(s => s.estado === 'En uso'));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleCheckIn = async (id) => {
    const tieneCedula = window.confirm('¿El solicitante presentó su cédula de identidad física?');

    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}/check-in`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tieneCedulaFisica: tieneCedula })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Acceso Habilitado: ' + data.msg);
      } else {
        alert(`Entrada Denegada: ${data.motivo || data.msg}`);
      }
      fetchSolicitudes(); // Recargar ambas listas en cualquier caso
    } catch (err) {
      alert('Fallo de conexión con el servidor');
    }
  };

  const handleCheckOut = async (id) => {
    const confirmarSalida = window.confirm('¿Confirmar salida del técnico del Centro de Datos?');
    if (!confirmarSalida) return;

    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}/check-out`, {
        method: 'PUT'
      });

      const data = await res.json();

      if (res.ok) {
        alert('Salida registrada con éxito. Estado: Finalizada');
      } else {
        alert('Error: ' + (data.msg || 'No se pudo registrar la salida'));
      }
      fetchSolicitudes(); // Limpia la lista de visitas activas
    } catch (err) {
      alert('Fallo de conexión con el servidor');
    }
  };

  if (loading) return <div className="text-white p-6">Cargando control de acceso...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-slate-900 text-white rounded-lg border border-slate-700">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-sky-400">Control de Acceso Físico</h2>
        <p className="text-sm text-slate-400">Rol: Guardia | Validación de cédula, horario y cierre de ciclo</p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-500 text-red-200 p-4 rounded text-sm">
          Error: {error}
        </div>
      )}

      {/* SECCIÓN 1: CONTROL DE ENTRADAS */}
      <section className="border border-slate-700 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-sky-400 mb-4">
          1. Control de Ingreso <span className="text-sm font-normal text-slate-400">(Cédula física + ventana horaria)</span>
        </h3>

        {ingresosPendientes.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay solicitudes aprobadas esperando ingreso.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-sm">
                <th className="p-2">Solicitante</th>
                <th className="p-2">Zona</th>
                <th className="p-2">Horario autorizado</th>
                <th className="p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {ingresosPendientes.map(s => (
                <tr key={s.id} className="border-t border-slate-800">
                  <td className="p-2 font-medium">{s.solicitante}</td>
                  <td className="p-2 text-sm text-slate-300">{s.zona}</td>
                  <td className="p-2 text-sm text-slate-400">{s.hora_inicio} - {s.hora_fin}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleCheckIn(s.id)}
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                      Registrar Ingreso
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* SECCIÓN 2: CONTROL DE SALIDAS */}
      <section className="border border-slate-700 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-emerald-400 mb-4">
          2. Control de Salida <span className="text-sm font-normal text-slate-400">(Personal dentro del Data Center)</span>
        </h3>

        {visitasActivas.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay personal autorizado en las instalaciones en este momento.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-sm">
                <th className="p-2">Técnico</th>
                <th className="p-2">Zona</th>
                <th className="p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {visitasActivas.map(s => (
                <tr key={s.id} className="border-t border-slate-800">
                  <td className="p-2 font-medium">{s.solicitante}</td>
                  <td className="p-2 text-sm text-slate-300">{s.zona}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleCheckOut(s.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-1.5 rounded font-medium transition-colors"
                    >
                      🚪 Registrar Salida
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
