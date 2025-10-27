import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getParfum, imageUrl } from '../api.js';
import { slowFadeUp, slowScaleIn } from '../animations/variants.js';

export default function ParfumDetail(){
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=>{
    setLoading(true); setError('');
    getParfum(id)
      .then(setItem)
      .catch(e=> setError(e.response?.data?.message || 'Erreur de chargement'))
      .finally(()=>setLoading(false));
  },[id]);

  if (loading) {
    return (
      <section className="px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] rounded-2xl bg-beige200 animate-pulse" style={{animationDuration:'1.3s'}}></div>
          <div className="space-y-3">
            <div className="h-6 w-2/3 bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
            <div className="h-4 w-full bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
            <div className="h-4 w-5/6 bg-beige200 rounded animate-pulse" style={{animationDuration:'1.3s'}}></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="px-4 sm:px-6">
        <p className="text-red-600">{error || 'Introuvable'}</p>
        <Link to="/parfums" className="btn-primary mt-4 inline-flex items-center justify-center">Retour</Link>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6">
      <div className="mb-5 sm:mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-beige800">{item.nom}</h1>
        <Link to="/parfums" className="text-beige800 hover:underline">Retour</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <motion.div variants={slowScaleIn} initial="hidden" animate="show" className="rounded-2xl bg-white p-3 flex items-center justify-center h-64 md:h-[32rem]">
          {item.image ? (
            <img
              src={imageUrl(item.image)}
              alt={item.nom}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-auto max-h-full object-contain"
            />
          ) : (
            <div className="aspect-[4/3] w-full flex items-center justify-center text-gray-400 bg-beige rounded-xl">Aucune image</div>
          )}
        </motion.div>
        <motion.div variants={slowFadeUp} initial="hidden" animate="show" className="space-y-3">
          <p className="text-gray-700">{item.description || 'Pas de description'}</p>
          {item.details && (
            <div>
              <h2 className="font-semibold text-dark mb-1">Détails</h2>
              <p className="text-gray-700 whitespace-pre-line">{item.details}</p>
            </div>
          )}
          <div className="pt-2">
            <span className="text-xl font-bold text-dark">{item.prix} CFA</span>
          </div>
          <a
            href={`https://wa.me/${'+2290196486557'.replace(/^[+]/,'')}?text=${encodeURIComponent(`Bonjour, je veux commander le parfum ${item.nom} au prix de ${item.prix}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex items-center justify-center"
          >
            Commandez
          </a>
        </motion.div>
      </div>
    </section>
  );
}
