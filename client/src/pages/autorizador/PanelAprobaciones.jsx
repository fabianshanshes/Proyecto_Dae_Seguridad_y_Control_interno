import React from 'react';
import { useState, useEffect } from 'react';

export default function PanelAprobaciones() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las solicitudes pendientes
  const fetchSolicitudes = async () => {
    try {
      // Ajusta el puerto al que estés usando en tu backend (5000 o 3000)
      const response = await fetch('http://localhost:5000/api/requests/pending');
      if (!response.ok) throw new Error('Error al conectar con la base de datos');
      
      const data = await response.json();
      // Lógica de negocio: El autorizador solo debe ver las que están "En revision". 
      // Las "Observadas" se quedan esperando corrección del solicitante.
      const pendientes = data.filter(s => s.estado === 'En revision');
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

  // Función para aprobar o rechazar (conecta con el endpoint PUT)
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

    if (condiciones_motivo === null) return; // Si el usuario cancela el prompt

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
      
      // Recargar la tabla para que la solicitud desaparezca de los pendientes
      fetchSolicitudes();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-white">Cargando panel...</div>;
  if (error) return <div className="text-red-400 bg-red-900/30 p-4 rounded border border-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-slate-900 text-white p-6 rounded-lg shadow-xl border border-slate-700">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-emerald-400">Panel de Aprobación de Infraestructura</h2>
        <p className="text-sm text-slate-400">Rol: Autorizador (Valeria) | Mostrando solo solicitudes "En revisión"</p>
      </div>

      {solicitudes.length === 0 ? (
        <div className="bg-slate-800 text-center p-8 rounded border border-slate-700 text-slate-400">
          No hay solicitudes pendientes de revisión.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-300 text-sm border-b border-slate-700">
                <th className="p-3">ID / Solicitante</th>
                <th className="p-3">Motivo y Zona</th>
                <th className="p-3">Fecha y Horario</th>
                <th className="p-3 text-center">Decisión Administrativa</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="p-3">
                    <span className="text-xs font-mono text-slate-500 block">#{s.id}</span>
                    <span className="font-semibold">{s.solicitante}</span>
                  </td>
                  <td className="p-3 text-sm">
                    <span className="block">{s.motivo}</span>
                    <span className="text-blue-400 text-xs font-bold">{s.zona}</span>
                  </td>
                  <td className="p-3 text-sm">
                    <span className="block">{new Date(s.fecha).toLocaleDateString('es-CL')}</span>
                    <span className="text-slate-400 text-xs">{s.hora_inicio} - {s.hora_fin}</span>
                  </td>
                  <td className="p-3 flex flex-col sm:flex-row justify-center gap-2">
                    <button 
                      onClick={() => handleDecision(s.id, 'Aprobada')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded font-medium transition-colors"
                    >
                      ✓ Aprobar
                    </button>
                    <button 
                      onClick={() => handleDecision(s.id, 'Rechazada')}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded font-medium transition-colors"
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