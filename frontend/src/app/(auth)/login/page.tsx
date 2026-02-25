'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://expense-tracker-7n2z.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/user');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', right: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(0,214,143,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-green))',
            borderRadius: '14px',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px',
          }}>💰</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to your expense tracker</p>
        </div>
        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: 'var(--accent-red)', fontSize: '14px',
          }}>{error}</div>
        )}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px',
              outline: 'none', transition: 'border-color 0.2s',
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '15px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <a href="https://expense-tracker-7n2z.onrender.com/api/auth/google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500', textDecoration: 'none', marginBottom: '20px' }}>
          <span style={{ fontSize: '18px' }}>🔗</span> Continue with Google
        </a>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: '500' }}>Create one</a>
        </p>
      </div>
    </div>
  );
}