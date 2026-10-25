import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'rgba(0,255,136,0.12)', background: 'rgba(5,8,16,0.9)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.5))' }} />
              <span className="font-bold font-mono tracking-wider" style={{ color: '#00ff88' }}>CYBERGUARD</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#8899aa' }}>
              Advanced cybersecurity monitoring for cloud and ROM data protection. Keeping your systems secure 24/7.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <button key={i} className="p-2 rounded transition-all duration-300"
                  style={{ border: '1px solid rgba(0,255,136,0.15)', color: '#8899aa' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.5)';
                    (e.currentTarget as HTMLElement).style.color = '#00ff88';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 10px rgba(0,255,136,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.15)';
                    (e.currentTarget as HTMLElement).style.color = '#8899aa';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-mono font-bold mb-4 tracking-widest" style={{ color: '#00ff88' }}>SECURITY</h4>
            <ul className="space-y-2">
              {['Cloud Protection', 'ROM Integrity', 'Threat Detection', 'Encryption'].map(item => (
                <li key={item}>
                  <span className="text-sm cursor-pointer transition-colors duration-200" style={{ color: '#8899aa' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#00ccff'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8899aa'}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-mono font-bold mb-4 tracking-widest" style={{ color: '#00ff88' }}>PLATFORM</h4>
            <ul className="space-y-2">
              {['Dashboard', 'Security Scan', 'Reports', 'Settings'].map(item => (
                <li key={item}>
                  <span className="text-sm cursor-pointer transition-colors duration-200" style={{ color: '#8899aa' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#00ccff'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8899aa'}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-mono font-bold mb-4 tracking-widest" style={{ color: '#00ff88' }}>SYSTEM STATUS</h4>
            <div className="space-y-3">
              {[
                { label: 'Cloud Services', status: 'ONLINE' },
                { label: 'ROM Monitor', status: 'ACTIVE' },
                { label: 'Threat Engine', status: 'RUNNING' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#8899aa' }}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }} />
                    <span className="text-xs font-mono" style={{ color: '#00ff88' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono" style={{ color: '#8899aa' }}>
            &copy; 2026 CyberGuard Security Systems. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }} />
            <span className="text-xs font-mono" style={{ color: '#8899aa' }}>
              ALL SYSTEMS OPERATIONAL &mdash; THREAT LEVEL: <span style={{ color: '#00ff88' }}>LOW</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
