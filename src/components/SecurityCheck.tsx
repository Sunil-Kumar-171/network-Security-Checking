import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, Lock, Wifi, HardDrive, Eye, ShieldCheck, KeyRound } from 'lucide-react';

interface ScanResult {
  label: string;
  status: 'secure' | 'warning' | 'critical';
  detail: string;
  score: number;
  protected?: boolean;
  protectionMethod?: string;
}

interface ProtectionOption {
  id: string;
  name: string;
  description: string;
  strength: 'standard' | 'advanced' | 'military';
}

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  if (password.length >= 16) score += 10;
  return Math.min(score, 100);
}

function simulateScan(email: string, password: string): ScanResult[] {
  const pwStrength = getPasswordStrength(password);
  const domain = email.split('@')[1] || '';
  const knownUnsafeDomains = ['test.com', 'example.com', 'temp.com'];
  const domainSafe = !knownUnsafeDomains.includes(domain);

  const cloudScore = domainSafe ? (70 + Math.floor(Math.random() * 30)) : 35;
  const romScore = 60 + Math.floor(Math.random() * 40);
  const networkScore = 50 + Math.floor(Math.random() * 50);

  return [
    {
      label: 'Password Strength',
      status: pwStrength >= 70 ? 'secure' : pwStrength >= 40 ? 'warning' : 'critical',
      detail: pwStrength >= 70 ? 'Strong encryption key generated' : pwStrength >= 40 ? 'Moderate - consider adding symbols' : 'Weak - high breach risk',
      score: pwStrength,
    },
    {
      label: 'Cloud Storage',
      status: cloudScore >= 70 ? 'secure' : cloudScore >= 50 ? 'warning' : 'critical',
      detail: cloudScore >= 70 ? 'AES-256 encryption active' : cloudScore >= 50 ? 'Partial encryption detected' : 'Unencrypted data detected',
      score: cloudScore,
    },
    {
      label: 'ROM Integrity',
      status: romScore >= 70 ? 'secure' : romScore >= 50 ? 'warning' : 'critical',
      detail: romScore >= 70 ? 'Checksum verified, no tampering' : romScore >= 50 ? 'Minor anomalies detected' : 'ROM signature mismatch',
      score: romScore,
    },
    {
      label: 'Network Security',
      status: networkScore >= 70 ? 'secure' : networkScore >= 50 ? 'warning' : 'critical',
      detail: networkScore >= 70 ? 'TLS 1.3 secured connection' : networkScore >= 50 ? 'TLS 1.2 in use, upgrade recommended' : 'Unsecured connection detected',
      score: networkScore,
    },
  ];
}

const statusColors = {
  secure: '#00ff88',
  warning: '#ffd700',
  critical: '#ff0040',
};

