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
    <div className="max-w-2xl mx-auto bg-slate-900 text-white p-6 rounded-lg shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-2 text-blue-400">Generar Solicitud de Acceso</h2>
      <p className="text-sm text-slate-400 mb-6">
        Fase de Pruebas PMN: Omite el campo "Zona/Rack" para probar la Excepción 1 (Estado: Observada).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del Solicitante</label>
          <input
            type="text"
            name="solicitante"
            value={formData.solicitante}
            onChange={handleChange}
            required
            placeholder="Ej: Rodrigo (Técnico Externo)"
            className="w-full p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Motivo del Ingreso</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            required
            placeholder="Ej: Reemplazo de módulo RAM defectuoso"
            rows="2"
            className="w-full p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Zona / Rack Específico</label>
          <input
            type="text"
            name="zona"
            value={formData.zona}
            onChange={handleChange}
            placeholder="Ej: Sala 2 - Rack B3 (Opcional para forzar excepción)"
            className="w-full p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora Inicio</label>
            <input
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora Fin</label>
            <input
              type="time"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition-colors"
        >
          Enviar Solicitud al Autorizador
        </button>
      </form>

      {/* Panel de Feedback Técnico (Clave para mostrar el funcionamiento real) */}
      {resultado && (
        <div className={`mt-6 p-4 rounded border ${
          resultado.estado === 'Observada' 
            ? 'bg-amber-950/40 border-amber-500 text-amber-200' 
            : 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
        }`}>
          <h3 className="font-bold text-lg mb-1">Respuesta del Servidor (Base de Datos):</h3>
          <p className="text-sm mb-2">La solicitud fue procesada e insertada de manera exitosa en MariaDB.</p>
          <ul className="text-xs space-y-1 bg-slate-950/60 p-3 rounded font-mono">
            <li><strong>ID Generado:</strong> {resultado.id}</li>
            <li><strong>Solicitante:</strong> {resultado.solicitante}</li>
            <li><strong>Zona Asignada:</strong> {resultado.zona}</li>
            <li><strong>Estado del Sistema:</strong> <span className={`px-2 py-0.5 rounded font-bold ${
              resultado.estado === 'Observada' ? 'bg-amber-500 text-slate-950' : 'bg-blue-500 text-white'
            }`}>{resultado.estado}</span></li>
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-950/40 border border-red-500 text-red-200 rounded">
          <p className="font-bold">Error de Conexión:</p>
          <p className="text-sm font-mono">{error}</p>
        </div>
      )}
    </div>
  );
}