import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";

function Home() {
  const { 
    instagramAPI, 
    setAccessToken, 
    engagementData, 
    loading, 
    error, 
    fetchEngagementData,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval
  } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState(null);

  // Cargar token desde .env al montar
  useEffect(() => {
    const token = import.meta.env.VITE_IG_TOKEN;
    if (token) {
      setAccessToken(token);
    }
  }, [setAccessToken]);

  // Cargar datos de usuario cuando la API esté lista
  useEffect(() => {
    if (instagramAPI) {
      loadUserData();
    }
  }, [instagramAPI]);

  // Auto-refresh para followers
  useEffect(() => {
    if (autoRefresh && instagramAPI) {
      const interval = setInterval(() => {
        loadUserData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, instagramAPI]);

  const loadUserData = async () => {
    try {
      const info = await instagramAPI.getUserInfo();
      setUserInfo(info);
      await fetchEngagementData();
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };



  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>🚀 Dashboard de Conectados x Mza Futura Valle de Uco</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Análisis de engagement y estadísticas de tu cuenta</p>
        {userInfo && (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            marginTop: '20px'
          }}>
            {/* Foto de perfil */}
            {userInfo.profile_picture_url && (
              <img 
                src={userInfo.profile_picture_url} 
                alt="Profile"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '4px solid #0095f6',
                  boxShadow: '0 4px 12px rgba(0,149,246,0.3)',
                  objectFit: 'cover'
                }}
              />
            )}
            
            {/* Contador de seguidores y botón de seguir */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '20px',
                fontWeight: '500',
                color: '#666'
              }}>
                <img src="/followers.png" alt="Followers" style={{ width: '32px', height: '32px', opacity: 0.8 }} />
                <span>{userInfo.followers_count?.toLocaleString() || 'N/A'} Seguidores</span>
              </div>

              <a 
                href={`https://www.instagram.com/${userInfo.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  padding: '12px 32px', 
                  backgroundColor: '#0095f6', 
                  color: 'white', 
                  borderRadius: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(0,149,246,0.3)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,149,246,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,149,246,0.3)';
                }}
              >
                <img src="/plus.svg" alt="Plus" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                <span>Seguir</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Auto-refresh */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {autoRefresh && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '3px',
            backgroundColor: '#0095f6',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        )}
        <style>{`
          @keyframes pulse {
            0%, 100% { width: 0%; opacity: 0.3; }
            50% { width: 100%; opacity: 0.6; }
          }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: '500' }}>🔄 Auto-actualización</span>
          </label>
          
          <select 
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            disabled={!autoRefresh}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              cursor: autoRefresh ? 'pointer' : 'not-allowed',
              opacity: autoRefresh ? 1 : 0.6
            }}
          >
            <option value={5000}>Cada 5 segundos</option>
            <option value={10000}>Cada 10 segundos</option>
            <option value={30000}>Cada 30 segundos</option>
            <option value={60000}>Cada 1 minuto</option>
            <option value={300000}>Cada 5 minutos</option>
          </select>
        </div>

        <button
          onClick={fetchEngagementData}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#ccc' : '#0095f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          {loading ? '⏳ Actualizando...' : '🔄 Actualizar Ahora'}
        </button>
      </div>
      
      {error && (
        <div style={{ color: 'red', padding: '15px', border: '2px solid red', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          padding: '40px 20px', 
          backgroundColor: '#fff', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          order: window.innerWidth <= 768 ? 1 : 2
        }}>
          <h2 style={{ marginTop: 0, color: '#0095f6', fontSize: '28px' }}>📸 Ir al concurso de video pitch</h2>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '400px', margin: 0 }}>
            Explora todos los posts del concurso ordenados por engagement, likes o comentarios
          </p>
          <Link 
            to="/posts"
            style={{
              padding: '16px 40px',
              backgroundColor: '#0095f6',
              color: 'white',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,149,246,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,149,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,149,246,0.3)';
            }}
          >
            Ver Posts
          </Link>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', order: window.innerWidth <= 768 ? 2 : 1 }}>
          <h2 style={{ marginTop: 0, color: '#0095f6' }}>🚀 Conectados por Mendoza Futura</h2>
          <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#555' }}>
            <p>Conectados por Mendoza Futura es una iniciativa del <strong>Gobierno de la Provincia de Mendoza</strong> coordinada por la Dirección General de Escuelas y el Ministerio de Producción.</p>
            <p>Se trata de una formación dirigida a estudiantes de 15 a 18 años, centrada en programación, biotecnología, robótica, producción audiovisual, turismo y logística, diseñada para fomentar las habilidades del Siglo XXI: pensamiento crítico, pensamiento creativo, colaboración, comunicación en entornos digitales, carácter y ciudadanía.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;