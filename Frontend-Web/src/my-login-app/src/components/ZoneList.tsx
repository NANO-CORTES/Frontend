import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

interface Zone {
  zone_code: string;
  zone_name: string;
  department?: string;
  population?: number;
  area_km2?: number;
}

interface ZoneListProps {
  department: string;
}

const ZoneList: React.FC<ZoneListProps> = ({ department }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!department) {
      setZones([]);
      return;
    }

    const fetchZones = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/ingestion/datasets?department=${encodeURIComponent(department)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error('Error al cargar zonas');
        const data = await res.json();
        setZones(Array.isArray(data) ? data : []);
      } catch {
        // Si no hay datos disponibles, mostrar estado vacío sin error crítico
        setZones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, [department, token]);

  if (!department) return null;

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>
          Zonas de {department}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
            <span className="spinner" />
            Cargando zonas...
          </div>
        ) : error ? (
          <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</p>
        ) : zones.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#475569',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.75rem', opacity: 0.5 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p style={{ fontSize: '0.9rem' }}>
              No hay datos de zonas para <strong style={{ color: '#64748b' }}>{department}</strong>.
            </p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Sube un archivo CSV o JSON con el botón <strong>↑</strong> para agregar datos.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {zones.map((zone) => (
              <div
                key={zone.zone_code}
                style={{
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: '12px',
                  padding: '1rem',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)';
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {zone.zone_code}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                  {zone.zone_name}
                </div>
                {zone.population && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Población: <span style={{ color: '#94a3b8' }}>{zone.population.toLocaleString()}</span>
                  </div>
                )}
                {zone.area_km2 && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Área: <span style={{ color: '#94a3b8' }}>{zone.area_km2} km²</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneList;
