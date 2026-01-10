
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Shield, 
  Users, 
  Cpu, 
  FileText, 
  Terminal, 
  LayoutDashboard, 
  Settings, 
  Search,
  CheckCircle2,
  Code,
  Lock,
  BarChart3,
  Activity,
  AlertTriangle,
  ArrowRight,
  Database,
  ArrowUpRight,
  Clock,
  Server,
  Zap,
  Filter,
  ClipboardList,
  User,
  History,
  MessageSquare,
  Bug
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

/**
 * --- TYPES BASED ON PDF DATABASE DESIGN ---
 */

type UserType = 'Admin' | 'User';

interface SecurePulseLogin {
  id: number;
  email: string;
  userType: UserType;
  is_active: boolean;
  last_login: string;
}

interface SecurePulseUserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  place: string;
  login_id: number;
}

interface SecurePulseAsset {
  id: number;
  asset_name: string;
  hostname: string;
  ip_address: string;
  asset_type: string;
  environment: 'lab' | 'prod';
  criticality: 'high' | 'medium' | 'low';
  created_at: string;
}

interface SecurePulseAgent {
  id: number;
  asset_id: number;
  wazuh_agent_id: string;
  wazuh_agent_name: string;
  status: 'active' | 'disconnected';
  version: string;
  last_seen: string;
}

interface SecurePulseAlertReference {
  id: number;
  asset_id: number;
  agent_id: number;
  rule_id: number;
  severity: number;
  title: string;
  description: string;
  occurred_at: string;
  status: 'active' | 'acknowledged';
  wazuh_index: string;
}

interface SecurePulseAcknowledgement {
  id: number;
  alert_ref_id: number;
  user_id: number;
  ack_status: 'acknowledged' | 'ignored' | 'false_positive';
  note: string;
  created_at: string;
}

interface SecurePulseIncident {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'closed';
  created_by: number;
  assigned_to: number | null;
  created_at: string;
}

interface LoginAudit {
  audit_id: number;
  user_id: number | null;
  email_input: string;
  ip_address: string;
  user_agent: string;
  success: number;
  fail_reason: string | null;
  created_at: string;
}

/**
 * --- MOCK DATA (SYCHRONIZED WITH PDF NORMALIZED TABLES) ---
 */

const MOCK_LOGINS: SecurePulseLogin[] = [
  { id: 1, email: 'admin@securepulse.local', userType: 'Admin', is_active: true, last_login: '2025-12-29 10:00:00' },
  { id: 2, email: 'rahul@securepulse.local', userType: 'User', is_active: true, last_login: '2025-12-29 10:10:00' },
];

const MOCK_PROFILES: SecurePulseUserProfile[] = [
  { id: 1, name: 'Ananya Nair', email: 'admin@securepulse.local', phone: '9876543210', place: 'Kochi', login_id: 1 },
  { id: 2, name: 'Rahul K', email: 'rahul@securepulse.local', phone: '9123456780', place: 'Trivandrum', login_id: 2 },
];

const MOCK_ASSETS: SecurePulseAsset[] = [
  { id: 201, asset_name: 'WebApp-Server', hostname: 'web01', ip_address: '192.168.1.20', asset_type: 'web-server', environment: 'lab', criticality: 'high', created_at: '2025-12-29 09:45:00' },
  { id: 202, asset_name: 'DB-Server', hostname: 'db01', ip_address: '192.168.1.30', asset_type: 'database', environment: 'lab', criticality: 'medium', created_at: '2025-12-29 09:50:00' },
];

const MOCK_AGENTS: SecurePulseAgent[] = [
  { id: 301, asset_id: 201, wazuh_agent_id: '001', wazuh_agent_name: 'web01-agent', status: 'active', version: '4.x', last_seen: '2025-12-29 10:16:00' },
  { id: 302, asset_id: 202, wazuh_agent_id: '002', wazuh_agent_name: 'db01-agent', status: 'active', version: '4.x', last_seen: '2025-12-29 10:15:40' },
];

