import React from 'react';
import { useState, useEffect } from 'react';

export default function MonitoreoTiempoReal() {
  const [accesosActivos, setAccesosActivos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/requests/pending');
      const data = await res.json();
      // El SOC solo monitorea a quienes ya están físicamente dentro
      setAccesosActivos(data.filter(s => s.estado === 'En uso'));
    } catch (err) {
      console.error("Error cargando accesos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivos(); }, []);

  const reportarIncidencia = async (id, tipoAnomalia) => {
    const confirmar = window.confirm(`¿Confirmar alerta de seguridad: ${tipoAnomalia}?`);
    if (!confirmar) return;

    const severidad = tipoAnomalia === 'Apertura de rack no autorizado' ? 'Critica' : 'Alta';

    try {
      const res = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitud_id: id,
          tipo_incidente: tipoAnomalia,
          severidad: severidad
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("🚨 Alerta registrada: " + data.msg);
        fetchActivos(); 
      } else {
        alert("Error: " + (data.msg || data.error));
      }
    } catch (err) {
      console.error("Error al registrar incidencia:", err);
      alert("Fallo de conexión con el servidor SOC");
    }
  };
  if (loading) return <div className="text-white">Conectando con cámaras y sensores...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-slate-900 text-white p-6 rounded-lg shadow-xl border-l-4 border-rose-600">
      <div className="mb-6 flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-rose-500 flex items-center gap-2">
            <span className="animate-pulse">🔴</span> SOC: Monitoreo en Tiempo Real
          </h2>
          <p className="text-sm text-slate-400">Vigilancia de accesos en estado "En uso"</p>
        </div>
      </div>

      {accesosActivos.length === 0 ? (
        <div className="bg-slate-800 text-center p-8 rounded border border-slate-700 text-emerald-400 font-medium">
          Operación normal. No hay personal en zonas restringidas.
        </div>
      ) : (
        <div className="grid gap-4">
          {accesosActivos.map(s => (
            <div key={s.id} className="bg-slate-800 p-4 rounded border border-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs font-mono bg-blue-900 text-blue-200 px-2 py-1 rounded">ID: {s.id}</span>
                <p className="font-bold text-lg mt-2">{s.solicitante}</p>
                <p className="text-sm text-slate-400">Interviniendo: <span className="text-white font-medium">{s.zona}</span></p>
                <p className="text-xs text-slate-500 mt-1">Límite de tiempo: {s.hora_fin}</p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <p className="text-xs text-slate-400 mb-1">Simular Anomalías:</p>
                <button 
                  onClick={() => reportarIncidencia(s.id, 'Permanencia fuera del horario autorizado')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-2 rounded font-medium transition-colors w-full"
                >
                  ⏱️ Excepción 1: Exceso de Tiempo
                </button>
                <button 
                  onClick={() => reportarIncidencia(s.id, 'Apertura de rack no autorizado')}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-4 py-2 rounded font-medium transition-colors w-full"
                >
                  🚪 Excepción 2: Abrir rack indebido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}