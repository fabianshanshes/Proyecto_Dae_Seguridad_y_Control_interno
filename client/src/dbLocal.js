export const obtenerSolicitudes = () => {
  const datos = localStorage.getItem('solicitudes_datacenter');
  return datos ? JSON.parse(datos) : [];
};

export const guardarSolicitud = (nuevaSolicitud) => {
  const solicitudes = obtenerSolicitudes();
  const solicitudConId = { 
    ...nuevaSolicitud, 
    id: Date.now(),
    estado: 'Pendiente',
    fecha: new Date().toLocaleString()
  };
  solicitudes.push(solicitudConId);
  localStorage.setItem('solicitudes_datacenter', JSON.stringify(solicitudes));
};

export const actualizarEstadoSolicitud = (id, nuevoEstado) => {
  const solicitudes = obtenerSolicitudes();
  const actualizadas = solicitudes.map(sol => 
    sol.id === id ? { ...sol, estado: nuevoEstado } : sol
  );
  localStorage.setItem('solicitudes_datacenter', JSON.stringify(actualizadas));
};