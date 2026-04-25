import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import SystemStatusBadge from '../components/SystemStatusBadge';
import FileUploadFAB from '../components/FileUploadFAB';
import TerritoriosModal from '../components/TerritoriosModal';

import ZoneList from '../components/ZoneList';
import '../styles/Dashboard.css';

const COLOMBIA_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada',
];

const DashboardPage: React.FC = () => {
  // Extraemos datos del contexto de autenticación (HU-12)
  const { username, logout, role } = useAuth();
  const navigate = useNavigate();
  const [territoriosOpen, setTerritoriosOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [deptOpen, setDeptOpen] = useState(false);
  const deptRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el menú desplegable al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Análisis Territorial</span>
        </div>

        <div className="dashboard-user">
          {/* Nuevo indicador de salud del sistema global */}
          <SystemStatusBadge />

          {/* VISIBILIDAD CONDICIONAL: El botón de gestión de usuarios solo aparece para ADMINS */}
          {role === 'ADMIN' && (
            <button onClick={() => navigate('/admin/users')} className="btn-admin" style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Usuarios
            </button>
          )}

          {/* Botón para navegar al perfil detallado */}
          <button onClick={() => navigate('/profile')} className="btn-profile" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Mi Perfil
          </button>

          <span className="user-greeting">Hola, <strong>{username}</strong></span>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1>¡Bienvenido, {username}!</h1>
          <p>Has iniciado sesión correctamente en el sistema de Análisis Territorial.</p>
        </div>

        <div className="dashboard-grid">
          {/* Card para seleccionar territorios (dropdown de departamentos) */}
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Territorios</span>
              <div className="dept-dropdown" ref={deptRef}>
                <button
                  className={`dept-dropdown-btn${deptOpen ? ' open' : ''}`}
                  onClick={() => setDeptOpen((v) => !v)}
                  type="button"
                >
                  <span className="dept-dropdown-value">
                    {selectedDepartment || 'Seleccionar...'}
                  </span>
                  <svg
                    className={`dept-chevron${deptOpen ? ' rotated' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {deptOpen && (
                  <ul className="dept-dropdown-list">
                    {COLOMBIA_DEPARTMENTS.map((dept) => (
                      <li
                        key={dept}
                        className={`dept-dropdown-item${selectedDepartment === dept ? ' active' : ''}`}
                        onClick={() => { setSelectedDepartment(dept); setDeptOpen(false); }}
                      >
                        {dept}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Análisis</span>
              <span className="stat-value">--</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Reportes</span>
              <span className="stat-value">--</span>
            </div>
          </div>
        </div>

        {/* Componente que lista las zonas filtradas por departamento */}
        <ZoneList department={selectedDepartment} />
      </main>

      {/* Botón flotante para subir archivos (Progress Bar Integrada) */}
      <FileUploadFAB />
      
      {/* Modal de territorios (si se usa por separado) */}
      <TerritoriosModal isOpen={territoriosOpen} onClose={() => setTerritoriosOpen(false)} />
    </div>
  );
};

export default DashboardPage;