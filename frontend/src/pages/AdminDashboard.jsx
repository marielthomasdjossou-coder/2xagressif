import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParfums, createParfum, updateParfum, deleteParfum, imageUrl } from '../api.js';

export default function AdminDashboard(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // parfum object or null
  const [form, setForm] = useState({ nom: '', prix: '', description: '', details: '', imageFile: null });
  const navigate = useNavigate();
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  function hasToken(){
    return !!localStorage.getItem('token');
  }

  async function load(){
    setLoading(true); setError('');
    try{
      const data = await getParfums();
      setItems(data);
    }catch(e){
      setError('Erreur lors du chargement');
    }finally{ setLoading(false); }
  }

  useEffect(()=>{ load(); },[]);

  // Route protection: redirect to /admin if no token
  useEffect(()=>{
    if (!localStorage.getItem('token')) navigate('/admin');
  },[navigate]);

  function onChange(e){
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files[0];
      if (!file) { setForm(f => ({ ...f, imageFile: null })); return; }
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(file.type)) {
        setError('Type de fichier non autorisé (jpeg, png, webp, gif).');
        e.target.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Fichier trop volumineux (max 2MB).');
        e.target.value = '';
        return;
      }
      setError('');
      setForm(f => ({ ...f, imageFile: file }));
    }
    else setForm(f => ({ ...f, [name]: value }));
  }

  function startCreate(){
    setEditing(null);
    setForm({ nom: '', prix: '', description: '', details: '', imageFile: null });
    // Scroll to top to show the form clearly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(()=>{ nameInputRef.current?.focus(); }, 150);
  }

  function startEdit(p){
    setEditing(p);
    setForm({ nom: p.nom || '', prix: p.prix || '', description: p.description || '', details: p.details || '', imageFile: null });
    // Bring the user to the top where the form is located
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(()=>{ nameInputRef.current?.focus(); }, 150);
  }

  async function onSubmit(e){
    e.preventDefault();
    if (!hasToken()) { alert('Connectez-vous d\'abord.'); return; }
    try{
      if (editing) {
        const payload = { ...form };
        if (!payload.imageFile) delete payload.imageFile;
        await updateParfum(editing.id, payload);
      } else {
        await createParfum(form);
      }
      await load();
      startCreate();
    }catch(e){
      const msg = e.response?.data?.message || e.message || 'Erreur';
      setError(msg);
    }
  }

  async function onDelete(id){
    if (!hasToken()) { alert('Connectez-vous d\'abord.'); return; }
    if (!confirm('Supprimer ce parfum ?')) return;
    try{
      await deleteParfum(id);
      await load();
    }catch(e){
      const msg = e.response?.data?.message || e.message || 'Erreur';
      setError(msg);
    }
  }

  return (
    <section className="px-4 sm:px-6">
      <div className="mb-5 sm:mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-beige800">Admin Dashboard</h2>
        <button onClick={startCreate} className="rounded-xl px-4 py-2 bg-beige800 text-white hover:bg-beige600 transition">Nouveau</button>
      </div>

      {/* Formulaire */}
      <form ref={formRef} onSubmit={onSubmit} className="card p-4 sm:p-6 space-y-3">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <input ref={nameInputRef} name="nom" value={form.nom} onChange={onChange} required placeholder="Nom" className="w-full border rounded-xl px-4 py-3" />
          <input name="prix" value={form.prix} onChange={onChange} required placeholder="Prix" className="w-full border rounded-xl px-4 py-3" />
        </div>
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border rounded-xl px-4 py-3" />
        <textarea name="details" value={form.details} onChange={onChange} placeholder="Détails" className="w-full border rounded-xl px-4 py-3" />
        <input name="imageFile" onChange={onChange} type="file" accept="image/*" className="w-full" />
        {editing && editing.image && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Image actuelle:</p>
            <img src={imageUrl(editing.image)} alt="Aperçu" className="h-24 rounded-lg object-cover" />
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button type="submit" className="btn-primary">{editing ? 'Mettre à jour' : 'Créer'}</button>
        </div>
      </form>

      {/* Liste */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          Array.from({length: 6}).map((_,i)=> (
            <div key={i} className="card p-3 sm:p-4">
              <div className="aspect-[4/3] rounded-xl bg-beige200 animate-pulse" style={{animationDuration:'1.3s'}}></div>
              <div className="mt-3 space-y-2">
                <div className="h-4 w-2/3 bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
                <div className="h-3 w-full bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
              </div>
            </div>
          ))
        ) : (
          items.map(p => (
            <div key={p.id} className="card p-3 sm:p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-beige">
                {p.image ? (
                  <img src={imageUrl(p.image)} alt={p.nom} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Aucune image</div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-dark font-semibold">{p.nom}</h3>
                <span className="text-sm">{p.prix} CFA</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>
              <div className="mt-3 flex gap-3">
                <button onClick={()=>startEdit(p)} className="rounded-xl px-3 py-2 border">Modifier</button>
                <button onClick={()=>onDelete(p.id)} className="rounded-xl px-3 py-2 border text-red-600 border-red-200">Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
}