const MOCK_ALERTS: SecurePulseAlertReference[] = [
  { id: 5001, asset_id: 201, agent_id: 301, rule_id: 5710, severity: 10, title: 'Multiple failed logins', description: 'Possible brute force detected', occurred_at: '2025-12-29 10:14:30', status: 'acknowledged', wazuh_index: 'wazuh-alerts-2025.12.29' },
  { id: 5002, asset_id: 201, agent_id: 301, rule_id: 5503, severity: 7, title: 'File changed in uploads', description: 'FIM triggered on sensitive directory', occurred_at: '2025-12-29 10:18:05', status: 'active', wazuh_index: 'wazuh-alerts-2025.12.29' },
  { id: 5003, asset_id: 202, agent_id: 302, rule_id: 6010, severity: 12, title: 'Suspicious DB access', description: 'Unauthorized query pattern detected', occurred_at: '2025-12-29 10:20:00', status: 'active', wazuh_index: 'wazuh-alerts-2025.12.29' },
];

const MOCK_LOGIN_AUDITS: LoginAudit[] = [
  { audit_id: 1001, user_id: 1, email_input: 'admin@securepulse.local', ip_address: '192.168.1.10', user_agent: 'Chrome', success: 1, fail_reason: null, created_at: '2025-12-29 10:12:00' },
  { audit_id: 1002, user_id: null, email_input: 'wrong@securepulse.local', ip_address: '192.168.1.50', user_agent: 'Firefox', success: 0, fail_reason: 'invalid_user', created_at: '2025-12-29 10:13:30' },
  { audit_id: 1003, user_id: 2, email_input: 'rahul@securepulse.local', ip_address: '192.168.1.20', user_agent: 'Chrome', success: 0, fail_reason: 'wrong_password', created_at: '2025-12-29 10:14:10' },
  { audit_id: 1004, user_id: 2, email_input: 'rahul@securepulse.local', ip_address: '192.168.1.20', user_agent: 'Chrome', success: 1, fail_reason: null, created_at: '2025-12-29 10:15:05' },
];

const MOCK_INCIDENTS: SecurePulseIncident[] = [
  { id: 7001, title: 'Brute force attempt on web01', description: 'Multiple failed logins detected on web app', priority: 'high', status: 'in_progress', created_by: 1, assigned_to: 1, created_at: '2025-12-29 10:16:30' },
  { id: 7002, title: 'Upload directory integrity issue', description: 'FIM detected file modification in uploads', priority: 'medium', status: 'open', created_by: 1, assigned_to: null, created_at: '2025-12-29 10:19:00' },
];

/**
 * --- MAIN APPLICATION ---
 */

