
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Shield, 
  Users, 
  Package, 
  Cpu, 
  FileText, 
  Terminal, 
  LayoutDashboard, 
  Upload, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  Settings, 
  Search,
  CheckCircle2,
  XCircle,
  HardDrive,
  Code,
  Globe,
  Lock,
  BarChart3,
  Activity,
  AlertTriangle,
  ArrowRight,
  Database,
  Eye,
  ArrowUpRight,
  Clock,
  Server,
  Zap,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * --- TYPES & MOCK DATA ---
 */

type UserRole = 'ADMIN' | 'AGENT' | null;
type ViewState = 'DASHBOARD' | 'RESOURCES' | 'ANALYTICS';

interface LogEntry {
  ts: string;
  time: string; 
  event: string;
  email: string;
  ip: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
  count: number;
}

interface Asset {
  id: string;
  name: string;
  ip: string;
  os: string;
  version: string;
  status: 'ONLINE' | 'OFFLINE';
  lastKeepAlive: string;
}

interface Vulnerability {
  id: string;
  asset: string;
  cve: string;
  severity: 'High' | 'Medium' | 'Low';
  pkg: string;
  status: 'OPEN' | 'FIXED';
}

const SEVERITY_COLORS = {
  INFO: '#10b981',
  WARNING: '#f59e0b',
  CRITICAL: '#ef4444'
};

const MOCK_ASSETS: Asset[] = [
  { id: '001', name: 'Web-Server-PROD', ip: '10.0.0.15', os: 'Ubuntu 22.04 LTS', version: '4.7.2', status: 'ONLINE', lastKeepAlive: '2 mins ago' },
  { id: '002', name: 'DB-Node-01', ip: '10.0.0.22', os: 'Debian 11', version: '4.7.2', status: 'ONLINE', lastKeepAlive: '5 mins ago' },
  { id: '003', name: 'Dev-Sandbox', ip: '192.168.1.102', os: 'CentOS 7', version: '4.4.1', status: 'OFFLINE', lastKeepAlive: '2 days ago' },
];

const MOCK_VULNS: Vulnerability[] = [
  { id: 'v-01', asset: 'Web-Server-PROD', cve: 'CVE-2024-1234', severity: 'High', pkg: 'openssl', status: 'OPEN' },
  { id: 'v-02', asset: 'DB-Node-01', cve: 'CVE-2023-9981', severity: 'Medium', pkg: 'libmysqlclient', status: 'OPEN' },
  { id: 'v-03', asset: 'Web-Server-PROD', cve: 'CVE-2024-0021', severity: 'Low', pkg: 'python3-pip', status: 'FIXED' },
];

const generateGraphData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    events: Math.floor(Math.random() * 50) + 10,
    critical: Math.floor(Math.random() * 10),
  }));
};

const PIE_DATA = [
  { name: 'Info', value: 400, color: '#10b981' },
  { name: 'Warning', value: 300, color: '#f59e0b' },
  { name: 'Critical', value: 100, color: '#ef4444' },
];

/**
 * --- LOGIN COMPONENT ---
 */

