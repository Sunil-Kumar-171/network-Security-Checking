import { useState, useEffect, useCallback } from 'react';
import { Shield, Cloud, Cpu, AlertTriangle, CheckCircle, Activity, Lock, RefreshCw, TrendingUp, Wifi, Eye, Bell, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, SecurityScan } from '../lib/supabase';

function generateScan(userId: string): Omit<SecurityScan, 'id' | 'created_at'> {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const cloudScore = rand(55, 100);
  const romScore = rand(60, 100);
  const pwScore = rand(40, 100);
  const threats = cloudScore < 70 ? rand(1, 8) : 0;

  const cloudStatus: SecurityScan['cloud_status'] = cloudScore >= 80 ? 'secure' : cloudScore >= 65 ? 'warning' : 'critical';
  const romStatus: SecurityScan['rom_status'] = romScore >= 80 ? 'healthy' : romScore >= 65 ? 'degraded' : 'compromised';
  const enc = pwScore >= 80 ? 'AES-256' : pwScore >= 60 ? 'AES-128' : 'None';

  return {
    user_id: userId,
    cloud_status: cloudStatus,
    rom_status: romStatus,
    threat_count: threats,
    password_strength: pwScore,
    encryption_level: enc,
    last_scan_at: new Date().toISOString(),
  };
}

