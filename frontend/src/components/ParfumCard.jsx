import { motion } from 'framer-motion';
import { slowFadeUp, slowScaleIn } from '../animations/variants.js';
import { Link } from 'react-router-dom';
import { imageUrl } from '../api.js';

const WHATSAPP = '+2290196486557';

export default function ParfumCard({ parfum }) {
  const { id, nom, prix, description, image } = parfum;
  const message = encodeURIComponent(`Bonjour, je veux commander le parfum ${nom} au prix de ${prix}.`);
  const wa = `https://wa.me/${WHATSAPP.replace(/^[+]/,'')}?text=${message}`;

  return (
    <motion.div
      variants={slowFadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -2 }}
      className="card group p-3 sm:p-4"
    >
      <div className="flex items-start gap-3 md:block">
        <Link to={`/parfums/${id}`} className="block shrink-0">
          <div className="w-24 h-24 md:w-auto md:h-auto md:aspect-[1/1] overflow-hidden rounded-xl bg-beige">
            {image ? (
              <motion.img
                variants={slowScaleIn}
                src={imageUrl(image)}
                alt={nom}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 96px"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-900"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Aucune image</div>
            )}
          </div>
        </Link>
        <div className="mt-0 md:mt-3 flex-1 min-w-0">
          <Link to={`/parfums/${id}`} className="hover:underline block">
            <h3 className="text-base md:text-lg font-semibold text-dark break-words line-clamp-2">{nom}</h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-dark font-semibold">{prix} CFA</span>
            <a
              className="btn-primary text-sm w-full sm:w-auto inline-flex items-center justify-center transition duration-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beige200 focus-visible:ring-offset-2"
              href={wa}
              target="_blank"
              rel="noreferrer"
              aria-label={`Commander ${nom} via WhatsApp`}
            >
              Commandez
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
