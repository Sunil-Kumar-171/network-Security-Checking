import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

type Page = 'home' | 'auth' | 'dashboard';

function AppInner() {
  const [page, setPage] = useState<Page>('home');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && page === 'auth') {
      setPage('dashboard');
    }
  }, [user, loading, page]);

  const navigate = (p: Page) => {
    if (p === 'dashboard' && !user) {
      setPage('auth');
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050810' }}>
        <div className="text-center">
          <div className="spinner w-10 h-10 mx-auto mb-4" />
          <p className="font-mono text-sm" style={{ color: '#00ff88' }}>INITIALIZING SECURE ENVIRONMENT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050810' }}>
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} isAuthenticated={!!user} />}
        {page === 'auth' && <AuthPage onNavigate={navigate} />}
        {page === 'dashboard' && user && <DashboardPage />}
        {page === 'dashboard' && !user && <AuthPage onNavigate={navigate} />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
