import { useState } from 'react';
import { Shield, Menu, X, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Page = 'home' | 'auth' | 'dashboard';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  interface NavLink {
    id: 'home' | 'dashboard';
    label: string;
    protected?: boolean;
  }
  const navLinks: NavLink[] = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard', protected: true },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-blur border-b" style={{ borderColor: 'rgba(0,255,136,0.12)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
            <div className="relative">
              <Shield size={28} className="text-[#00ff88]" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.6))' }} />
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'rgba(0,255,136,0.3)' }} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider" style={{ color: '#00ff88', fontFamily: 'monospace', textShadow: '0 0 8px rgba(0,255,136,0.5)' }}>
                CYBERGUARD
              </span>
              <span className="text-xs block" style={{ color: '#8899aa', letterSpacing: '3px', fontSize: '9px' }}>SECURITY SYSTEMS</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              (!link.protected || user) && (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="relative text-sm font-medium tracking-wider transition-all duration-300 group"
                  style={{
                    color: currentPage === link.id ? '#00ff88' : '#8899aa',
                    fontFamily: 'monospace',
                    textShadow: currentPage === link.id ? '0 0 8px rgba(0,255,136,0.6)' : 'none',
                  }}
                >
                  {link.label.toUpperCase()}
                  <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style={{ background: '#00ff88' }} />
                </button>
              )
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono" style={{ color: '#8899aa' }}>
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded text-sm font-mono transition-all duration-300"
                  style={{ border: '1px solid rgba(255,0,64,0.4)', color: '#ff0040' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,64,0.1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(255,0,64,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <LogOut size={14} />
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="flex items-center gap-2 px-5 py-2 rounded text-sm font-mono transition-all duration-300"
                style={{ border: '1px solid #00ff88', color: '#00ff88' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,136,0.1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0,255,136,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <Lock size={14} />
                SECURE LOGIN
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            style={{ color: '#00ff88' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(0,255,136,0.12)', background: 'rgba(5,8,16,0.98)' }}>
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              (!link.protected || user) && (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="text-left text-sm font-mono tracking-widest py-2"
                  style={{ color: currentPage === link.id ? '#00ff88' : '#8899aa' }}
                >
                  {link.label.toUpperCase()}
                </button>
              )
            ))}
            {user ? (
              <button onClick={handleSignOut} className="text-left text-sm font-mono py-2" style={{ color: '#ff0040' }}>
                LOGOUT
              </button>
            ) : (
              <button onClick={() => handleNav('auth')} className="text-left text-sm font-mono py-2" style={{ color: '#00ff88' }}>
                SECURE LOGIN
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