const App = () => {
  const [currentUser, setCurrentUser] = useState<SecurePulseLogin | null>(null);
  const [currentProfile, setCurrentProfile] = useState<SecurePulseUserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<any[]>([]);
  const [showAckModal, setShowAckModal] = useState<number | null>(null);
  const [ackNote, setAckNote] = useState('');

  // Auto-generate some live telemetry
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      const randomAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
      setLogs(prev => [{
        ts: new Date().toLocaleTimeString(),
        event: randomAlert.title.toUpperCase().replace(/\s/g, '_'),
        severity: randomAlert.severity >= 10 ? 'CRITICAL' : 'WARNING',
        details: `${randomAlert.description} on ${randomAlert.wazuh_index}`
      }, ...prev].slice(0, 50));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogin = (email: string) => {
    const user = MOCK_LOGINS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setCurrentProfile(MOCK_PROFILES.find(p => p.login_id === user.id) || null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
              <Shield size={48} className="text-white" />
            </div>
            <h1 className="text-6xl font-extrabold text-white tracking-tighter mb-4 leading-none">SECURE<span className="text-indigo-500">PULSE</span></h1>
            <p className="text-slate-400 text-xl font-medium max-w-sm">Normalized SIEM Monitoring & Asset Integrity Verification.</p>
            <div className="mt-12 flex items-center gap-6">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-[#050508] bg-slate-800" />)}
               </div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active SOC Nodes: 3/3 Online</p>
            </div>
          </div>
          <div className="bg-[#0d0d14] p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">Role-Based Entry</h2>
            <div className="space-y-4">
              <button onClick={() => handleLogin('admin@securepulse.local')} className="group w-full p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/50 transition-all text-left flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400">SOC Admin</h3>
                  <p className="text-xs text-slate-500">Access Global Audit & Incidents</p>
                </div>
                <Lock size={24} className="text-indigo-500" />
              </button>
              <button onClick={() => handleLogin('rahul@securepulse.local')} className="group w-full p-6 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400">Security User</h3>
                  <p className="text-xs text-slate-500">Asset Alerts & Feedbacks</p>
                </div>
                <Users size={24} className="text-emerald-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.userType === 'Admin';

  return (
    <div className="flex h-screen bg-[#050508] text-slate-300 overflow-hidden font-sans">
      {/* SIDEBAR - DFD LEVEL 1 LOGIC */}
      <aside className="w-72 border-r border-white/5 bg-[#0d0d14] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'} shadow-xl`}>
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">SECURE<span className="text-indigo-400">PULSE</span></h1>
            <p className="text-[10px] text-slate-600 font-mono font-bold uppercase mt-1 tracking-widest">Wazuh Integrated</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={Server} label={isAdmin ? "Asset Mapping" : "My Assets"} active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={ClipboardList} label="Incidents" active={activeTab === 'incidents'} onClick={() => setActiveTab('incidents')} />
          {isAdmin && <NavItem icon={History} label="Login Audits" active={activeTab === 'audits'} onClick={() => setActiveTab('audits')} />}
          <NavItem icon={FileText} label="Audit Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={Bug} label="Vulnerabilities" active={activeTab === 'vulns'} onClick={() => setActiveTab('vulns')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 bg-white/5 p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
              {currentProfile?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentProfile?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{currentUser.userType} • {currentProfile?.place}</p>
            </div>
          </div>
          <button onClick={() => setCurrentUser(null)} className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold rounded-xl border border-rose-500/20 transition-all uppercase tracking-widest">
            Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0d0d14]/40 backdrop-blur-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Wazuh Engine Active</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search indices..." className="bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all w-64" />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"><Settings size={20} /></button>
          </div>
        </header>

        {/* VIEW AREA */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#050508]">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <StatCard label="Total Assets" value={MOCK_ASSETS.length} icon={Server} color="indigo" />
                 <StatCard label="Active Agents" value={MOCK_AGENTS.length} icon={Cpu} color="emerald" />
                 <StatCard label="Open Cases" value={MOCK_INCIDENTS.filter(i => i.status !== 'closed').length} icon={ClipboardList} color="rose" />
                 <StatCard label="Total Alerts" value={MOCK_ALERTS.length} icon={Activity} color="amber" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0d0d14] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                   <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                     <BarChart3 size={20} className="text-indigo-400" /> Threat Intensity Pulse
                   </h3>
                   <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[{t: '08:00', v: 45}, {t: '10:00', v: 120}, {t: '12:00', v: 80}, {t: '14:00', v: 240}, {t: '16:00', v: 190}, {t: '18:00', v: 110}]}>
                           <defs>
                              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                           <YAxis hide />
                           <Tooltip contentStyle={{backgroundColor: '#0d0d14', border: 'none', borderRadius: '12px'}} />
                           <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-[#0d0d14] border border-white/5 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 self-start">Integrity Score</h3>
                   <div className="relative h-48 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={[{v: 85, c: '#10b981'}, {v: 15, c: '#1e1e2e'}]} innerRadius={70} outerRadius={90} dataKey="v" stroke="none">
                               <Cell fill="#10b981" /><Cell fill="#1e1e2e" />
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-4xl font-extrabold text-white">85<span className="text-slate-500 text-lg">%</span></span>
                         <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Optimal</span>
                      </div>
                   </div>
                   <div className="w-full grid grid-cols-2 gap-4 mt-10">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                         <p className="text-[10px] font-bold text-slate-500 uppercase">FIM Status</p>
                         <p className="text-sm font-bold text-emerald-400 mt-1 uppercase">Stable</p>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                         <p className="text-[10px] font-bold text-slate-500 uppercase">Vulns</p>
                         <p className="text-sm font-bold text-amber-400 mt-1 uppercase">12 Open</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* LIVE ALERTS TABLE - WITH ACK LOGIC */}
              <div className="bg-[#0d0d14] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                   <h3 className="text-lg font-bold text-white flex items-center gap-3">
                     <Activity size={20} className="text-indigo-400" /> SecurePulse Alerts Reference
                   </h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-black/40 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <th className="px-8 py-4">Ref ID</th>
                           <th className="px-8 py-4">Event</th>
                           <th className="px-8 py-4">Severity</th>
                           <th className="px-8 py-4">Wazuh Index</th>
                           <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {MOCK_ALERTS.map(alert => (
                          <tr key={alert.id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-8 py-5 text-xs font-mono text-indigo-400">#REF-{alert.id}</td>
                             <td className="px-8 py-5">
                                <div className="flex flex-col">
                                   <span className="text-sm font-bold text-white">{alert.title}</span>
                                   <span className="text-[10px] text-slate-500 mt-0.5">{alert.description}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${alert.severity >= 10 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                   LVL {alert.severity}
                                </span>
                             </td>
                             <td className="px-8 py-5 text-[10px] font-mono text-slate-500">{alert.wazuh_index}</td>
                             <td className="px-8 py-5 text-right">
                                {alert.status === 'active' ? (
                                   <button onClick={() => setShowAckModal(alert.id)} className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-bold text-white hover:bg-indigo-500 transition-all uppercase tracking-widest">Acknowledge</button>
                                ) : (
                                   <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-2 justify-end">
                                      <CheckCircle2 size={14}/> ACKNOWLEDGED
                                   </span>
                                )}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8 animate-in slide-in-from-right">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">SecurePulse Asset Map</h2>
                    <p className="text-slate-500 mt-1">Mapping monitored systems to Wazuh Agent IDs.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {MOCK_ASSETS.map(asset => {
                    const agent = MOCK_AGENTS.find(a => a.asset_id === asset.id);
                    return (
                      <div key={asset.id} className="bg-[#0d0d14] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative group hover:border-indigo-500/30 transition-all">
                         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-8 shadow-inner">
                            <Server size={28} />
                         </div>
                         <h4 className="text-xl font-bold text-white mb-2 leading-none">{asset.asset_name}</h4>
                         <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">{asset.hostname} • {asset.ip_address}</p>
                         
                         <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
                            <Detail label="Wazuh Agent ID" value={`#${agent?.wazuh_agent_id}`} mono />
                            <Detail label="Environment" value={asset.environment.toUpperCase()} />
                            <Detail label="Status" value={agent?.status.toUpperCase()} color={agent?.status === 'active' ? 'text-emerald-400' : 'text-rose-400'} />
                         </div>
                         <button className="w-full mt-10 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5 transition-all">Inspect Endpoint</button>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          {activeTab === 'audits' && isAdmin && (
            <div className="space-y-8 animate-in fade-in">
               <div className="bg-[#0d0d14] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-white/5 bg-black/20">
                     <h3 className="text-lg font-bold text-white flex items-center gap-3"><History size={20} className="text-indigo-400" /> SecurePulse Login Audits</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-black/40 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                             <th className="px-8 py-4">Audit ID</th>
                             <th className="px-8 py-4">User Identity</th>
                             <th className="px-8 py-4">IP Address</th>
                             <th className="px-8 py-4">Status</th>
                             <th className="px-8 py-4">Timestamp</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {MOCK_LOGIN_AUDITS.map(audit => (
                            <tr key={audit.audit_id} className="hover:bg-white/5 transition-colors">
                               <td className="px-8 py-4 font-mono text-slate-600">#{audit.audit_id}</td>
                               <td className="px-8 py-4">
                                  <div className="flex flex-col">
                                     <span className="text-sm font-bold text-white">{audit.email_input}</span>
                                     <span className="text-[10px] text-slate-500">{audit.user_agent}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-4 font-mono text-xs text-slate-400">{audit.ip_address}</td>
                               <td className="px-8 py-4">
                                  {audit.success ? (
                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold border border-emerald-500/20">SUCCESS</span>
                                  ) : (
                                    <div className="flex flex-col">
                                      <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-500 text-[9px] font-bold border border-rose-500/20 w-fit">FAILED</span>
                                      <span className="text-[9px] text-slate-600 mt-1 uppercase font-bold">{audit.fail_reason}</span>
                                    </div>
                                  )}
                               </td>
                               <td className="px-8 py-4 text-xs text-slate-500 font-mono">{audit.created_at}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="bg-gradient-to-br from-indigo-900/10 to-transparent border border-indigo-500/10 p-12 rounded-[2.5rem] flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-6 shadow-2xl">
                     <FileText size={40} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white">Security Report History</h2>
                  <p className="text-slate-500 max-w-md mt-2">Historical audit trails generated for Department of Cyber Forensic compliance verification.</p>
                  <div className="flex gap-4 mt-10">
                    <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">NEW REPORT</button>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">EXPORT DATA</button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1,2].map(i => (
                    <div key={i} className="bg-[#0d0d14] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-indigo-500/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-all">
                             <FileText size={24} />
                          </div>
                          <div>
                             <h5 className="font-bold text-white text-sm">Security Audit Summary V{i}.0</h5>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generated: 2025-12-29</p>
                          </div>
                       </div>
                       <ArrowUpRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>

        {/* LOG TERMINAL FOOTER - LIVE TAIL */}
        <div className="h-48 bg-[#0d0d14] border-t border-white/10 flex flex-col z-40">
           <div className="px-8 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Terminal size={14} className="text-indigo-400" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wazuh Live Tail: Ingesting Assets [2/2]</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Socket Online</span>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/10">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-700 italic">Listening for telemetry heartbeat...</div>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className="flex gap-4 mb-1">
                     <span className="text-slate-600">[{l.ts}]</span>
                     <span className={`font-bold ${l.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-400'}`}>{l.event}</span>
                     <span className="text-slate-500 truncate">{l.details}</span>
                  </div>
                ))
              )}
           </div>
        </div>
      </main>

      {/* ACK MODAL */}
      {showAckModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-md bg-[#0d0d14] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
              <h3 className="text-2xl font-bold text-white mb-2">Acknowledge Alert</h3>
              <p className="text-sm text-slate-500 mb-8">Provide feedback on Ref ID: <span className="text-indigo-400 font-bold font-mono">#{showAckModal}</span></p>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-2 tracking-widest">Incident Note</label>
                    <textarea 
                      value={ackNote}
                      onChange={e => setAckNote(e.target.value)}
                      placeholder="e.g. Verified legitimate developer login from Kochi office..."
                      className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowAckModal(null)} className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-all uppercase tracking-widest">Cancel</button>
                    <button onClick={() => setShowAckModal(null)} className="flex-1 py-4 bg-indigo-600 rounded-2xl text-[10px] font-bold text-white hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-lg shadow-indigo-600/20">Save Acknowledgment</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

/**
 * --- UI UTILITIES ---
 */

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-semibold transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} /> {label}
  </button>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-[#0d0d14] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
     <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`p-2 bg-${color}-500/10 rounded-xl text-${color}-400 group-hover:scale-110 transition-transform`}>
           <Icon size={18} />
        </div>
     </div>
     <div className="text-3xl font-extrabold text-white leading-none">{value}</div>
  </div>
);

const Detail = ({ label, value, mono, color }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
    <span className={`text-xs font-bold ${color || 'text-white'} ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
