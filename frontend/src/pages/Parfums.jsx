import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getParfumsPaged } from '../api.js';
import ParfumCard from '../components/ParfumCard.jsx';

export default function Parfums(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(()=>{
    loadPage(0);
  },[]);

  async function loadPage(p){
    const showSkeleton = p === 0 && items.length === 0;
    if (showSkeleton) setLoading(true);
    try {
      const { items: batch = [], total: t } = await getParfumsPaged(p, limit);
      setItems(prev => p === 0 ? batch : [...prev, ...batch]);
      setTotal(typeof t === 'number' ? t : (p === 0 ? batch.length : (items.length + batch.length)));
      setPage(p);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erreur chargement parfums:', e?.message || e);
    } finally {
      if (showSkeleton) setLoading(false);
    }
  }

  const canLoadMore = items.length < total;

  return (
    <section className="px-4 sm:px-6">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-beige800">Nos Parfums</h2>
        <p className="text-beige600 text-sm md:text-base">Explorez notre collection</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({length: 6}).map((_,i)=> (
            <div key={i} className="card p-3 sm:p-4">
              <div className="aspect-[4/3] rounded-xl bg-beige200 animate-pulse" style={{animationDuration:'1.3s'}}></div>
              <div className="mt-3 space-y-2">
                <div className="h-4 w-2/3 bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
                <div className="h-3 w-full bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
                <div className="h-3 w-5/6 bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
                <div className="flex gap-3 pt-2">
                  <div className="h-4 w-20 bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
                  <div className="h-9 flex-1 bg-beige200 rounded-xl animate-pulse" style={{animationDuration:'1.3s'}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {items.map(p => <ParfumCard key={p.id} parfum={p} />)}
        </motion.div>
      ) : (
        <div className="text-center text-gray-500">Aucun parfum à afficher.</div>
      )}
      {!loading && canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button onClick={()=>loadPage(page+1)} className="btn-primary">
            Afficher plus
          </button>
        </div>
      )}
    </section>
  );
}
