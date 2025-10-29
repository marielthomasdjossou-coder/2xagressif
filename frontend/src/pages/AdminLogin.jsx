import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api.js';

export default function AdminLogin(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    if (!username || !password) { setMsg('Renseignez username et password.'); return; }
    setMsg('');
    setLoading(true);
    try{
      const { token } = await login(username, password);
      localStorage.setItem('token', token);
      setMsg('Connecté. Redirection...');
      navigate('/dashboard');
    }catch(err){
      const status = err?.response?.status;
      if (status === 401) setMsg('Identifiants invalides');
      else setMsg(err.response?.data?.message || err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold text-dark">Connexion Admin</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="w-full border rounded-xl px-4 py-3" autoComplete="username" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" className="w-full border rounded-xl px-4 py-3" autoComplete="current-password" />
        <button className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed" type="submit" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
    </section>
  );
}
