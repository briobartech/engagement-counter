import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from '../pages/Home.jsx';
import Posts from '../pages/Posts.jsx';

function AppRoutes() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter basename="/engagement-counter">
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .burger-button { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-menu { display: flex !important; }
          .burger-button { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <nav style={{
        padding: '15px 20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        marginBottom: '20px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#333', fontSize: 'clamp(16px, 3vw, 20px)' }}>
            CxMzaFutura VdU
          </h3>
          
          {/* Menú Desktop */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '15px' }}>
            <Link 
              to="/" 
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#0095f6',
                color: 'white',
                fontWeight: '500'
              }}
            >
              🏠 Inicio
            </Link>
            <Link 
              to="/posts" 
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#0095f6',
                color: 'white',
                fontWeight: '500'
              }}
            >
              📊 Posts
            </Link>
          </div>

          {/* Burger Button */}
          <button
            className="burger-button"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              zIndex: 1001
            }}
            aria-label="Menu"
          >
            <span style={{
              width: '25px',
              height: '3px',
              backgroundColor: '#333',
              borderRadius: '2px',
              transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none'
            }}></span>
            <span style={{
              width: '25px',
              height: '3px',
              backgroundColor: '#333',
              borderRadius: '2px',
              transition: 'all 0.3s',
              opacity: menuOpen ? 0 : 1
            }}></span>
            <span style={{
              width: '25px',
              height: '3px',
              backgroundColor: '#333',
              borderRadius: '2px',
              transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none'
            }}></span>
          </button>
        </div>

        {/* Menú Mobile */}
        {menuOpen && (
          <div 
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              zIndex: 1000,
              borderTop: '1px solid #ddd'
            }}
          >
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '15px 20px',
                color: '#333',
                fontWeight: '500',
                borderBottom: '1px solid #eee',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f8f8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🏠 Inicio
            </Link>
            <Link 
              to="/posts" 
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '15px 20px',
                color: '#333',
                fontWeight: '500',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f8f8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              📊 Posts
            </Link>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;