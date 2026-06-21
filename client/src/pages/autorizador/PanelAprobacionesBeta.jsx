import React from 'react';
import { useState, useEffect } from 'react';

export default function PanelAprobaciones() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests/pending');
      if (!response.ok) throw new Error('Error al conectar con la base de datos');

      const data = await response.json();
      const pendientes = data.filter((s) => s.estado === 'En revision');
      setSolicitudes(pendientes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleDecision = async (id, decision) => {
    let condiciones_motivo = '';

    if (decision === 'Aprobada') {
      condiciones_motivo = window.prompt('¿Deseas agregar alguna condición? (Ej: Requiere acompañamiento de técnico interno)');
    } else if (decision === 'Rechazada') {
      condiciones_motivo = window.prompt('Indica el motivo del rechazo (Ej: Conflicto con ventana de respaldo de 9:00 a 12:00):');
      if (!condiciones_motivo) {
        alert('El motivo de rechazo es obligatorio según el reglamento.');
        return;
      }
    }

    if (condiciones_motivo === null) return;

    try {
      const response = await fetch(`http://localhost:5000/api/requests/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: decision,
          condiciones: condiciones_motivo
        })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      fetchSolicitudes();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-white">Cargando panel...</div>;
  if (error) return <div className="text-red-400 bg-red-900/30 p-4 rounded border border-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto rounded-[2rem] border border-slate-700 bg-slate-900/95 p-7 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
      <div className="mb-6 rounded-[1.75rem] border border-slate-700 bg-slate-800/90 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Panel de aprobación</h2>
            <p className="mt-2 text-sm text-slate-400">Rol: Autorizador | Mostrando solicitudes en revisión.</p>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
            Pendientes: {solicitudes.length}
          </div>
        </div>
      </div>

      {solicitudes.length === 0 ? (
        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-400">
          No hay solicitudes pendientes de revisión.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[1.75rem] border border-slate-700 bg-slate-800/90 shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300 text-sm uppercase tracking-[0.12em]">
                <th className="p-4">ID / Solicitante</th>
                <th className="p-4">Motivo y Zona</th>
                <th className="p-4">Fecha y Horario</th>
                <th className="p-4 text-center">Decisión</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id} className="border-t border-slate-700 transition hover:bg-slate-900/60">
                  <td className="p-4">
                    <span className="text-xs font-mono text-slate-500 block">#{s.id}</span>
                    <span className="font-semibold text-white">{s.solicitante}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    <div className="mb-2">{s.motivo}</div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs text-slate-300">
                      Zona: {s.zona || 'No especificada'}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    <div>{new Date(s.fecha).toLocaleDateString('es-CL')}</div>
                    <div className="mt-1 text-slate-400">{s.hora_inicio} - {s.hora_fin}</div>
                  </td>
                  <td className="p-4 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row">
                    <button
                      onClick={() => handleDecision(s.id, 'Aprobada')}
                      className="rounded-3xl bg-accent px-4 py-2 text-white transition hover:bg-accent-600 shadow-sm"
                    >
                      ✓ Aprobar
                    </button>
                    <button
                      onClick={() => handleDecision(s.id, 'Rechazada')}
                      className="rounded-3xl bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-400 shadow-sm"
                    >
                      ✕ Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
