import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface ServiceStatus {
  name: string;
  id: string;
  status: 'healthy' | 'unhealthy' | 'loading';
  url: string;
}

/**
 * Componente SystemHealth
 * Muestra el estado técnico detallado (ADMIN) o simplificado (USER) de los microservicios.
 */
const SystemHealth: React.FC = () => {
  // Obtenemos el rol para aplicar lógica de visibilidad condicional (HU-12)
  const { role } = useAuth();
  
  // Lista de servicios a monitorear con sus respectivos endpoints de salud
  const [services, setServices] = useState<ServiceStatus[]>([
    { id: 'gateway', name: 'API Gateway', status: 'loading', url: 'http://127.0.0.1:8000/health' },
    { id: 'auth', name: 'Autenticación', status: 'loading', url: 'http://127.0.0.1:8000/api/v1/auth/health' },
    { id: 'ingestion', name: 'Ingestión de Datos', status: 'loading', url: 'http://127.0.0.1:8000/api/v1/ingestion/health' },
    { id: 'transformation', name: 'Procesamiento', status: 'loading', url: 'http://127.0.0.1:8000/api/v1/transformation/health' },
    { id: 'analytics', name: 'Analítica', status: 'loading', url: 'http://127.0.0.1:8000/api/v1/analytics/health' },
  ]);
  const [lastCheck, setLastCheck] = useState<string>('');

  /**
   * Ejecuta peticiones fetch paralelas a todos los servicios.
   */
  const checkHealth = async () => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const res = await fetch(service.url, { cache: 'no-store' });
          return { ...service, status: res.ok ? 'healthy' : 'unhealthy' as any };
        } catch {
          return { ...service, status: 'unhealthy' as any };
        }
      })
    );
    setServices(updatedServices);
    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkHealth();
    // Re-verificación periódica cada 30 segundos
    const interval = setInterval(checkHealth, 30000); 
    return () => clearInterval(interval);
  }, []);

  // Lógica para determinar el estado global simplificado
  const allHealthy = services.every(s => s.status === 'healthy');
  const someUnhealthy = services.some(s => s.status === 'unhealthy');

  return (
    <div className="system-health-panel" style={{
      marginTop: '2rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>
          <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          {/* Título dinámico según el rol */}
          {role === 'ADMIN' ? 'Estado Integral del Sistema' : 'Estado del Servicio'}
        </h3>
        {lastCheck && (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', opacity: 0.7 }}>
            Última validación: {lastCheck}
          </span>
        )}
      </div>

      {role === 'ADMIN' ? (
        /* VISTA ADMINISTRADOR: Desglose técnico de microservicios */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {services.map((s) => (
            <div key={s.id} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              transition: 'transform 0.2s ease',
              cursor: 'default'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 500 }}>{s.name}</span>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: s.status === 'healthy' ? '#10b981' : s.status === 'loading' ? '#f59e0b' : '#ef4444',
                  boxShadow: s.status === 'healthy' ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none',
                }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  color: s.status === 'healthy' ? '#fff' : '#94a3b8'
                }}>
                  {s.status === 'loading' ? 'Verificando...' : s.status === 'healthy' ? 'Operativo' : 'Sin Respuesta'}
                </span>
                {s.status === 'healthy' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VISTA USUARIO: Resumen simplificado de alto nivel */
        <div style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: allHealthy ? 'rgba(16, 185, 129, 0.1)' : someUnhealthy ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${allHealthy ? '#10b981' : someUnhealthy ? '#ef4444' : '#f59e0b'}`,
            boxShadow: allHealthy ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
          }}>
             {allHealthy ? (
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
               </svg>
             ) : (
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={someUnhealthy ? "#ef4444" : "#f59e0b"} strokeWidth="2.5">
                 <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
               </svg>
             )}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>
              {allHealthy ? 'Sistema Totalmente Operativo' : someUnhealthy ? 'Incidencias en el Servicio' : 'Verificando Sistema...'}
            </h4>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {allHealthy 
                ? 'Todos los componentes de análisis y carga de datos están funcionando correctamente. Puedes trabajar con normalidad.' 
                : someUnhealthy 
                ? 'Estamos experimentando algunas dificultades técnicas en ciertos módulos. Algunas funciones podrían no estar disponibles.' 
                : 'Estamos validando la conexión con los servidores de análisis...'}
            </p>
          </div>
        </div>
      )}
      
      {role === 'ADMIN' && (
        /* Leyenda de colores exclusiva para administradores */
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Saludable</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>En Carga</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Interrupción</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
