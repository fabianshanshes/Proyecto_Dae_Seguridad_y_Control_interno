import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import FormularioSolicitud from './pages/solicitante/FormularioSolicitud'; 
import PanelAprobaciones from './pages/autorizador/PanelAprobaciones';
import ControlGuardia from './pages/guardia/ControlGuardia';
import MonitoreoTiempoReal from './pages/soc/MonitoreoTiempoReal';

function App() {
  return (
    <Router>
      <div className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/solicitante" className="hover:text-blue-300 transition-colors">Vista Solicitante</Link>
        <Link to="/autorizador" className="hover:text-blue-300 transition-colors">Vista Autorizador</Link>
        <Link to="/guardia" className="hover:text-blue-300 transition-colors">Vista Guardia</Link>
        <Link to="/soc" className="hover:text-blue-300 transition-colors">Vista SOC</Link>
      </div>

      <div className="p-8 bg-slate-950 min-h-screen">
        <Routes>
          <Route path="/solicitante" element={<FormularioSolicitud />} />
          <Route path="/autorizador" element={<PanelAprobaciones />} />
          <Route path="/guardia" element={<ControlGuardia />} />
          <Route path="/soc" element={<MonitoreoTiempoReal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;