import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getParfums } from '../api.js';
import ParfumCard from '../components/ParfumCard.jsx';

export default function Parfums(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getParfums().then(setItems).finally(()=>setLoading(false));
  },[]);

  return (
    <section className="px-4 sm:px-6">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-beige800">Nos Parfums</h2>
        <p className="text-beige600 text-sm md:text-base">Explorez notre collection</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {items.map(p => <ParfumCard key={p.id} parfum={p} />)}
        </motion.div>
      )}
    </section>
  );
}
