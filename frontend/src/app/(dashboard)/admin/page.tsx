'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{name?: string, email?: string, role?: string} | null>(null);
  const [stats, setStats] = useState<{totalUsers?: number, totalExpenses?: number, totalAmount?: number} | null>(null);
  const [users, setUsers] = useState<{id?: string, name?: string, email?: string, role?: string}[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const getToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { router.push('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'admin') { router.push('/user'); return; }
    setUser(parsed);
    fetch('https://expense-tracker-7n2z.onrender.com/api/admin/stats', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(r => r.json()).then(d => setStats(d));
    fetch('https://expense-tracker-7n2z.onrender.com/api/admin/users', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(r => r.json()).then(d => setUsers(d.users || []));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: '240px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff4d4d, #ffd166)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Admin Panel</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[{id:'overview',label:'Overview',icon:'📊'},{id:'users',label:'Users',icon:'👥'},{id:'settings',label:'Settings',icon:'⚙️'}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeTab === item.id ? 'rgba(255,77,77,0.15)' : 'transparent', color: activeTab === item.id ? '#ff4d4d' : 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', marginBottom: '4px', textAlign: 'left', fontWeight: activeTab === item.id ? '600' : '400' }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{user?.name}</p>
          <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#ff4d4d' }}>Administrator</p>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '8px', color: '#ff4d4d', fontSize: '13px', cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Admin Overview</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Platform statistics</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#6c63ff' },
                { label: 'Total Transactions', value: stats?.totalExpenses || 0, icon: '📝', color: '#00d68f' },
                { label: 'Total Amount', value: 'Rs.' + Number(stats?.totalAmount || 0).toFixed(2), icon: '💸', color: '#ffd166' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px', fontWeight: '600' }}>System Status</h3>
              {[
                { label: 'PostgreSQL', status: 'Online', color: '#00d68f' },
                { label: 'Redis Cache', status: 'Online', color: '#00d68f' },
                { label: 'WebSocket', status: 'Online', color: '#00d68f' },
                { label: 'AWS OCR', status: 'Needs Config', color: '#ffd166' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.label}</span>
                  <span style={{ color: item.color, fontSize: '13px', fontWeight: '600' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>Users</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              {users.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', marginBottom: '8px', background: 'var(--bg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6c63ff, #8b85ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600' }}>{u.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{u.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>
                  <span style={{ color: u.role === 'admin' ? '#ff4d4d' : '#6c63ff', fontSize: '12px', fontWeight: '600', background: u.role === 'admin' ? 'rgba(255,77,77,0.1)' : 'rgba(108,99,255,0.1)', padding: '4px 12px', borderRadius: '20px' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>Settings</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', maxWidth: '480px' }}>
              {[['App','ExpenseAI'],['Version','1.0.0'],['Database','PostgreSQL 15'],['Cache','Redis 7'],['Users', stats?.totalUsers || 0]].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
