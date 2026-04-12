import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente SystemStatusBadge
 * Pequeño indicador visual en la cabecera que muestra si el Gateway está respondiendo.
 * Sirve como punto de entrada rápido al panel de salud detallado.
 */
const SystemStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const navigate = useNavigate();

  /**
   * Verifica la salud del Gateway.
   * Si el Gateway responde, asumimos que el sistema base está arriba.
   */
  const checkGlobalHealth = async () => {
    try {
      // Consultamos el endpoint /health del BFF Gateway
      const res = await fetch('http://127.0.0.1:8000/health', { cache: 'no-store' });
      setStatus(res.ok ? 'online' : 'offline');
    } catch {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkGlobalHealth();
    // Re-validación automática cada 60 segundos para no saturar el servidor
    const interval = setInterval(checkGlobalHealth, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      onClick={() => navigate('/profile')} // Al hacer clic lleva al perfil para ver el detalle
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
      title="Estado del Sistema (Clic para detalles técnicos)"
    >
      {/* Círculo indicador con animación de pulso si está online */}
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: status === 'online' ? '#10b981' : status === 'loading' ? '#f59e0b' : '#ef4444',
        boxShadow: status === 'online' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
        animation: status === 'online' ? 'pulse-green 2s infinite' : 'none'
      }} />
      <span style={{ 
        fontSize: '0.75rem', 
        fontWeight: 600, 
        color: status === 'online' ? '#10b981' : '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
      }}>
        {status === 'loading' ? 'Iniciando...' : status === 'online' ? 'Sistema Online' : 'Desconectado'}
      </span>

      {/* Definición de la animación de pulso en CSS-in-JS */}
      <style>{`
        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
};

export default SystemStatusBadge;
