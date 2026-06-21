import React from 'react';
import { useState } from 'react';

const ESTILOS_ESTADO = {
  'En revision':            'bg-slate-600 text-white',
  'Observada':               'bg-amber-500 text-slate-950',
  'Aprobada':                 'bg-blue-500 text-white',
  'Rechazada':               'bg-rose-600 text-white',
  'En uso':                   'bg-emerald-500 text-slate-950',
  'Finalizada':               'bg-slate-500 text-white',
  'Finalizada con incidencia':'bg-orange-600 text-white',
  'Expirada sin uso':         'bg-zinc-600 text-zinc-200'
};

export default function MisPermisos() {
  const [solicitante, setSolicitante] = useState('');
  const [buscado, setBuscado] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [yaConsulto, setYaConsulto] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!solicitante.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/mine?solicitante=${encodeURIComponent(solicitante.trim())}`
      );
      if (!res.ok) throw new Error('Error al consultar tus solicitudes');

      const data = await res.json();
      setSolicitudes(data);
      setBuscado(solicitante.trim());
      setYaConsulto(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900 text-white p-6 rounded-lg shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-2 text-blue-400">Mis Permisos de Acceso</h2>
      <p className="text-sm text-slate-400 mb-6">
        Ingresa tu nombre tal como lo escribiste en la solicitud para ver el estado de tus accesos.
      </p>

      <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={solicitante}
          onChange={(e) => setSolicitante(e.target.value)}
          placeholder="Ej: Rodrigo (Técnico Externo)"
          className="flex-1 p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded transition-colors"
        >
          {loading ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500 text-red-200 rounded text-sm">
          {error}
        </div>
      )}

      {yaConsulto && !error && (
        solicitudes.length === 0 ? (
          <div className="bg-slate-800 text-center p-8 rounded border border-slate-700 text-slate-400">
            No se encontraron solicitudes para "{buscado}".
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              {solicitudes.length} solicitud{solicitudes.length !== 1 ? 'es' : ''} encontrada{solicitudes.length !== 1 ? 's' : ''} para "{buscado}"
            </p>
            {solicitudes.map(s => (
              <div key={s.id} className="bg-slate-800 p-4 rounded border border-slate-700">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <span className="text-xs font-mono text-slate-500 block">#{s.id}</span>
                    <p className="font-semibold">{s.motivo}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${ESTILOS_ESTADO[s.estado] || 'bg-slate-600 text-white'}`}>
                    {s.estado}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mt-2">
                  <span><strong className="text-slate-500">Zona:</strong> {s.zona}</span>
                  <span><strong className="text-slate-500">Fecha:</strong> {new Date(s.fecha).toLocaleDateString('es-CL')}</span>
                  <span><strong className="text-slate-500">Horario:</strong> {s.hora_inicio} - {s.hora_fin}</span>
                  {s.condiciones && (
                    <span className="col-span-2"><strong className="text-slate-500">Condiciones/Motivo:</strong> {s.condiciones}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
