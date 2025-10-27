import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api.js';

export default function AdminLogin(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    try{
      const { token } = await login(username, password);
      localStorage.setItem('token', token);
      setMsg('Connecté. Redirection...');
      navigate('/dashboard');
    }catch(err){
      setMsg(err.response?.data?.message || 'Erreur de connexion');
    }
  }

  return (
    <section className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold text-dark">Connexion Admin</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="w-full border rounded-xl px-4 py-3" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" className="w-full border rounded-xl px-4 py-3" />
        <button className="btn-primary w-full" type="submit">Se connecter</button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
    </section>
  );
}
