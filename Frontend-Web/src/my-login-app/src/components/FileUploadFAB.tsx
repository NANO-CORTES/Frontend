import React, { useRef, useState } from 'react';
import { useAuth } from './AuthProvider';

/**
 * Componente FileUploadFAB
 * Botón flotante (FAB) para la subida de archivos con seguimiento de progreso en tiempo real.
 */
const FileUploadFAB: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Estado para el % de carga
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const { token } = useAuth();

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 7000);
  };

  const handleFabClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Manejador de cambio de archivo.
   * Utiliza XMLHttpRequest en lugar de fetch porque fetch no soporta eventos de progreso de subida.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica de extensión
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      showToast('error', 'Por favor selecciona un archivo .csv o .json válido.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // EVENTO DE PROGRESO: Calcula el porcentaje subido al servidor
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    // EVENTO DE CARGA FINALIZADA (Respuesta del servidor)
    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(0);

      if (xhr.status >= 200 && xhr.status < 300) {
        showToast('success', `¡Carga Finalizada! El archivo "${file.name}" se subió correctamente al 100%.`);
      } else {
        // Manejo de errores detallado (parseo de respuesta FastAPI)
        let errorMsg = `Error ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText);
          if (typeof errData.detail === 'string') {
            errorMsg = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errorMsg = errData.detail.map((e: any) => e.msg).join('. ');
          }
        } catch {
          errorMsg = xhr.statusText || errorMsg;
        }
        showToast('error', errorMsg);
      }

      // Limpia el input para permitir subir el mismo archivo de nuevo si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      showToast('error', 'Error de red o conexión al servidor de análisis.');
    };

    // Configuración de la petición POST al microservicio de ingestión a través del Gateway
    xhr.open('POST', 'http://127.0.0.1:8000/api/v1/ingestion/datasets/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  return (
    <>
      {/* Input oculto activado por el botón circular */}
      <input
        type="file"
        accept=".csv,.json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Overlay de Progreso: Aparece solo mientras se sube el archivo */}
      {isUploading && (
        <div style={{
          position: 'fixed',
          bottom: '8rem',
          right: '2rem',
          width: '260px',
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 1100,
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>Cargando archivo...</span>
            <span style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 700 }}>{uploadProgress}%</span>
          </div>
          {/* Barra de progreso visual */}
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              transition: 'width 0.3s ease-out',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
            }} />
          </div>
        </div>
      )}

      {/* Toast de notificación mejorado para visibilidad de errores/éxito */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '2rem',
          maxWidth: '360px',
          background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          borderLeftWidth: '4px',
          borderRadius: '12px',
          padding: '1rem',
          color: '#fff',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          zIndex: 1200,
          animation: 'fadeInUp 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {toast.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span style={{ fontWeight: 500 }}>{toast.msg}</span>
          </div>
          
          {toast.type === 'error' && (
            <div style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem' }}>
              Asegúrate de que el CSV tenga las columnas requeridas (zone_code, zone_name) para la validación territorial.
            </div>
          )}
        </div>
      )}

      {/* Botón Circular (FAB) principal */}
      <button
        className="fab-upload"
        onClick={handleFabClick}
        disabled={isUploading}
        title="Subir Dataset (.csv, .json)"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isUploading
            ? 'rgba(99,102,241,0.5)'
            : 'linear-gradient(135deg, #6366f1, #818cf8)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1000,
          opacity: isUploading ? 0.7 : 1,
        }}
        onMouseOver={(e) => { if (!isUploading) e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
      >
        {isUploading ? (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3.5px' }}></span>
            <span style={{ position: 'absolute', fontSize: '8px', fontWeight: 800 }}>{uploadProgress}%</span>
          </div>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </button>
    </>
  );
};

export default FileUploadFAB;
