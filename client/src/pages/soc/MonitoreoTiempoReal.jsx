import React, { useState, useEffect } from 'react';
import { obtenerSolicitudes } from '../../dbLocal';

export default function MonitoreoTiempoReal() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    // Simular actualización en tiempo real leyendo cada 3 segundos
    const intervalo = setInterval(() => {
      setSolicitudes(obtenerSolicitudes());
    }, 3000);

    setSolicitudes(obtenerSolicitudes());

    return () => clearInterval(intervalo);
  }, []);

  // Calcular métricas rápidas
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
  const enSala = solicitudes.filter(s => s.estado === 'Dentro').length;
  const finalizados = solicitudes.filter(s => s.estado === 'Finalizado').length;

  return (
    <div className="text-white">
      <h2 className="text-2xl mb-2 font-bold">Monitoreo en Tiempo Real (SOC)</h2>
      <p className="text-slate-400 mb-6">Consola de supervisión de incidentes y estado del Data Center.</p>

      {/* Tarjetas de Indicadores Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <p className="text-sm text-slate-400 font-medium">Por Autorizar</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">{pendientes}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <p className="text-sm text-slate-400 font-medium">Personal en Sala (Activo)</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{enSala}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <p className="text-sm text-slate-400 font-medium">Accesos Concluidos</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{finalizados}</p>
        </div>
      </div>

      {/* Registro de Actividad General */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-bold mb-4">Bitácora Global de Accesos</h3>
        <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
          {solicitudes.length === 0 ? (
            <p className="text-slate-500 py-4 text-center">No se registran operaciones en el sistema.</p>
          ) : null}

          {[...solicitudes].reverse().map(sol => (
            <div key={sol.id} className="py-3 flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-slate-200">{sol.solicitante}</span>
                <p className="text-xs text-slate-500">Motivo: {sol.motivo}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  sol.estado === 'Dentro' ? 'bg-green-950 text-green-400 border border-green-800' :
                  sol.estado === 'Aprobado' ? 'bg-blue-950 text-blue-400 border border-blue-900' :
                  sol.estado === 'Rechazado' ? 'bg-red-950 text-red-400 border border-red-900' :
                  sol.estado === 'Finalizado' ? 'bg-slate-800 text-slate-400' :
                  'bg-yellow-950 text-yellow-400 border border-yellow-900'
                }`}>
                  {sol.estado}
                </span>
                <p className="text-[10px] text-slate-600 mt-1">{sol.fecha || 'Reciente'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}