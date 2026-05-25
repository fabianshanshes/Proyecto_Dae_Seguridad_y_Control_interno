import React, { useState, useEffect } from 'react';
import { obtenerSolicitudes, actualizarEstadoSolicitud } from '../../dbLocal';

export default function ControlGuardia() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    setSolicitudes(obtenerSolicitudes());
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    actualizarEstadoSolicitud(id, nuevoEstado);
    setSolicitudes(obtenerSolicitudes()); // Recargar cambios
  };

  // Filtrar solo lo que le interesa al guardia
  const solicitudesRelevantes = solicitudes.filter(
    sol => sol.estado === 'Aprobado' || sol.estado === 'Dentro'
  );

  return (
    <div className="text-white">
      <h2 className="text-2xl mb-2 font-bold">Control de Acceso Físico (Guardia)</h2>
      <p className="text-slate-400 mb-6">Registro de ingresos y salidas en el punto de control.</p>

      <div className="grid gap-4">
        {solicitudesRelevantes.length === 0 ? (
          <p className="text-slate-500 bg-slate-900 p-4 rounded border border-slate-800 text-center">
            No hay personal autorizado esperando ingreso o salida en este momento.
          </p>
        ) : null}

        {solicitudesRelevantes.map(sol => (
          <div key={sol.id} className="bg-slate-800 p-4 rounded border border-slate-700 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{sol.solicitante}</p>
              <p className="text-sm text-slate-400">Motivo: {sol.motivo}</p>
              <p className="text-xs text-slate-500 mt-1">ID Registro: {sol.id}</p>
            </div>

            <div>
              {sol.estado === 'Aprobado' ? (
                <button
                  onClick={() => cambiarEstado(sol.id, 'Dentro')}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-medium transition-colors"
                >
                  Registrar Entrada
                </button>
              ) : (
                <button
                  onClick={() => cambiarEstado(sol.id, 'Finalizado')}
                  className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded font-medium transition-colors"
                >
                  Registrar Salida
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}