const statusIcons = {
  secure: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

const checkIcons = [Lock, Wifi, HardDrive, Eye];

const protectionOptions: ProtectionOption[] = [
  {
    id: 'aes256',
    name: 'AES-256 Encryption',
    description: 'Industry-standard encryption with 256-bit keys',
    strength: 'standard'
  },
  {
    id: 'rsa4096',
    name: 'RSA-4096 Encryption',
    description: 'Advanced asymmetric encryption for maximum security',
    strength: 'advanced'
  },
  {
    id: 'quantum',
    name: 'Quantum-Safe Encryption',
    description: 'Military-grade post-quantum cryptography',
    strength: 'military'
  }
];

export default function SecurityCheck() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [showProtection, setShowProtection] = useState(false);
  const [selectedProtection, setSelectedProtection] = useState<{ [key: number]: string }>({});
  const [applyingProtection, setApplyingProtection] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password required';
    else if (password.length < 4) errs.password = 'Minimum 4 characters';
    return errs;
  };

  const runScan = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setScanning(true);
    setResults(null);
    setScanLog([]);
    setShowProtection(false);
    setSelectedProtection({});

    const logLines = [
      '> Initializing security scanner...',
      '> Connecting to threat intelligence database...',
      '> Analyzing credential strength...',
      '> Scanning cloud storage endpoints...',
      '> Verifying ROM integrity checksums...',
      '> Running network protocol analysis...',
      '> Generating security report...',
    ];

    for (let i = 0; i < logLines.length; i++) {
      await new Promise(r => setTimeout(r, 350));
      setScanLog(prev => [...prev, logLines[i]]);
    }

    await new Promise(r => setTimeout(r, 400));
    const scanResults = simulateScan(email, password);
    setResults(scanResults);
    setScanning(false);
  };

  const applyProtection = async () => {
    if (!results) return;
    
    setApplyingProtection(true);
    setScanLog([]);
    
    const logLines = [
      '> Initializing protection protocols...',
      '> Encrypting vulnerable data segments...',
      '> Applying selected encryption methods...',
      '> Updating security configurations...',
      '> Verifying protection integrity...',
      '> Protection successfully applied!',
    ];

    for (let i = 0; i < logLines.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setScanLog(prev => [...prev, logLines[i]]);
    }

    // Update results with protection status
    const updatedResults = results.map((result, index) => {
      if (result.status !== 'secure' && selectedProtection[index]) {
        const method = protectionOptions.find(p => p.id === selectedProtection[index]);
        return {
          ...result,
          status: 'secure' as const,
          score: Math.min(result.score + 30, 100),
          protected: true,
          protectionMethod: method?.name,
          detail: `Protected with ${method?.name}`
        };
      }
      return result;
    });

    await new Promise(r => setTimeout(r, 500));
    setResults(updatedResults);
    setApplyingProtection(false);
    setShowProtection(false);
  };

  const overall = results
    ? results.every(r => r.status === 'secure') ? 'secure' : results.some(r => r.status === 'critical') ? 'critical' : 'warning'
    : null;

  const avgScore = results ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0;
  
  const vulnerableItems = results?.filter(r => r.status !== 'secure') || [];
  const hasVulnerabilities = vulnerableItems.length > 0;

  return (
    <section id="security-check" className="py-20 px-4 relative" style={{ background: 'rgba(10,15,30,0.5)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-mono tracking-widest"
            style={{ border: '1px solid rgba(0,204,255,0.3)', color: '#00ccff', background: 'rgba(0,204,255,0.06)' }}>
            <Search size={12} />
            LIVE SECURITY SCANNER
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#e0e8f0' }}>
            Check Your <span className="text-glow-green" style={{ color: '#00ff88' }}>Security Status</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8899aa' }}>
            Enter your credentials to simulate a real-time security analysis of your cloud and ROM data integrity.
          </p>
        </div>

        <div className="cyber-card p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-mono mb-2 tracking-widest" style={{ color: '#8899aa' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@domain.com"
                className="cyber-input"
              />
              {errors.email && <p className="text-xs mt-1 font-mono" style={{ color: '#ff0040' }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono mb-2 tracking-widest" style={{ color: '#8899aa' }}>PASSWORD / KEY</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password to analyze"
                className="cyber-input"
              />
              {errors.password && <p className="text-xs mt-1 font-mono" style={{ color: '#ff0040' }}>{errors.password}</p>}
            </div>
          </div>

          <button
            onClick={runScan}
            disabled={scanning}
            className="w-full py-4 rounded font-mono text-sm tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-3"
            style={{
              background: scanning ? 'rgba(0,255,136,0.08)' : 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,204,255,0.15))',
              border: '1px solid #00ff88',
              color: '#00ff88',
              boxShadow: scanning ? 'none' : '0 0 20px rgba(0,255,136,0.15)',
              cursor: scanning ? 'not-allowed' : 'pointer',
            }}
          >
            {scanning ? (
              <>
                <div className="spinner w-4 h-4" />
                SCANNING...
              </>
            ) : (
              <>
                <Shield size={16} />
                INITIATE SECURITY SCAN
              </>
            )}
          </button>
        </div>

        {(scanning || scanLog.length > 0) && (
          <div className="terminal-box mb-8">
            <div className="terminal-header">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff0040' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#ffd700' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#00ff88' }} />
              <span className="ml-2 text-xs opacity-60">cyberguard-scanner v3.1.0</span>
            </div>
            <div className="p-4 space-y-1 min-h-[120px]">
              {scanLog.map((line, i) => (
                <div key={i} className="font-mono text-xs opacity-90" style={{ color: '#00ff88' }}>
                  {line}
                </div>
              ))}
              {scanning && <div className="cursor-blink text-xs font-mono" style={{ color: '#00ccff' }}>&gt; </div>}
            </div>
          </div>
        )}

        {results && (
          <div className="fade-in-up">
            <div className="cyber-card p-6 mb-6 flex flex-col md:flex-row items-center gap-6"
              style={{ border: `1px solid ${statusColors[overall!]}40` }}>
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={statusColors[overall!]} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * avgScore / 100} ${2 * Math.PI * 40}`}
                    strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: `drop-shadow(0 0 6px ${statusColors[overall!]})` }} />
                  <text x="50" y="54" textAnchor="middle" fontSize="20" fontWeight="bold" fontFamily="monospace" fill={statusColors[overall!]}>{avgScore}</text>
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest mb-1" style={{ color: '#8899aa' }}>OVERALL SECURITY SCORE</p>
                <div className="flex items-center gap-3 mb-2">
                  {overall === 'secure' ? <CheckCircle size={22} style={{ color: '#00ff88' }} /> : <AlertTriangle size={22} style={{ color: statusColors[overall!] }} />}
                  <span className="text-2xl font-bold font-mono" style={{ color: statusColors[overall!], textShadow: `0 0 10px ${statusColors[overall!]}60` }}>
                    {overall === 'secure' ? 'SECURE' : overall === 'warning' ? 'ATTENTION REQUIRED' : 'CRITICAL THREAT'}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#8899aa' }}>
                  {overall === 'secure'
                    ? 'All systems are operating within safe parameters.'
                    : overall === 'warning'
                    ? 'Some security concerns detected. Review recommendations.'
                    : 'Immediate action required. Multiple vulnerabilities found.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((result, i) => {
                const Icon = statusIcons[result.status];
                const CheckIcon = checkIcons[i];
                return (
                  <div key={result.label} className="cyber-card p-5" style={{ 
                    animationDelay: `${i * 0.1}s`,
                    border: result.protected ? '1px solid rgba(0,255,136,0.4)' : undefined
                  }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckIcon size={16} style={{ color: statusColors[result.status] }} />
                        <span className="text-sm font-mono font-bold" style={{ color: '#e0e8f0' }}>{result.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.protected && <ShieldCheck size={16} style={{ color: '#00ff88' }} />}
                        <Icon size={16} style={{ color: statusColors[result.status] }} />
                      </div>
                    </div>
                    <div className="progress-track mb-2">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${result.score}%`,
                          background: `linear-gradient(90deg, ${statusColors[result.status]}, ${statusColors[result.status]}88)`,
                          boxShadow: `0 0 8px ${statusColors[result.status]}60`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#8899aa' }}>{result.detail}</span>
                      <span className="text-sm font-mono font-bold" style={{ color: statusColors[result.status] }}>{result.score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Protection Options UI */}
            {hasVulnerabilities && !showProtection && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowProtection(true)}
                  className="px-6 py-3 rounded font-mono text-sm tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,0,64,0.15))',
                    border: '1px solid #ffd700',
                    color: '#ffd700',
                    boxShadow: '0 0 20px rgba(255,215,0,0.15)',
                  }}
                >
                  <Lock size={16} />
                  PROTECT VULNERABLE DATA
                </button>
              </div>
            )}

            {showProtection && (
              <div className="mt-6 fade-in-up">
                <div className="cyber-card p-6" style={{ border: '1px solid rgba(255,215,0,0.3)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <KeyRound size={20} style={{ color: '#ffd700' }} />
                    <h3 className="text-lg font-mono font-bold" style={{ color: '#ffd700' }}>
                      SELECT PROTECTION METHOD
                    </h3>
                  </div>
                  <p className="text-sm mb-6" style={{ color: '#8899aa' }}>
                    Choose encryption methods for each vulnerable component. Higher security levels provide stronger protection.
                  </p>

                  <div className="space-y-4 mb-6">
                    {vulnerableItems.map(item => {
                      const originalIndex = results.findIndex(r => r.label === item.label);
                      return (
                        <div key={item.label} className="p-4 rounded" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={16} style={{ color: statusColors[item.status] }} />
                              <span className="font-mono font-bold text-sm" style={{ color: '#e0e8f0' }}>
                                {item.label}
                              </span>
                            </div>
                            <span className="text-xs font-mono" style={{ color: '#ff0040' }}>
                              {item.status === 'critical' ? 'CRITICAL' : 'WARNING'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {protectionOptions.map(option => (
                              <button
                                key={option.id}
                                onClick={() => setSelectedProtection(prev => ({ ...prev, [originalIndex]: option.id }))}
                                className="p-3 rounded text-left transition-all duration-200"
                                style={{
                                  background: selectedProtection[originalIndex] === option.id 
                                    ? 'rgba(0,255,136,0.15)' 
                                    : 'rgba(0,204,255,0.05)',
                                  border: selectedProtection[originalIndex] === option.id 
                                    ? '1px solid #00ff88' 
                                    : '1px solid rgba(0,204,255,0.2)',
                                  color: selectedProtection[originalIndex] === option.id ? '#00ff88' : '#8899aa'
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Lock size={12} />
                                  <span className="text-xs font-mono font-bold">{option.name}</span>
                                </div>
                                <p className="text-xs opacity-80">{option.description}</p>
                                <div className="mt-2 flex gap-1">
                                  {Array.from({ length: option.strength === 'military' ? 3 : option.strength === 'advanced' ? 2 : 1 }).map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full" style={{ 
                                      background: selectedProtection[originalIndex] === option.id ? '#00ff88' : '#00ccff' 
                                    }} />
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={applyProtection}
                      disabled={applyingProtection || Object.keys(selectedProtection).length === 0}
                      className="flex-1 py-3 rounded font-mono text-sm tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-3"
                      style={{
                        background: applyingProtection || Object.keys(selectedProtection).length === 0
                          ? 'rgba(0,255,136,0.08)'
                          : 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,204,255,0.15))',
                        border: '1px solid #00ff88',
                        color: '#00ff88',
                        boxShadow: applyingProtection || Object.keys(selectedProtection).length === 0 ? 'none' : '0 0 20px rgba(0,255,136,0.15)',
                        cursor: applyingProtection || Object.keys(selectedProtection).length === 0 ? 'not-allowed' : 'pointer',
                        opacity: applyingProtection || Object.keys(selectedProtection).length === 0 ? 0.5 : 1,
                      }}
                    >
                      {applyingProtection ? (
                        <>
                          <div className="spinner w-4 h-4" />
                          APPLYING PROTECTION...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          APPLY PROTECTION
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowProtection(false)}
                      disabled={applyingProtection}
                      className="px-6 py-3 rounded font-mono text-sm tracking-widest font-bold transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#8899aa',
                        cursor: applyingProtection ? 'not-allowed' : 'pointer',
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
