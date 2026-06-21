import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import FormularioSolicitud from './pages/solicitante/FormularioSolicitudBeta';
import MisPermisos from './pages/solicitante/MisPermisos';
import PanelAprobaciones from './pages/autorizador/PanelAprobacionesBeta';
import ControlGuardia from './pages/guardia/ControlGuardiaBeta';
import MonitoreoTiempoReal from './pages/soc/MonitoreoTiempoRealBeta';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Sistema de Seguridad y Control</p>
              <h1 className="text-3xl font-semibold text-white">Control de Accesos al Centro de Datos</h1>
            </div>
          </div>
        </header>

        <nav className="border-b border-slate-800 bg-slate-900/95">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap gap-3">
            <NavLink to="/solicitante" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-surface'}`}>
              Solicitante
            </NavLink>
            <NavLink to="/mis-permisos" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-surface'}`}>
              Mis Permisos
            </NavLink>
            <NavLink to="/autorizador" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-surface'}`}>
              Autorizador
            </NavLink>
            <NavLink to="/guardia" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-surface'}`}>
              Guardia
            </NavLink>
            <NavLink to="/soc" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-accent text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-surface'}`}>
              SOC
            </NavLink>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-8">
          <Routes>
            <Route path="/solicitante" element={<FormularioSolicitud />} />
            <Route path="/mis-permisos" element={<MisPermisos />} />
            <Route path="/autorizador" element={<PanelAprobaciones />} />
            <Route path="/guardia" element={<ControlGuardia />} />
            <Route path="/soc" element={<MonitoreoTiempoReal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;