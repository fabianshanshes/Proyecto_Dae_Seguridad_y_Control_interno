import React, { useState } from 'react';
import { guardarSolicitud } from '../../dbLocal';

export default function FormularioSolicitud() {
  const [motivo, setMotivo] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!motivo) return;
    
    // Guardamos en nuestra base de datos local
    guardarSolicitud({ solicitante: 'Usuario Prueba', motivo: motivo });
    
    alert('Solicitud enviada con éxito');
    setMotivo(''); // Limpiamos el formulario
  };

  return (
    <div className="bg-slate-900 p-6 rounded-lg text-white">
      <h2 className="text-2xl mb-4 font-bold">Solicitar Acceso al Data Center</h2>
      <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
        <label>Motivo del ingreso:</label>
        <input 
          type="text" 
          value={motivo} 
          onChange={(e) => setMotivo(e.target.value)}
          className="p-2 rounded bg-slate-800 text-white border border-slate-700"
          placeholder="Ej. Mantenimiento del servidor X..."
        />
        <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-500">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}