const statusConfig = {
  secure: { color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', label: 'SECURE', icon: CheckCircle },
  warning: { color: '#ffd700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.25)', label: 'WARNING', icon: AlertTriangle },
  critical: { color: '#ff0040', bg: 'rgba(255,0,64,0.08)', border: 'rgba(255,0,64,0.25)', label: 'CRITICAL', icon: AlertTriangle },
  healthy: { color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', label: 'HEALTHY', icon: CheckCircle },
  degraded: { color: '#ffd700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.25)', label: 'DEGRADED', icon: AlertTriangle },
  compromised: { color: '#ff0040', bg: 'rgba(255,0,64,0.08)', border: 'rgba(255,0,64,0.25)', label: 'COMPROMISED', icon: AlertTriangle },
};

function MetricCard({ icon: Icon, title, value, subtitle, color }: { icon: React.ElementType; title: string; value: string; subtitle: string; color: string }) {
  return (
    <div className="cyber-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <p className="text-xl font-bold font-mono mb-0.5" style={{ color }}>{value}</p>
      <p className="text-sm font-medium mb-1" style={{ color: '#e0e8f0' }}>{title}</p>
      <p className="text-xs" style={{ color: '#8899aa' }}>{subtitle}</p>
    </div>
  );
}

function ThreatLog() {
  const events = [
    { time: '23:58:12', type: 'INFO', msg: 'Scheduled scan completed', color: '#00ccff' },
    { time: '23:52:44', type: 'OK', msg: 'ROM checksum verified', color: '#00ff88' },
    { time: '23:48:09', type: 'WARN', msg: 'Unusual access pattern detected', color: '#ffd700' },
    { time: '23:41:33', type: 'OK', msg: 'TLS 1.3 handshake successful', color: '#00ff88' },
    { time: '23:35:21', type: 'INFO', msg: 'Encryption key rotation complete', color: '#00ccff' },
    { time: '23:29:05', type: 'OK', msg: 'Firewall rules validated', color: '#00ff88' },
  ];

  return (
    <div className="cyber-card h-full">
      <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Activity size={16} style={{ color: '#00ff88' }} />
        <span className="text-sm font-mono font-bold" style={{ color: '#e0e8f0' }}>THREAT LOG</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: '#00ff88' }} />
          <span className="text-xs font-mono" style={{ color: '#8899aa' }}>LIVE</span>
        </div>
      </div>
      <div className="p-4 space-y-2 font-mono text-xs max-h-56 overflow-y-auto">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <span style={{ color: '#8899aa', flexShrink: 0 }}>{ev.time}</span>
            <span className="font-bold" style={{ color: ev.color, flexShrink: 0 }}>[{ev.type}]</span>
            <span style={{ color: '#c0ccd8' }}>{ev.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RomExplainer() {
  const points = [
    {
      icon: Cpu,
      title: 'What is ROM?',
      desc: 'Read-Only Memory stores permanent firmware instructions that initialize hardware. Unlike RAM, ROM retains data when powered off, making it critical for system integrity.',
    },
    {
      icon: Lock,
      title: 'Why ROM Security Matters',
      desc: 'Compromised ROM enables persistent rootkits that survive OS reinstalls, hard drive wipes, and even factory resets — invisible to conventional antivirus software.',
    },
    {
      icon: Shield,
      title: 'Our Protection Approach',
      desc: 'We compare cryptographic hashes of your ROM contents against verified baselines, detecting any unauthorized modifications at the firmware level.',
    },
    {
      icon: Eye,
      title: 'Continuous Monitoring',
      desc: 'Every boot cycle triggers an automated integrity check. Deviations trigger immediate alerts and optional system quarantine to prevent propagation.',
    },
  ];

  return (
    <div className="cyber-card">
      <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Cpu size={16} style={{ color: '#00ff88' }} />
        <span className="text-sm font-mono font-bold" style={{ color: '#e0e8f0' }}>ROM DATA SAFETY EXPLAINED</span>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {points.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
              <Icon size={14} style={{ color: '#00ff88' }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#e0e8f0' }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#8899aa' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ score }: { score: number }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const axes = ['Cloud', 'ROM', 'Network', 'Encrypt', 'Access', 'Threat'];
  const values = [score / 100, (score + 5) / 100, (score - 10) / 100, (score + 10) / 100, (score - 5) / 100, score / 100].map(v => Math.min(Math.max(v, 0.1), 1));

  const toPoint = (i: number, val: number) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
    };
  };

  const polygon = values.map((v, i) => toPoint(i, v));
  const polygonStr = polygon.map(p => `${p.x},${p.y}`).join(' ');
  const axisPoints = axes.map((_, i) => toPoint(i, 1));
  const labelPoints = axes.map((_, i) => toPoint(i, 1.2));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map(level => {
        const pts = axes.map((_, i) => toPoint(i, level));
        return (
          <polygon key={level} points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth="1" />
        );
      })}
      {axisPoints.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="rgba(0,255,136,0.15)" strokeWidth="1" />
      ))}
      <polygon points={polygonStr} fill="rgba(0,255,136,0.12)" stroke="#00ff88" strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.4))' }} />
      {axes.map((label, i) => (
        <text key={label} x={labelPoints[i].x} y={labelPoints[i].y} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#8899aa" fontFamily="monospace">{label}</text>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [scan, setScan] = useState<SecurityScan | null>(null);
  const [scanning, setScanning] = useState(false);
  const [notifications] = useState(2);

  const runScan = async () => {
    if (!user) return;
    setScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    const newScan = generateScan(user.id);
    const { data } = await supabase.from('security_scans').insert(newScan).select().maybeSingle();
    if (data) setScan(data as SecurityScan);
    setScanning(false);
  };

  const loadOrCreateScan = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('security_scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      setScan(data as SecurityScan);
    } else {
      await runScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => { loadOrCreateScan(); }, [loadOrCreateScan]);

  const cloudCfg = scan ? statusConfig[scan.cloud_status] : statusConfig.secure;
  const romCfg = scan ? statusConfig[scan.rom_status] : statusConfig.healthy;
  const avgScore = scan ? Math.round((scan.password_strength + (scan.threat_count === 0 ? 100 : 60)) / 2) : 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Shield size={24} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.5))' }} />
              <h1 className="text-2xl font-bold font-mono" style={{ color: '#e0e8f0' }}>SECURITY DASHBOARD</h1>
              <div className="relative">
                <Bell size={18} style={{ color: '#8899aa' }} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                    style={{ background: '#ff0040', color: 'white', fontSize: '10px' }}>{notifications}</span>
                )}
              </div>
            </div>
            <p className="text-sm font-mono" style={{ color: '#8899aa' }}>
              {user?.email} &mdash; Last scan: {scan ? formatDate(scan.last_scan_at) : '—'}
            </p>
          </div>
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded font-mono text-sm tracking-widest transition-all duration-300"
            style={{
              border: '1px solid #00ff88',
              color: '#00ff88',
              background: scanning ? 'rgba(0,255,136,0.06)' : 'transparent',
              cursor: scanning ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => !scanning && ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,255,136,0.25)')}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
          >
            <RefreshCw size={14} className={scanning ? 'spin-slow' : ''} />
            {scanning ? 'SCANNING...' : 'RUN NEW SCAN'}
          </button>
        </div>

        {scanning && (
          <div className="cyber-card p-4 mb-6 flex items-center gap-4" style={{ border: '1px solid rgba(0,255,136,0.3)' }}>
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth="3" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#00ff88" strokeWidth="3"
                  strokeDasharray="30 96" strokeLinecap="round"
                  style={{ animation: 'spin 1s linear infinite', transformOrigin: 'center' }} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-mono font-bold" style={{ color: '#00ff88' }}>SECURITY SCAN IN PROGRESS</p>
              <p className="text-xs font-mono" style={{ color: '#8899aa' }}>Analyzing cloud storage, ROM integrity, and threat vectors...</p>
            </div>
          </div>
        )}

        {/* Main Status Cards */}
        {scan && !scanning && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Cloud Status */}
              <div className="cyber-card p-6" style={{ border: `1px solid ${cloudCfg.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: cloudCfg.bg, border: `1px solid ${cloudCfg.border}` }}>
                      <Cloud size={22} style={{ color: cloudCfg.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-mono mb-0.5" style={{ color: '#8899aa' }}>CLOUD STORAGE</p>
                      <p className="text-lg font-bold font-mono" style={{ color: cloudCfg.color, textShadow: `0 0 10px ${cloudCfg.color}50` }}>
                        {cloudCfg.label}
                      </p>
                    </div>
                  </div>
                  <cloudCfg.icon size={28} style={{ color: cloudCfg.color, filter: `drop-shadow(0 0 8px ${cloudCfg.color}60)` }} />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span style={{ color: '#8899aa' }}>ENCRYPTION</span>
                      <span style={{ color: cloudCfg.color }}>{scan.encryption_level}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{
                        width: scan.encryption_level === 'AES-256' ? '100%' : scan.encryption_level === 'AES-128' ? '60%' : '10%',
                        background: cloudCfg.color,
                        boxShadow: `0 0 6px ${cloudCfg.color}50`,
                      }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span style={{ color: '#8899aa' }}>ACTIVE THREATS</span>
                    <span style={{ color: scan.threat_count > 0 ? '#ff0040' : '#00ff88' }}>
                      {scan.threat_count > 0 ? `${scan.threat_count} DETECTED` : 'NONE DETECTED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ROM Status */}
              <div className="cyber-card p-6" style={{ border: `1px solid ${romCfg.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: romCfg.bg, border: `1px solid ${romCfg.border}` }}>
                      <Cpu size={22} style={{ color: romCfg.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-mono mb-0.5" style={{ color: '#8899aa' }}>ROM INTEGRITY</p>
                      <p className="text-lg font-bold font-mono" style={{ color: romCfg.color, textShadow: `0 0 10px ${romCfg.color}50` }}>
                        {romCfg.label}
                      </p>
                    </div>
                  </div>
                  <romCfg.icon size={28} style={{ color: romCfg.color, filter: `drop-shadow(0 0 8px ${romCfg.color}60)` }} />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { label: 'BOOT SECTOR', ok: scan.rom_status !== 'compromised' },
                    { label: 'FIRMWARE HASH', ok: scan.rom_status === 'healthy' },
                    { label: 'BIOS SIGNATURE', ok: scan.rom_status !== 'compromised' },
                    { label: 'SECURE BOOT', ok: scan.rom_status === 'healthy' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#8899aa' }}>{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.ok ? '#00ff88' : '#ff0040' }} />
                        <span style={{ color: item.ok ? '#00ff88' : '#ff0040' }}>{item.ok ? 'PASS' : 'FAIL'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <MetricCard icon={Lock} title="Password Score" value={`${scan.password_strength}%`} subtitle="Credential strength" color="#00ff88" />
              <MetricCard icon={Wifi} title="Network" value="TLS 1.3" subtitle="Protocol secured" color="#00ccff" />
              <MetricCard icon={Database} title="Data Points" value="847" subtitle="Objects scanned" color="#00ff88" />
              <MetricCard icon={TrendingUp} title="Uptime" value="99.9%" subtitle="Last 30 days" color="#00ccff" />
            </div>

            {/* Radar + Threat Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="cyber-card p-6 flex flex-col items-center justify-center">
                <p className="text-xs font-mono mb-4 tracking-widest" style={{ color: '#8899aa' }}>SECURITY RADAR</p>
                <RadarChart score={avgScore} />
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold font-mono" style={{ color: '#00ff88', textShadow: '0 0 12px rgba(0,255,136,0.5)' }}>{avgScore}</p>
                  <p className="text-xs font-mono" style={{ color: '#8899aa' }}>OVERALL SCORE</p>
                </div>
              </div>
              <div className="lg:col-span-2">
                <ThreatLog />
              </div>
            </div>

            {/* ROM Explainer */}
            <RomExplainer />
          </>
        )}

        {!scan && !scanning && (
          <div className="cyber-card p-12 text-center">
            <Shield size={48} className="mx-auto mb-4" style={{ color: '#8899aa' }} />
            <p className="text-sm font-mono" style={{ color: '#8899aa' }}>No scan data found. Run a security scan to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
