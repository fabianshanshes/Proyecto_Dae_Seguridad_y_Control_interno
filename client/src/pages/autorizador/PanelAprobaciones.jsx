import React, { useState, useEffect } from 'react';
import { obtenerSolicitudes, actualizarEstadoSolicitud } from '../../dbLocal';

export default function PanelAprobaciones() {
  const [solicitudes, setSolicitudes] = useState([]);

  // Cargar datos de la base de datos local al abrir la pantalla
  useEffect(() => {
    setSolicitudes(obtenerSolicitudes());
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    actualizarEstadoSolicitud(id, nuevoEstado);
    setSolicitudes(obtenerSolicitudes()); // Recargar la lista para ver el cambio
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl mb-4 font-bold">Panel de Autorizaciones (Modo Local)</h2>
      <div className="grid gap-4">
        {solicitudes.length === 0 ? (
          <p className="text-slate-400">No hay solicitudes pendientes.</p>
        ) : null}
        
        {solicitudes.map(sol => (
          <div key={sol.id} className="bg-slate-800 p-4 rounded border border-slate-700 flex justify-between items-center">
            <div>
              <p><strong>Solicitante:</strong> {sol.solicitante}</p>
              <p><strong>Motivo:</strong> {sol.motivo}</p>
              <p><strong>Estado actual:</strong> 
                <span className={`ml-2 font-bold ${
                  sol.estado === 'Aprobado' ? 'text-green-400' : 
                  sol.estado === 'Rechazado' ? 'text-red-400' : 
                  'text-yellow-400'
                }`}>
                  {sol.estado}
                </span>
              </p>
            </div>
            
            {/* Solo mostramos los botones si la solicitud está pendiente */}
            {sol.estado === 'Pendiente' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => cambiarEstado(sol.id, 'Aprobado')} 
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition-colors"
                >
                  Aprobar
                </button>
                <button 
                  onClick={() => cambiarEstado(sol.id, 'Rechazado')} 
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded transition-colors"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}