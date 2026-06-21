import React from 'react';
import { useState } from 'react';

export default function FormularioSolicitud() {
  const [formData, setFormData] = useState({
    solicitante: '',
    motivo: '',
    zona: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: ''
  });

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultado(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud en el servidor');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-[2rem] border border-slate-700 bg-slate-900/95 p-7 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <div className="mb-6 space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-accent">
          📝 Solicitud de acceso
        </span>
        <div>
          <h2 className="text-3xl font-semibold text-white">Generar solicitud de acceso</h2>
          <p className="mt-2 text-sm text-slate-400">
            Completa los datos para enviar la solicitud al autorizador. En modo de prueba, deja "Zona / Rack" vacío si deseas forzar el estado Observada.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Nombre del solicitante</label>
          <input
            type="text"
            name="solicitante"
            value={formData.solicitante}
            onChange={handleChange}
            required
            placeholder="Ej: Rodrigo (Técnico Externo)"
            className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Motivo del ingreso</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            required
            placeholder="Ej: Reemplazo de módulo RAM defectuoso"
            rows="3"
            className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Zona / Rack específico</label>
          <input
            type="text"
            name="zona"
            value={formData.zona}
            onChange={handleChange}
            placeholder="Ej: Sala 2 - Rack B3 (Opcional)"
            className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Hora inicio</label>
            <input
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Hora fin</label>
            <input
              type="time"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-accent-600"
        >
          Enviar solicitud al autorizador
        </button>
      </form>

      {resultado && (
        <div className={`mt-8 rounded-3xl border p-5 ${
          resultado.estado === 'Observada'
            ? 'border-amber-500/60 bg-amber-950/15 text-amber-100'
            : 'border-emerald-500/60 bg-emerald-950/15 text-emerald-100'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700">
            <div>
              <h3 className="text-xl font-semibold">Respuesta recibida</h3>
              <p className="text-sm text-slate-400">Solicitud procesada por el servidor y registrada en la base de datos.</p>
            </div>
            <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
              {resultado.estado}
            </span>
          </div>
          <ul className="mt-4 space-y-2 rounded-2xl bg-slate-950/80 p-4 text-sm font-mono text-slate-200">
            <li><strong>ID generado:</strong> {resultado.id}</li>
            <li><strong>Solicitante:</strong> {resultado.solicitante}</li>
            <li><strong>Zona asignada:</strong> {resultado.zona || 'No asignada'}</li>
            <li>
              <strong>Estado del sistema:</strong>{' '}
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                resultado.estado === 'Observada'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-sky-500 text-white'
              }`}>
                {resultado.estado}
              </span>
            </li>
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-3xl border border-red-500/50 bg-red-950/20 p-5 text-sm text-red-200">
          <p className="font-semibold">Error de conexión:</p>
          <p className="mt-2 font-mono">{error}</p>
        </div>
      )}
    </div>
  );
}
