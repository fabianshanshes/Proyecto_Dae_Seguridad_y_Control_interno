import React from 'react';
import { useState, useEffect } from 'react';

export default function ControlGuardia() {
  const [solicitudes, setSolicitudes] = useState([]);

  const fetchAprobadas = async () => {
    // Aquí traeríamos solo las 'Aprobada'
    const res = await fetch('http://localhost:5000/api/requests/pending');
    const data = await res.json();
    setSolicitudes(data.filter(s => s.estado === 'Aprobada'));
  };

  useEffect(() => { fetchAprobadas(); }, []);

  const handleCheckIn = async (id) => {
    const tieneCedula = window.confirm("¿El solicitante presentó su cédula de identidad física?");
    
    const res = await fetch(`http://localhost:5000/api/requests/${id}/check-in`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tieneCedulaFisica: tieneCedula })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Acceso Habilitado: " + data.msg);
      fetchAprobadas();
    } else {
      alert("Error: " + data.motivo);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-sky-400">Control de Acceso Físico</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400">
            <th className="p-2">Solicitante</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(s => (
            <tr key={s.id} className="border-t border-slate-800">
              <td className="p-2">{s.solicitante}</td>
              <td className="p-2">
                <button 
                  onClick={() => handleCheckIn(s.id)}
                  className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-500"
                >
                  Registrar Ingreso
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}