const LoginScreen = ({ onLogin }: { onLogin: (role: UserRole, email: string) => void }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') setEmail('admin@securepulse.io');
    if (role === 'AGENT') setEmail('agent-01@securepulse.io');
    setPassword('password123');
  };

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(selectedRole, email);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050508]">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/20">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter">SECURE<span className="text-indigo-400">PULSE</span></h1>
          <p className="text-slate-500 font-mono text-sm mt-2">CHOOSE YOUR GATEWAY</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <button 
            onClick={() => handleRoleSelection('ADMIN')}
            className="group p-8 rounded-3xl bg-[#0d0d14] border border-white/5 hover:border-indigo-500/50 transition-all text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Lock size={120} />
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
              <Settings className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">SOC Administrator</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Access global SIEM analytics, manage assets, and oversee security incidents.</p>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              ENTER COMMAND CENTER <ArrowRight size={14} />
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelection('AGENT')}
            className="group p-8 rounded-3xl bg-[#0d0d14] border border-white/5 hover:border-emerald-500/50 transition-all text-left relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu size={120} />
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Asset Agent</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Monitor local endpoint health, view personal logs, and manage file integrity.</p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              ENTER WORKSTATION <ArrowRight size={14} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <button onClick={() => setSelectedRole(null)} className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 text-xs font-bold transition-colors">
           ← BACK TO SELECTION
        </button>
        
        <div className="bg-[#0d0d14] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedRole === 'ADMIN' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
              {selectedRole === 'ADMIN' ? <Lock size={20} className="text-white" /> : <Cpu size={20} className="text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{selectedRole} LOGIN</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase">SecurePulse Instance V2.1</p>
            </div>
          </div>

          <form onSubmit={submitLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-2 tracking-widest">Corporate Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={selectedRole === 'ADMIN' ? 'admin@securepulse.io' : 'agent-01@securepulse.io'}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-2 tracking-widest">Access Key</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-slate-500 font-mono">
              <p className="font-bold text-slate-400 mb-1 tracking-tighter">DEFAULT CREDENTIALS:</p>
              <p>Email: <span className="text-indigo-400">{selectedRole === 'ADMIN' ? 'admin@securepulse.io' : 'agent-01@securepulse.io'}</span></p>
              <p>Pass: <span className="text-indigo-400">password123</span></p>
            </div>

            <button 
              type="submit"
              className={`w-full py-4 rounded-xl text-white font-bold transition-all shadow-lg ${selectedRole === 'ADMIN' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'}`}
            >
              INITIALIZE SESSION
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * --- MAIN APP ---
 */

const App = () => {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole, email: string } | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [graphData, setGraphData] = useState(generateGraphData());

  const addLog = (event: string, severity: LogEntry['severity'], details: string) => {
    const newLog: LogEntry = {
      ts: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event,
      email: currentUser?.email || 'SYSTEM',
      ip: '192.168.1.' + (Math.floor(Math.random() * 254) + 1),
      severity,
      details,
      count: 1
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        addLog('HEARTBEAT_PULSE', 'INFO', 'System check completed by agent daemon.');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen onLogin={(role, email) => {
      setCurrentUser({ role, email });
      const initialLog: LogEntry = {
        ts: new Date().toISOString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: 'SESSION_INIT',
        email,
        ip: '192.168.1.5',
        severity: 'INFO',
        details: `User session initialized for role: ${role}`,
        count: 1
      };
      setLogs([initialLog]);
    }} />;
  }

  return (
    <div className="flex h-screen bg-[#050508] text-slate-300 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0d0d14] flex flex-col p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentUser.role === 'ADMIN' ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-emerald-600 shadow-emerald-500/20'} shadow-lg`}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">SECURE<span className="text-indigo-400">PULSE</span></h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest leading-none">V2.1 SOC</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-3 px-4">Navigation</div>
          
          <button 
            onClick={() => setActiveView('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === 'DASHBOARD' ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveView('RESOURCES')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === 'RESOURCES' ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Server size={18} /> Resources
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all">
            <Activity size={18} /> Analytics
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all">
            <Terminal size={18} /> Live Stream
          </button>
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5 mb-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                   <Users size={16} className="text-slate-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-slate-500">{currentUser.role}</p>
                </div>
             </div>
             <button 
              onClick={() => setCurrentUser(null)}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold rounded-lg border border-rose-500/20 transition-all uppercase tracking-widest"
             >
               Terminate Session
             </button>
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0d0d14]/40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-400">OSSEC_ENGINE: ONLINE</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">{activeView} VIEW</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search size={18} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
               <Activity size={20} className="text-indigo-400" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#0d0d14]"></span>
            </div>
          </div>
        </header>

        {/* VIEW ROUTING */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#050508] custom-scrollbar pb-12">
          
          {activeView === 'DASHBOARD' && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0d0d14] border border-white/5 rounded-3xl p-6 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                     <BarChart3 size={100} className="text-indigo-500" />
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">Threat Surface Intensity</h3>
                      <p className="text-xs text-slate-500">Event occurrences tracked across the last 24-hour cycle.</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                        <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0d0d14] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center">
                   <h3 className="text-sm font-bold text-white mb-6 self-start flex items-center gap-2">
                     <AlertTriangle size={16} className="text-indigo-400" /> Severity Distribution
                   </h3>
                   <div className="h-48 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={PIE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-2xl font-bold text-white">84%</span>
                         <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure</span>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-2 w-full mt-6">
                      {PIE_DATA.map(item => (
                        <div key={item.name} className="flex flex-col items-center p-2 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{item.name}</span>
                          <span className="text-sm font-bold text-white" style={{ color: item.color }}>{Math.round(item.value / 800 * 100)}%</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="bg-[#0d0d14] border border-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/20">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><Terminal size={18} className="text-indigo-400" /> Advanced Log Monitoring</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-slate-300 border border-white/10 transition-all uppercase tracking-widest">Export JSON</button>
                    {currentUser.role === 'AGENT' && (
                      <button onClick={() => addLog('MANUAL_AUDIT_SIG', 'WARNING', 'User manually triggered a security audit event.')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-widest flex items-center gap-2">Trigger Log <ArrowUpRight size={14} /></button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left bg-[#050508]/50 border-b border-white/5">
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Timestamp</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Event ID</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Severity</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Source Identity</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-indigo-500/5 transition-colors group cursor-default">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-white font-mono">{log.time}</span>
                              <span className="text-[10px] text-slate-600 font-mono">{log.ts.split('T')[0]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-black rounded border border-white/10 text-[10px] font-mono font-bold text-indigo-300">{log.event}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[log.severity] }}></div>
                               <span className="text-[10px] font-bold" style={{ color: SEVERITY_COLORS[log.severity] }}>{log.severity}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-200">{log.email}</td>
                          <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'RESOURCES' && (
            <div className="flex flex-col gap-8 animate-in slide-in-from-right duration-500">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-[#0d0d14] border border-white/5 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Server size={20} className="text-indigo-400" /> Monitored Assets</h3>
                    <div className="flex gap-2">
                       <button className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-all"><Filter size={16}/></button>
                       <button className="px-3 py-1 bg-indigo-600/10 text-indigo-400 rounded-lg border border-indigo-500/20 text-[10px] font-bold">ADD AGENT</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-500">
                          <th className="px-4 py-2">ID</th>
                          <th className="px-4 py-2">Asset Name</th>
                          <th className="px-4 py-2">IP Address</th>
                          <th className="px-4 py-2">OS Version</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {MOCK_ASSETS.map(asset => (
                          <tr key={asset.id} className="text-xs hover:bg-white/5">
                            <td className="px-4 py-4 font-mono text-indigo-400">AG-{asset.id}</td>
                            <td className="px-4 py-4 font-bold text-white">{asset.name}</td>
                            <td className="px-4 py-4 text-slate-400">{asset.ip}</td>
                            <td className="px-4 py-4 text-slate-400">{asset.os}</td>
                            <td className="px-4 py-4">
                               <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${asset.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                 {asset.status}
                               </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="w-full md:w-80 space-y-4">
                  <div className="bg-[#0d0d14] border border-white/5 rounded-3xl p-6 shadow-xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Stats</h4>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-[11px] text-slate-400">Total Agents</span>
                         <span className="text-sm font-bold text-white">24</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-[11px] text-slate-400">Unsolved Vulns</span>
                         <span className="text-sm font-bold text-rose-500">12</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-[11px] text-slate-400">FIM Violations</span>
                         <span className="text-sm font-bold text-amber-500">2</span>
                       </div>
                    </div>
                  </div>
                  <div className="bg-indigo-600 rounded-3xl p-6 shadow-xl shadow-indigo-600/10">
                     <Zap size={24} className="text-white mb-2" />
                     <h4 className="text-sm font-bold text-white">System Integrity</h4>
                     <p className="text-[11px] text-indigo-100 leading-relaxed mb-4">All core systems report valid hardware checksums.</p>
                     <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-bold text-white transition-all">RUN DEEP SCAN</button>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d0d14] border border-white/5 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6"><AlertTriangle size={20} className="text-rose-400" /> Vulnerability Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_VULNS.map(vuln => (
                    <div key={vuln.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                      <div className="flex items-center justify-between mb-3">
                         <span className="px-2 py-0.5 bg-white/5 text-[9px] font-mono text-slate-500 rounded border border-white/10 group-hover:text-indigo-400 transition-colors">{vuln.cve}</span>
                         <span className={`text-[9px] font-bold ${vuln.severity === 'High' ? 'text-rose-500' : vuln.severity === 'Medium' ? 'text-amber-500' : 'text-blue-400'}`}>{vuln.severity.toUpperCase()}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1">{vuln.pkg} <span className="text-slate-600 font-normal">in</span> {vuln.asset}</h5>
                      <div className="flex items-center justify-between mt-4">
                         <span className={`text-[10px] font-bold ${vuln.status === 'OPEN' ? 'text-amber-400' : 'text-emerald-400'}`}>{vuln.status}</span>
                         <button className="text-[10px] font-bold text-indigo-400 hover:text-white transition-colors">FIX DETECTED</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="bg-[#0d0d14] border border-white/5 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Code size={20} className="text-indigo-400" /> Global Agent Configuration</h3>
                  <div className="bg-black rounded-xl p-4 font-mono text-[10px] text-emerald-400/80 overflow-x-auto border border-white/5">
                    <pre>{`<!-- Remote vulnerability scanner configuration -->
<vulnerability-detector>
  <enabled>yes</enabled>
  <interval>5m</interval>
  <ignore_time>6h</ignore_time>
  <run_on_start>yes</run_on_start>
  <provider name="ubuntu">
    <enabled>yes</enabled>
    <os>trusty</os>
    <os>xenial</os>
    <os>bionic</os>
    <os>focal</os>
    <os>jammy</os>
    <update_interval>1h</update_interval>
  </provider>
</vulnerability-detector>`}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* PERSISTENT LOG DRAWER FOOTER */}
        <div className="h-12 bg-[#0d0d14] border-t border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
           <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Clock size={12}/> DATA_RETENTION: 90D</span>
             <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-2"><Activity size={12}/> INGESTION: 4.2 EPS</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-600">SECUREPULSE_INTERNAL_MGMT</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           </div>
        </div>
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
