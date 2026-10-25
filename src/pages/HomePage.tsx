import { useEffect, useRef } from 'react';
import { Shield, Cloud, Cpu, Lock, Eye, Zap, ChevronRight, Database, Server, Globe } from 'lucide-react';
import MatrixRain from '../components/MatrixRain';
import SecurityCheck from '../components/SecurityCheck';

type Page = 'home' | 'auth' | 'dashboard';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="cyber-card p-6 text-center">
      <Icon size={24} className="mx-auto mb-3" style={{ color: '#00ccff' }} />
      <div className="text-3xl font-bold font-mono mb-1 text-glow-green" style={{ color: '#00ff88' }}>{value}</div>
      <div className="text-xs tracking-widest uppercase" style={{ color: '#8899aa' }}>{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: React.ElementType; title: string; description: string; color: string }) {
  return (
    <div className="cyber-card p-6">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <h3 className="text-base font-bold mb-2" style={{ color: '#e0e8f0' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#8899aa' }}>{description}</p>
    </div>
  );
}

export default function HomePage({ onNavigate, isAuthenticated }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', onMouseMove);
    return () => el.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid"
        style={{ paddingTop: '80px' }}>
        <MatrixRain />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(0,255,136,0.05) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-mono tracking-widest fade-in-up"
            style={{ border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', background: 'rgba(0,255,136,0.06)' }}>
            <div className="w-2 h-2 rounded-full pulse-green" style={{ background: '#00ff88' }} />
            NEXT-GEN SECURITY PLATFORM &mdash; v4.2.1
          </div>

          <div className="mb-6 fade-delay-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-2" style={{ color: '#e0e8f0' }}>
              PROTECT YOUR
            </h1>
            <div className="relative inline-block">
              <h1 className="glitch-wrap text-5xl md:text-7xl font-black tracking-tight leading-none"
                data-text="DIGITAL ASSETS"
                style={{ color: '#00ff88', textShadow: '0 0 30px rgba(0,255,136,0.5)' }}>
                DIGITAL ASSETS
              </h1>
            </div>
          </div>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed fade-delay-2" style={{ color: '#8899aa' }}>
            Military-grade cybersecurity monitoring for cloud storage and ROM data integrity.
            Real-time threat detection, encryption analysis, and system hardening.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-delay-3">
            <button
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
              className="px-8 py-4 rounded font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,204,255,0.2))', border: '1px solid #00ff88', color: '#00ff88' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0,255,136,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,204,255,0.3))';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,204,255,0.2))';
              }}
            >
              <Shield size={16} />
              {isAuthenticated ? 'VIEW DASHBOARD' : 'GET PROTECTED'}
              <ChevronRight size={16} />
            </button>
            <a href="#security-check"
              className="px-8 py-4 rounded font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
              style={{ border: '1px solid rgba(0,204,255,0.4)', color: '#00ccff' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,204,255,0.2)';
                (e.currentTarget as HTMLElement).style.borderColor = '#00ccff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,204,255,0.4)';
              }}
            >
              <Eye size={16} />
              RUN SECURITY SCAN
            </a>
          </div>

          {/* Animated Shield */}
          <div className="flex justify-center fade-delay-4">
            <div className="relative float-anim">
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(0,255,136,0.08)', filter: 'blur(30px)', transform: 'scale(1.5)' }} />
              <svg width="120" height="140" viewBox="0 0 120 140">
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00ccff" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d="M60 8 L108 28 L108 72 C108 100 60 132 60 132 C60 132 12 100 12 72 L12 28 Z"
                  fill="none" stroke="url(#shieldGrad)" strokeWidth="3"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,136,0.6))' }} />
                <path d="M60 20 L96 36 L96 72 C96 93 60 118 60 118 C60 118 24 93 24 72 L24 36 Z"
                  fill="rgba(0,255,136,0.05)" stroke="rgba(0,255,136,0.3)" strokeWidth="1" />
                <text x="60" y="82" textAnchor="middle" fontSize="36" fill="url(#shieldGrad)" fontWeight="bold"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.8))' }}>
                  ⚡
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="section-divider mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="99.9%" label="Uptime" icon={Zap} />
            <StatCard value="256-bit" label="Encryption" icon={Lock} />
            <StatCard value="2.4M+" label="Scans Daily" icon={Eye} />
            <StatCard value="< 50ms" label="Response Time" icon={Globe} />
          </div>
        </div>
      </section>

      {/* Cloud Security Section */}
      <section className="py-20 px-4 hex-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono mb-6 tracking-widest"
                style={{ border: '1px solid rgba(0,204,255,0.3)', color: '#00ccff', background: 'rgba(0,204,255,0.05)' }}>
                <Cloud size={12} />
                CLOUD SECURITY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#e0e8f0' }}>
                Cloud Storage
                <br />
                <span className="text-glow-cyan" style={{ color: '#00ccff' }}>Data Protection</span>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#8899aa' }}>
                Modern cloud storage faces sophisticated threats including data interception, unauthorized access, and ransomware attacks.
                Our platform provides end-to-end encryption monitoring to ensure your cloud data remains protected at every layer.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'AES-256 Encryption Monitoring', desc: 'Real-time verification of encryption protocols across all cloud endpoints' },
                  { title: 'Access Control Auditing', desc: 'Continuous scanning of IAM policies and permission misconfigurations' },
                  { title: 'Data Breach Detection', desc: 'AI-driven anomaly detection that identifies suspicious data exfiltration patterns' },
                  { title: 'Compliance Tracking', desc: 'Automated GDPR, HIPAA, and SOC 2 compliance verification' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,204,255,0.15)', border: '1px solid rgba(0,204,255,0.4)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: '#00ccff' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: '#e0e8f0' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: '#8899aa' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="cyber-card p-8 relative overflow-hidden" style={{ border: '1px solid rgba(0,204,255,0.2)' }}>
                <div className="scan-anim" />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {['S3 Bucket', 'Azure Blob', 'GCP Storage'].map((service, i) => (
                    <div key={service} className="cyber-card p-3 text-center" style={{ background: 'rgba(0,204,255,0.05)', border: '1px solid rgba(0,204,255,0.15)' }}>
                      <Server size={20} className="mx-auto mb-2" style={{ color: '#00ccff' }} />
                      <p className="text-xs font-mono" style={{ color: '#e0e8f0' }}>{service}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 1 ? '#ffd700' : '#00ff88' }} />
                        <span className="text-xs font-mono" style={{ color: i === 1 ? '#ffd700' : '#00ff88' }}>{i === 1 ? 'WARN' : 'OK'}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="terminal-box">
                  <div className="terminal-header">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff0040' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffd700' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00ff88' }} />
                    <span className="text-xs ml-2 opacity-50">cloud-monitor</span>
                  </div>
                  <div className="p-4 space-y-1 font-mono text-xs">
                    <p style={{ color: '#00ff88' }}>[OK] S3: 847 objects scanned &mdash; encrypted</p>
                    <p style={{ color: '#ffd700' }}>[WARN] Azure: 2 objects unencrypted</p>
                    <p style={{ color: '#00ff88' }}>[OK] GCP: TLS 1.3 active</p>
                    <p style={{ color: '#00ccff' }}>[INFO] Next scan: 00:14:32</p>
                    <p className="cursor-blink" style={{ color: '#00ff88' }}>&gt; </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ROM Security Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="cyber-card p-8 relative overflow-hidden" style={{ border: '1px solid rgba(0,255,136,0.2)' }}>
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <svg width="160" height="160" viewBox="0 0 160 160" className="spin-slow opacity-20" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#00ff88" strokeWidth="1" strokeDasharray="10 5" />
                    </svg>
                    <svg width="160" height="160" viewBox="0 0 160 160" className="spin-reverse opacity-10" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                      <circle cx="80" cy="80" r="55" fill="none" stroke="#00ccff" strokeWidth="1" strokeDasharray="5 8" />
                    </svg>
                    <Cpu size={64} className="relative z-10 float-anim" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.6))' }} />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Boot Sector', status: 'VERIFIED', color: '#00ff88', val: 100 },
                    { label: 'Firmware Hash', status: 'MATCH', color: '#00ff88', val: 100 },
                    { label: 'ROM Checksum', status: 'VALID', color: '#00ff88', val: 100 },
                    { label: 'BIOS Integrity', status: 'CHECKING', color: '#ffd700', val: 73 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono" style={{ color: '#8899aa' }}>{item.label}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.status}</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${item.val}%`, background: item.color, boxShadow: `0 0 6px ${item.color}60` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono mb-6 tracking-widest"
                style={{ border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', background: 'rgba(0,255,136,0.05)' }}>
                <Cpu size={12} />
                ROM DATA SECURITY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#e0e8f0' }}>
                ROM Integrity
                <br />
                <span className="text-glow-green" style={{ color: '#00ff88' }}>Verification System</span>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#8899aa' }}>
                Read-Only Memory (ROM) holds critical firmware and bootloader data. Tampering with ROM can enable
                persistent malware that survives OS reinstalls. Our system continuously verifies ROM integrity
                using cryptographic checksums and behavioral analysis.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Cryptographic Hash Verification', desc: 'SHA-256 hashing validates ROM contents against known-good baselines' },
                  { title: 'Firmware Rootkit Detection', desc: 'Deep scan analysis identifies hidden firmware-level threats' },
                  { title: 'Secure Boot Validation', desc: 'Ensures only signed, trusted code executes during system initialization' },
                  { title: 'UEFI/BIOS Monitoring', desc: 'Continuous surveillance of BIOS settings and configuration changes' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.4)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: '#00ff88' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: '#e0e8f0' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: '#8899aa' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Features Grid */}
      <section className="py-20 px-4 hex-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#e0e8f0' }}>
              Complete <span style={{ color: '#00ff88' }}>Security Coverage</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#8899aa' }}>Every vector secured, every threat monitored.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Lock} title="End-to-End Encryption" description="AES-256 encryption monitoring across all data layers, from storage to transmission, with certificate validation." color="#00ff88" />
            <FeatureCard icon={Eye} title="Threat Intelligence" description="Real-time feeds from global threat databases, identifying zero-day vulnerabilities and emerging attack patterns." color="#00ccff" />
            <FeatureCard icon={Shield} title="Zero-Trust Architecture" description="Every access request verified, every session authenticated. No implicit trust granted to any entity." color="#00ff88" />
            <FeatureCard icon={Database} title="Data Loss Prevention" description="Advanced DLP policies that monitor, detect, and block unauthorized data transfers and exfiltration attempts." color="#00ccff" />
            <FeatureCard icon={Zap} title="Incident Response" description="Automated threat containment with sub-second response times, isolating compromised systems before damage spreads." color="#ffd700" />
            <FeatureCard icon={Globe} title="Compliance Automation" description="Continuous compliance monitoring for GDPR, HIPAA, PCI-DSS, and ISO 27001 frameworks with audit trails." color="#00ff88" />
          </div>
        </div>
      </section>

      {/* Security Check */}
      <SecurityCheck />

      {/* CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Shield size={48} className="mx-auto mb-6" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.5))' }} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#e0e8f0' }}>
            Ready to Secure Your <span style={{ color: '#00ff88' }}>Infrastructure?</span>
          </h2>
          <p className="text-base mb-8" style={{ color: '#8899aa' }}>
            Join thousands of organizations trusting CyberGuard to protect their critical data assets.
          </p>
          <button
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
            className="px-10 py-4 rounded font-mono font-bold text-sm tracking-widest transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,204,255,0.2))', border: '1px solid #00ff88', color: '#00ff88' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,255,136,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
          >
            {isAuthenticated ? 'GO TO DASHBOARD' : 'CREATE FREE ACCOUNT'}
          </button>
        </div>
      </section>
    </div>
  );
}
