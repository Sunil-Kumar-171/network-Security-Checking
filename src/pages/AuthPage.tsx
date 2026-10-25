import { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Page = 'home' | 'auth' | 'dashboard';

interface AuthPageProps {
  onNavigate: (page: Page) => void;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'WEAK', color: '#ff0040' };
  if (score <= 3) return { score, label: 'MODERATE', color: '#ffd700' };
  return { score, label: 'STRONG', color: '#00ff88' };
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

  const { signIn, signUp } = useAuth();

  const pwStrength = getPasswordStrength(form.password);

  const validate = () => {
    const errs: { email?: string; password?: string; confirm?: string } = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters required';
    if (tab === 'signup') {
      if (!form.confirm) errs.confirm = 'Please confirm your password';
      else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setSuccessMsg('');
    setLoading(true);

    if (tab === 'login') {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        setServerError(error);
      } else {
        onNavigate('dashboard');
      }
    } else {
      const { error } = await signUp(form.email, form.password);
      if (error) {
        setServerError(error);
      } else {
        setSuccessMsg('Account created! You can now access the dashboard.');
        setTimeout(() => onNavigate('dashboard'), 1500);
      }
    }

    setLoading(false);
  };

  const update = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setServerError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-grid">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(0,255,136,0.04) 0%, transparent 70%)' }} />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 relative"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
            <Shield size={32} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.6))' }} />
            <div className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ background: 'rgba(0,255,136,0.5)' }} />
          </div>
          <h1 className="text-2xl font-bold font-mono mb-1" style={{ color: '#e0e8f0' }}>
            {tab === 'login' ? 'SECURE ACCESS' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-sm" style={{ color: '#8899aa' }}>
            {tab === 'login' ? 'Authentication required to access dashboard' : 'Register to start monitoring your security'}
          </p>
        </div>

        <div className="cyber-card p-8 fade-delay-1">
          {/* Tab switcher */}
          <div className="flex rounded overflow-hidden mb-8" style={{ border: '1px solid rgba(0,255,136,0.2)' }}>
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); setServerError(''); setSuccessMsg(''); }}
                className="flex-1 py-3 text-xs font-mono font-bold tracking-widest transition-all duration-300"
                style={{
                  background: tab === t ? 'rgba(0,255,136,0.15)' : 'transparent',
                  color: tab === t ? '#00ff88' : '#8899aa',
                  borderRight: t === 'login' ? '1px solid rgba(0,255,136,0.2)' : 'none',
                  textShadow: tab === t ? '0 0 8px rgba(0,255,136,0.5)' : 'none',
                }}
              >
                {t === 'login' ? 'LOGIN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          {serverError && (
            <div className="flex items-center gap-2 p-3 rounded mb-6 text-sm font-mono"
              style={{ background: 'rgba(255,0,64,0.08)', border: '1px solid rgba(255,0,64,0.3)', color: '#ff0040' }}>
              <AlertTriangle size={14} />
              {serverError}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded mb-6 text-sm font-mono"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88' }}>
              <CheckCircle size={14} />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono mb-2 tracking-widest" style={{ color: '#8899aa' }}>EMAIL ADDRESS</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8899aa' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="operator@cyberguard.io"
                  className="cyber-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              {errors.email && <p className="text-xs mt-1 font-mono" style={{ color: '#ff0040' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono mb-2 tracking-widest" style={{ color: '#8899aa' }}>PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8899aa' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Enter secure password"
                  className="cyber-input"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#8899aa' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#00ff88'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8899aa'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 font-mono" style={{ color: '#ff0040' }}>{errors.password}</p>}

              {tab === 'signup' && form.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono" style={{ color: '#8899aa' }}>PASSWORD STRENGTH</span>
                    <span className="text-xs font-mono font-bold" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{
                      width: `${(pwStrength.score / 5) * 100}%`,
                      background: pwStrength.color,
                      boxShadow: `0 0 8px ${pwStrength.color}60`,
                    }} />
                  </div>
                </div>
              )}
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-mono mb-2 tracking-widest" style={{ color: '#8899aa' }}>CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8899aa' }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={e => update('confirm', e.target.value)}
                    placeholder="Repeat password"
                    className="cyber-input"
                    style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#8899aa' }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs mt-1 font-mono" style={{ color: '#ff0040' }}>{errors.confirm}</p>}
              </div>
            )}

            {tab === 'signup' && (
              <div className="rounded p-3 text-xs font-mono space-y-1"
                style={{ background: 'rgba(0,204,255,0.05)', border: '1px solid rgba(0,204,255,0.15)' }}>
                <p style={{ color: '#00ccff' }}>PASSWORD REQUIREMENTS:</p>
                {[
                  { label: 'At least 8 characters', met: form.password.length >= 8 },
                  { label: 'Uppercase letter', met: /[A-Z]/.test(form.password) },
                  { label: 'Number (0-9)', met: /[0-9]/.test(form.password) },
                  { label: 'Special character (!@#$...)', met: /[^A-Za-z0-9]/.test(form.password) },
                ].map(req => (
                  <div key={req.label} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: req.met ? '#00ff88' : '#8899aa' }} />
                    <span style={{ color: req.met ? '#00ff88' : '#8899aa' }}>{req.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-3 transition-all duration-300"
              style={{
                background: loading ? 'rgba(0,255,136,0.06)' : 'linear-gradient(135deg, rgba(0,255,136,0.18), rgba(0,204,255,0.18))',
                border: '1px solid #00ff88',
                color: '#00ff88',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(0,255,136,0.25)')}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
            >
              {loading ? (
                <><div className="spinner w-4 h-4" />AUTHENTICATING...</>
              ) : (
                <>{tab === 'login' ? <><Lock size={16} />ACCESS SYSTEM</> : <><User size={16} />CREATE ACCOUNT</>}</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-mono" style={{ color: '#8899aa' }}>
              {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button
                onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setErrors({}); setServerError(''); }}
                className="transition-colors duration-200 underline"
                style={{ color: '#00ccff' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#00ff88'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#00ccff'}
              >
                {tab === 'login' ? 'Create account' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 fade-delay-2">
          {[
            { icon: Shield, text: 'Encrypted' },
            { icon: Lock, text: 'Secure' },
            { icon: CheckCircle, text: 'Verified' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon size={12} style={{ color: '#00ff88' }} />
              <span className="text-xs font-mono" style={{ color: '#8899aa' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
