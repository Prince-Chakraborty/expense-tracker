'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{name?: string, email?: string, role?: string} | null>(null);
  const [expenses, setExpenses] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [categoryData, setCategoryData] = useState<Record<string, unknown>[]>([]);
  const [budgets, setBudgets] = useState<Record<string, unknown>[]>([]);
  const [recurring, setRecurring] = useState<Record<string, unknown>[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [budgetCategory, setBudgetCategory] = useState('food');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [budgetMonth, setBudgetMonth] = useState(new Date().toISOString().slice(0,7));

  const [recTitle, setRecTitle] = useState('');
  const [recAmount, setRecAmount] = useState('');
  const [recCategory, setRecCategory] = useState('food');
  const [recFrequency, setRecFrequency] = useState('monthly');
  const [recNextDate, setRecNextDate] = useState('');
  const [recNotes, setRecNotes] = useState('');

  const getToken = () => localStorage.getItem('accessToken');
  const categories = ['food','transport','shopping','health','entertainment','utilities','other'];

  useEffect(() => {
    setImportMessage('');
    setMessage('');
    const userData = localStorage.getItem('user');
    if (!userData) { router.push('/login'); return; }
    setUser(JSON.parse(userData));
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchExpenses();
    fetchStats();
    fetchCategoryData();
    fetchBudgets();
    fetchRecurring();
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/expenses', { headers: { Authorization: 'Bearer ' + getToken() } });
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch(e) {}
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/analytics/stats', { headers: { Authorization: 'Bearer ' + getToken() } });
      const data = await res.json();
      setStats(data.data);
    } catch(e) {}
  };

  const fetchCategoryData = async () => {
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/analytics/categories', { headers: { Authorization: 'Bearer ' + getToken() } });
      const data = await res.json();
      setCategoryData(data.data || []);
    } catch(e) {}
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/budgets?month=' + new Date().toISOString().slice(0,7), { headers: { Authorization: 'Bearer ' + getToken() } });
      const data = await res.json();
      setBudgets(data.budgets || []);
    } catch(e) {}
  };

  const fetchRecurring = async () => {
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/recurring', { headers: { Authorization: 'Bearer ' + getToken() } });
      const data = await res.json();
      setRecurring(data.recurring || []);
    } catch(e) {}
  };

  const handleAddExpense = async () => {
    if (!title || !amount || !date) { setMessage('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
        body: JSON.stringify({ title, amount: parseFloat(amount), category, date, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('success');
      setTitle(''); setAmount(''); setDate(''); setNotes('');
      fetchAll();
    } catch (err: unknown) { setMessage(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  const handleSetBudget = () => {
    const lv = parseFloat(budgetLimit);
    const mv = budgetMonth;
    const cv = budgetCategory;
    if (!lv) { setMessage('Please enter a monthly limit'); return; }
    fetch('https://expense-tracker-7n2z.onrender.com/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ category: cv, monthlyLimit: lv, month: mv }),
    }).then(r => r.json()).then(() => {
      setBudgetLimit('');
      setMessage('✅ Budget set successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetch('https://expense-tracker-7n2z.onrender.com/api/budgets?month=' + mv, { headers: { Authorization: 'Bearer ' + getToken() } })
        .then(r => r.json()).then(d => setBudgets(d.budgets || []));
    }).catch(() => setMessage('❌ Failed to set budget'));
  };

  const handleDeleteBudget = (id: string) => {
    fetch('https://expense-tracker-7n2z.onrender.com/api/budgets/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + getToken() } })
      .then(() => fetchBudgets());
  };

  const handleAddRecurring = () => {
    if (!recTitle || !recAmount || !recNextDate) { setMessage('Please fill all required fields'); return; }
    fetch('https://expense-tracker-7n2z.onrender.com/api/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ title: recTitle, amount: parseFloat(recAmount), category: recCategory, frequency: recFrequency, nextDate: recNextDate, notes: recNotes }),
    }).then(r => r.json()).then(() => {
      setRecTitle(''); setRecAmount(''); setRecNextDate(''); setRecNotes('');
      setMessage('✅ Recurring expense added!');
      setTimeout(() => setMessage(''), 3000);
      fetchRecurring();
    }).catch(() => setMessage('❌ Failed to add recurring expense'));
  };

  const handleDeleteRecurring = (id: string) => {
    fetch('https://expense-tracker-7n2z.onrender.com/api/recurring/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + getToken() } })
      .then(() => fetchRecurring());
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/import', { method: 'POST', headers: { Authorization: 'Bearer ' + getToken() }, body: formData });
    const data = await res.json();
    if (res.ok) {
      setImportMessage('✅ ' + (data.message || 'Import successful!'));
      fetchAll();
    } else {
      setImportMessage('❌ ' + (data.message || 'Import failed'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const pieData = {
    labels: categoryData.map(c => c.category as string),
    datasets: [{ data: categoryData.map(c => parseFloat(c.total as string)), backgroundColor: ['#6c63ff','#00d68f','#ffd166','#ff4d4d','#8b85ff','#06B6D4','#EC4899'], borderWidth: 0 }],
  };

  const barData = {
    labels: categoryData.map(c => c.category as string),
    datasets: [{ label: 'Amount (Rs.)', data: categoryData.map(c => parseFloat(c.total as string)), backgroundColor: 'rgba(108,99,255,0.8)', borderRadius: 8 }],
  };

  const barOptions = {
    plugins: { legend: { labels: { color: '#8888aa' } } },
    scales: { x: { ticks: { color: '#8888aa' }, grid: { color: '#2a2a3a' } }, y: { ticks: { color: '#8888aa' }, grid: { color: '#2a2a3a' } } },
  };

  const getCatIcon = (cat: string) => ({ food:'🍔', transport:'🚗', shopping:'🛍️', health:'💊', entertainment:'🎬', utilities:'⚡', other:'💰' }[cat] || '💰');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💳' },
    { id: 'add', label: 'Add Expense', icon: '➕' },
    { id: 'budget', label: 'Budget', icon: '🎯' },
    { id: 'recurring', label: 'Recurring', icon: '🔁' },
    { id: 'import', label: 'Import', icon: '📁' },
  ];

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '12px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ width: '240px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6c63ff, #00d68f)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💰</div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>ExpenseAI</span>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setMessage(''); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeTab === item.id ? 'rgba(108,99,255,0.15)' : 'transparent', color: activeTab === item.id ? '#6c63ff' : 'var(--text-secondary)', fontSize: '14px', fontWeight: activeTab === item.id ? '600' : '400', cursor: 'pointer', marginBottom: '4px', textAlign: 'left' }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6c63ff, #8b85ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: 'white' }}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '8px', color: '#ff4d4d', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Sign out</button>
        </div>
      </div>

      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Good day, {user?.name}! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Here is your financial overview</p>
            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Spent', value: 'Rs.' + Number(stats.total).toFixed(2), icon: '💸', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
                  { label: 'Transactions', value: stats.count, icon: '��', color: '#00d68f', bg: 'rgba(0,214,143,0.1)' },
                  { label: 'Avg per Transaction', value: 'Rs.' + Number(stats.average).toFixed(2), icon: '📈', color: '#ffd166', bg: 'rgba(255,209,102,0.1)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{s.label}</span>
                      <div style={{ width: '36px', height: '36px', background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{s.icon}</div>
                    </div>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}
            {categoryData.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Category Breakdown</h3>
                  <Pie data={pieData} options={{ plugins: { legend: { labels: { color: '#8888aa' } } } }} />
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Spending by Category</h3>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            )}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Recent Transactions</h3>
              {expenses.slice(0,5).map(exp => (
                <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(108,99,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{getCatIcon(exp.category)}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{exp.title}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{exp.date}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#ff4d4d' }}>-Rs.{exp.amount}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>All Expenses</h1>
              <button type="button" onClick={() => {
                fetch('https://expense-tracker-7n2z.onrender.com/api/export/csv', { headers: { Authorization: 'Bearer ' + getToken() } })
                  .then(r => r.blob()).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'expenses.csv'; a.click();
                  });
              }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #00d68f, #06B6D4)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>⬇️ Export CSV</button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              {expenses.length === 0 ? <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No expenses yet.</p> :
                expenses.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(108,99,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{getCatIcon(exp.category)}</div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{exp.title} {exp.isAnomaly && '⚠️'}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{exp.category} • {exp.date}</p>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#ff4d4d' }}>-Rs.{exp.amount}</p>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div style={{ maxWidth: '520px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>Add Expense</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
              {message === 'success' && <div style={{ background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#00d68f' }}>✅ Expense added!</div>}
              {message && message !== 'success' && <div style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: '#ff4d4d' }}>{message}</div>}
              <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
              <button type="button" onClick={handleAddExpense} disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'var(--border)' : 'linear-gradient(135deg, #6c63ff, #8b85ff)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                {loading ? 'Adding...' : '+ Add Expense'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>Budget Tracker 🎯</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Set Monthly Budget</h3>
              <input type="month" value={budgetMonth} onChange={e => setBudgetMonth(e.target.value)} style={inputStyle} />
              <select value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)} style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
              <input type="number" placeholder="Monthly Limit (Rs.)" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
              <button type="button" onClick={handleSetBudget} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #6c63ff, #8b85ff)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Set Budget</button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Budget Status</h3>
              {budgets.length === 0 ? <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No budgets set.</p> :
                budgets.map(b => (
                  <div key={b.id} style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: b.isExceeded ? '1px solid rgba(255,77,77,0.4)' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{b.category}</span>
                        {b.isExceeded && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#ff4d4d', fontWeight: '600' }}>⚠️ EXCEEDED</span>}
                      </div>
                      <button type="button" onClick={() => handleDeleteBudget(b.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px' }}>
                      <div style={{ height: '100%', width: b.percentage + '%', background: b.isExceeded ? '#ff4d4d' : Number(b.percentage) > 80 ? '#ffd166' : '#00d68f', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>Spent: Rs.{Number(b.spent).toFixed(2)}</span>
                      <span>Limit: Rs.{Number(b.monthlyLimit).toFixed(2)}</span>
                      <span style={{ color: b.isExceeded ? '#ff4d4d' : '#00d68f' }}>{b.isExceeded ? 'Over by Rs.' + (b.spent - b.monthlyLimit).toFixed(2) : 'Left: Rs.' + Number(b.remaining).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'recurring' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>Recurring Expenses ��</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Add Recurring Expense</h3>
              <input type="text" placeholder="Title (e.g. Netflix, Rent)" value={recTitle} onChange={e => setRecTitle(e.target.value)} style={inputStyle} />
              <input type="number" placeholder="Amount" value={recAmount} onChange={e => setRecAmount(e.target.value)} style={inputStyle} />
              <select value={recCategory} onChange={e => setRecCategory(e.target.value)} style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
              <select value={recFrequency} onChange={e => setRecFrequency(e.target.value)} style={inputStyle}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <input type="date" value={recNextDate} onChange={e => setRecNextDate(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Notes (optional)" value={recNotes} onChange={e => setRecNotes(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
              <button type="button" onClick={handleAddRecurring} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #6c63ff, #8b85ff)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>+ Add Recurring</button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px', fontWeight: '600' }}>Active Recurring Expenses</h3>
              {recurring.length === 0 ? <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No recurring expenses set.</p> :
                recurring.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '12px', marginBottom: '8px' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{r.title}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px' }}>{r.frequency} • Next: {r.nextDate} • {r.category}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#00d68f', fontWeight: '600', fontSize: '15px' }}>Rs.{r.amount}</span>
                      <button type="button" onClick={() => handleDeleteRecurring(r.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div style={{ maxWidth: '520px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>Import Expenses</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
              {importMessage && importMessage !== '' && <div style={{ background: importMessage.includes('error') || importMessage.includes('Error') ? 'rgba(255,77,77,0.1)' : 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '20px', color: importMessage.includes('error') || importMessage.includes('Error') ? '#ff4d4d' : '#00d68f' }}>{importMessage}</div>}
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>Upload a CSV or PDF file to automatically import expenses.</p>
              <label style={{ display: 'block', padding: '40px', background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '4px' }}>Click to upload</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>CSV or PDF up to 10MB</p>
                <input type="file" accept=".csv,.pdf" onChange={handleImport} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}