import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import Card from "../components/Card.jsx";

function Posts() {
  const { 
    instagramAPI, 
    setAccessToken,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval
  } = useContext(AppContext);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('engagement'); // 'engagement', 'likes', 'comments'

  useEffect(() => {
    const token = import.meta.env.VITE_IG_TOKEN;
    if (token) {
      setAccessToken(token);
    }
  }, [setAccessToken]);

  useEffect(() => {
    if (instagramAPI) {
      loadMedia();
    }
  }, [instagramAPI]);

  // Auto-refresh para posts
  useEffect(() => {
    if (autoRefresh && instagramAPI) {
      const interval = setInterval(() => {
        loadMedia(true); // silent mode
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, instagramAPI]);

  const loadMedia = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const media = await instagramAPI.getUserMedia(50);
      setMediaList(media.data || []);
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getSortedMedia = () => {
    const sorted = [...mediaList];
    
    switch(sortBy) {
      case 'likes':
        return sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      case 'comments':
        return sorted.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
      case 'engagement':
      default:
        return sorted.sort((a, b) => {
          const engagementA = (a.like_count || 0) + (a.comments_count || 0);
          const engagementB = (b.like_count || 0) + (b.comments_count || 0);
          return engagementB - engagementA;
        });
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomThumbnail = (caption) => {
    if (!caption) return null;
    
    // Buscar texto entre comillas
    const match = caption.match(/"([^"]+)"/);
    if (!match) return null;
    
    const text = match[1];
    // Convertir a minúsculas y espacios a guiones bajos
    const filename = text.toLowerCase().replace(/\s+/g, '_') + '.jpg';
    
    return `/${filename}`;
  };

  const sortedMedia = getSortedMedia();

  return (
    <div style={{ 
      padding: '10px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1400px', 
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Card 
        icon="/icon.jpg"
        icon2="/vdu-logo.jpg"
        title="Concurso de Video Pitch"
        subtitle="El video con más interacciones se llevará una churrera a pilas"
      />

      {/* Panel de control */}
      <div style={{
        padding: '12px 15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
          onClick={loadMedia}
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
          {loading ? '⏳ Actualizando...' : '🔄 Actualizar ahora'}
        </button>
      </div>

      <div style={{ 
        marginBottom: '12px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 24px)' }}>📸 Ranking de Posts</h2>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '500' }}>Ordenar por:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="engagement">📊 Engagement Total</option>
            <option value="likes">❤️ Likes</option>
            <option value="comments">💬 Comentarios</option>
          </select>
        </div>
      </div>

      {loading && <p>Cargando posts...</p>}

      {sortedMedia.length > 0 && (
        <div>
          <p style={{ color: '#666', marginBottom: '12px', fontSize: '13px' }}>
            {sortedMedia.length} posts ordenados por {
              sortBy === 'engagement' ? 'engagement total' : 
              sortBy === 'likes' ? 'likes' : 
              'comentarios'
            }
          </p>

          {/* Top 3 en grid compacto */}
          <style>{`
            @media (max-width: 768px) {
              .top-posts-grid {
                display: flex !important;
                flex-direction: column;
              }
              .first-place {
                order: 1;
              }
              .second-third-grid {
                order: 2;
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 12px !important;
              }
            }
            @media (min-width: 769px) {
              .top-posts-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
              }
              .second-third-grid {
                display: contents;
              }
            }
          `}</style>
          <div className="top-posts-grid" style={{ marginBottom: '15px', gap: '12px' }}>
            {/* Primer lugar */}
            {sortedMedia.slice(0, 1).map((media) => {
              const engagement = (media.like_count || 0) + (media.comments_count || 0);
              
              return (
                <div 
                  key={media.id}
                  className="first-place"
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px', 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    position: 'relative',
                    minHeight: '200px'
                  }}
                >
                  {/* Medalla en esquina superior */}
                  <img 
                    src='/first-place.svg'
                    alt="1er lugar"
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '45px',
                      height: '45px',
                      zIndex: 1,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  />

                  {/* Miniatura centrada */}
                  <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <img 
                      src={getCustomThumbnail(media.caption) || (media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url)} 
                      alt="thumbnail" 
                      style={{ width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Descripción */}
                  {media.caption && (
                    <p style={{ 
                      margin: '8px 0', 
                      fontSize: '12px', 
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4'
                    }}>
                      {media.caption}
                    </p>
                  )}

                  {/* Estadísticas compactas */}
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px' }}>❤️</div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#e91e63' }}>
                        {media.like_count || 0}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px' }}>💬</div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2196f3' }}>
                        {media.comments_count || 0}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px' }}>📊</div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#4caf50' }}>
                        {engagement}
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                    <a 
                      href={media.permalink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        flex: 1,
                        padding: '5px 8px',
                        backgroundColor: '#0095f6',
                        color: 'white',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}
                    >
                      Ver post
                    </a>
                    <button
                      onClick={() => {
                        const shareText = `¡Mira este post de Instagram!\n${media.caption ? media.caption.substring(0, 100) + '...' : ''}\n\n${media.permalink}`;
                        if (navigator.share) {
                          navigator.share({
                            title: 'Post de Instagram',
                            text: shareText,
                            url: media.permalink
                          }).catch(() => {
                            navigator.clipboard.writeText(media.permalink);
                            alert('¡Link copiado!');
                          });
                        } else {
                          navigator.clipboard.writeText(media.permalink);
                          alert('¡Link copiado!');
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '5px 8px',
                        backgroundColor: '#25D366',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Compartir
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Segundo y tercer lugar */}
            <div className="second-third-grid">
              {sortedMedia.slice(1, 3).map((media, index) => {
                const engagement = (media.like_count || 0) + (media.comments_count || 0);
                
                return (
                  <div 
                    key={media.id}
                    style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '12px', 
                      backgroundColor: '#fff', 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative',
                      minHeight: '200px'
                    }}
                  >
                    {/* Medalla en esquina superior */}
                    <img 
                      src={index === 0 ? '/second-place.svg' : '/third-place.svg'}
                      alt={`${index + 2} lugar`}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '45px',
                        height: '45px',
                        zIndex: 1,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }}
                    />

                    {/* Miniatura centrada */}
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                      <img 
                        src={getCustomThumbnail(media.caption) || (media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url)} 
                        alt="thumbnail" 
                        style={{ width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain', borderRadius: '6px' }}
                      />
                    </div>

                    {/* Descripción */}
                    {media.caption && (
                      <p style={{ 
                        margin: '8px 0', 
                        fontSize: '12px', 
                        color: '#666',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4'
                      }}>
                        {media.caption}
                      </p>
                    )}

                    {/* Estadísticas compactas */}
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-around',
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px' }}>❤️</div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#e91e63' }}>
                          {media.like_count || 0}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px' }}>💬</div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2196f3' }}>
                          {media.comments_count || 0}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px' }}>📊</div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#4caf50' }}>
                          {engagement}
                        </div>
                      </div>
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                      <a 
                        href={media.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          flex: 1,
                          padding: '5px 8px',
                          backgroundColor: '#0095f6',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          textAlign: 'center',
                          fontWeight: '500'
                        }}
                      >
                        Ver post
                      </a>
                      <button
                        onClick={() => {
                          const shareText = `¡Mira este post de Instagram!\n${media.caption ? media.caption.substring(0, 100) + '...' : ''}\n\n${media.permalink}`;
                          if (navigator.share) {
                            navigator.share({
                              title: 'Post de Instagram',
                              text: shareText,
                              url: media.permalink
                            }).catch(() => {
                              navigator.clipboard.writeText(media.permalink);
                              alert('¡Link copiado!');
                            });
                          } else {
                            navigator.clipboard.writeText(media.permalink);
                            alert('¡Link copiado!');
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          backgroundColor: '#25D366',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Compartir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resto de posts en lista vertical */}
          <style>{`
            @media (max-width: 768px) {
              .rest-post-thumbnail {
                width: 80px !important;
                height: 80px !important;
              }
              .rest-post-badge {
                width: 24px !important;
                height: 24px !important;
                font-size: 11px !important;
              }
              .rest-post-content {
                font-size: 12px !important;
              }
              .rest-post-stats {
                font-size: 11px !important;
                padding: 4px 8px !important;
              }
              .rest-post-caption {
                -webkit-line-clamp: 2 !important;
              }
            }
          `}</style>
          <div style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
            {sortedMedia.slice(3).map((media, index) => {
              const actualIndex = index + 3;
              const engagement = (media.like_count || 0) + (media.comments_count || 0);
              
              return (
                <div 
                  key={media.id} 
                  style={{ 
                    display: 'flex', 
                    padding: '12px', 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    gap: '15px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Ranking Badge */}
                  <div style={{
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    <div 
                      className="rest-post-badge"
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        left: '-5px',
                        backgroundColor: '#0095f6',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        zIndex: 1,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      {actualIndex + 1}
                    </div>

                    {/* Miniatura */}
                    <img 
                      src={getCustomThumbnail(media.caption) || (media.media_type === 'VIDEO' ? media.thumbnail_url : media.media_url)} 
                      alt="thumbnail" 
                      className="rest-post-thumbnail"
                      style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '8px' }}
                    />
                  </div>

                  {/* Información */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '5px' }}>
                      <span 
                        className="rest-post-content"
                        style={{ 
                          padding: '4px 10px', 
                          backgroundColor: '#e3f2fd', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {media.media_type}
                      </span>
                      <span className="rest-post-content" style={{ fontSize: '13px', color: '#999' }}>
                        📅 {formatDate(media.timestamp)}
                      </span>
                    </div>

                    <p 
                      className="rest-post-content rest-post-caption"
                      style={{ 
                        margin: '10px 0', 
                        fontSize: '14px', 
                        color: '#333',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.5'
                      }}
                    >
                      {media.caption || 'Sin descripción'}
                    </p>

                    {/* Estadísticas */}
                    <div 
                      className="rest-post-stats"
                      style={{ 
                        display: 'flex',
                        gap: '15px', 
                        marginTop: '15px',
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#666'
                      }}
                    >
                      <span>❤️ <strong style={{ color: '#e91e63' }}>{media.like_count || 0}</strong></span>
                      <span>💬 <strong style={{ color: '#2196f3' }}>{media.comments_count || 0}</strong></span>
                      <span>📊 <strong style={{ color: '#4caf50' }}>{engagement}</strong></span>
                    </div>

                    {/* Botones de acciones */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      marginTop: '12px' 
                    }}>
                      <a 
                        href={media.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#0095f6',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '13px',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Ver en Instagram →
                      </a>
                      
                      <button
                        onClick={() => {
                          const shareText = `¡Mira este post de Instagram!\n${media.caption ? media.caption.substring(0, 100) + '...' : ''}\n\n${media.permalink}`;
                          if (navigator.share) {
                            navigator.share({
                              title: 'Post de Instagram',
                              text: shareText,
                              url: media.permalink
                            }).catch(() => {
                              navigator.clipboard.writeText(media.permalink);
                              alert('¡Link copiado al portapapeles!');
                            });
                          } else {
                            navigator.clipboard.writeText(media.permalink);
                            alert('¡Link copiado al portapapeles!');
                          }
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#25D366',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        🔗 Compartir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
