import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import SystemHealth from '../components/SystemHealth';

const ProfilePage: React.FC = () => {
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();

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
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
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
        {/* User Info Card */}
        <div className="welcome-card" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}>
              {username ? username[0].toUpperCase() : '?'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.375rem' }}>Mi Perfil</h1>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#f1f5f9' }}>{username}</strong>
              </p>
              <span style={{
                display: 'inline-block',
                padding: '0.275rem 0.75rem',
                borderRadius: '20px',
                background: role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.15)',
                border: `1px solid ${role === 'ADMIN' ? 'rgba(99,102,241,0.4)' : 'rgba(16,185,129,0.3)'}`,
                color: role === 'ADMIN' ? '#a5b4fc' : '#6ee7b7',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}>
                {role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* System Health Panel */}
        <SystemHealth />
      </main>
    </div>
  );
};

export default ProfilePage;
