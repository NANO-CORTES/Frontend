import React from 'react';

interface TerritoriosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerritoriosModal: React.FC<TerritoriosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(99,102,241,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>
              Territorios de Colombia
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.375rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          Selecciona un departamento en el panel principal para filtrar y visualizar los territorios y zonas asociadas con sus datos socioecónomicos e infraestructura.
        </p>

        <div style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '10px',
          padding: '1rem',
          fontSize: '0.875rem',
          color: '#a5b4fc',
        }}>
          <strong>Nota:</strong> Los datos territoriales son actualizados mediante la carga de archivos CSV y JSON desde el botón flotante de la pantalla principal.
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default TerritoriosModal;
