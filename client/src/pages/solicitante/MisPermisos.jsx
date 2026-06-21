import React from 'react';
import { useState } from 'react';

const ESTILOS_ESTADO = {
  'En revision': 'bg-slate-600 text-white',
  Observada: 'bg-amber-500 text-slate-950',
  Aprobada: 'bg-blue-500 text-white',
  Rechazada: 'bg-rose-600 text-white',
  'En uso': 'bg-emerald-500 text-slate-950',
  Finalizada: 'bg-slate-500 text-white',
  'Finalizada con incidencia': 'bg-orange-600 text-white',
  'Expirada sin uso': 'bg-zinc-600 text-zinc-200'
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
    <div className="max-w-4xl mx-auto rounded-[2rem] border border-slate-700 bg-slate-900/95 p-7 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <div className="mb-6 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-blue-200">
          🔎 Consulta de permisos
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-white">Mis permisos de acceso</h2>
          <p className="mt-2 text-sm text-slate-400">Ingresa tu nombre para ver el estado y el historial de tus solicitudes.</p>
        </div>
      </div>

      <form onSubmit={handleBuscar} className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={solicitante}
          onChange={(e) => setSolicitante(e.target.value)}
          placeholder="Ej: Rodrigo (Técnico Externo)"
          className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-3xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-3xl border border-red-500/50 bg-red-950/20 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {yaConsulto && (
        <div className="space-y-6">
          {solicitudes.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Solicitudes encontradas</p>
                <p className="mt-3 text-4xl font-semibold text-white">{solicitudes.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Última búsqueda</p>
                <p className="mt-3 text-xl font-semibold text-white">{buscado}</p>
              </div>
            </div>
          )}

          {solicitudes.length === 0 ? (
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-400">
              No se encontraron solicitudes para "{buscado}".
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((s) => (
                <div key={s.id} className="rounded-[1.75rem] border border-slate-700 bg-slate-800 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">#{s.id}</span>
                      <p className="mt-2 text-lg font-semibold text-white">{s.motivo}</p>
                      <p className="mt-1 text-sm text-slate-400">Zona: <span className="text-slate-100">{s.zona || 'No definida'}</span></p>
                    </div>
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                        ESTILOS_ESTADO[s.estado] || 'bg-slate-600 text-white'
                      }`}
                    >
                      {s.estado}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
                    <div className="rounded-3xl bg-slate-950/80 p-3">
                      <p className="text-slate-500">Fecha autorizada</p>
                      <p className="mt-2 font-medium text-white">{new Date(s.fecha).toLocaleDateString('es-CL')}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/80 p-3">
                      <p className="text-slate-500">Horario</p>
                      <p className="mt-2 font-medium text-white">{s.hora_inicio} - {s.hora_fin}</p>
                    </div>
                    {s.condiciones && (
                      <div className="sm:col-span-2 rounded-3xl bg-slate-950/80 p-3">
                        <p className="text-slate-500">Condiciones / Observaciones</p>
                        <p className="mt-2 text-sm text-slate-100">{s.condiciones}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
