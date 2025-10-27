import { motion } from 'framer-motion';
import { slowFadeUp, slowScaleIn, slowStagger } from '../animations/variants.js';
import { Link } from 'react-router-dom';
import heroImg from '../images/hero.png';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-beige100 via-white to-white">
      <div className="grid md:grid-cols-2 gap-6 items-center p-6 sm:p-8 md:p-12">
        <motion.div variants={slowStagger} initial="hidden" animate="show">
          <motion.h1 variants={slowFadeUp} className="text-3xl md:text-5xl font-bold text-dark leading-[1.4] md:leading-[1.5] tracking-wide">
            Viens prendre ton parfum chez <strong className="text-beige800">2XAGRESSIF</strong> — <span className="text-beige800">Répete PARFUM</span>
          </motion.h1>
          <motion.p variants={slowFadeUp} className="mt-4 text-gray-600">Découvrez notre sélection de parfums de luxe. Commandez maintenant.</motion.p>
          <motion.div variants={slowFadeUp} className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/parfums" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center text-center transition duration-900">Voir la collection</Link>
            <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center text-center rounded-xl px-5 py-3 bg-beige800 text-white hover:bg-beige600 transition duration-900">Contact</Link>
          </motion.div>
        </motion.div>
        <motion.div variants={slowScaleIn} initial="hidden" animate="show" className="relative flex items-center justify-center">
          <img
            src={heroImg}
            alt="Flacon de parfum 2XAGRESSIF"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            sizes="(min-width: 768px) 40vw, 80vw"
            className="w-auto max-h-56 md:max-h-80 mx-auto rounded-2xl object-contain bg-white"
          />
        </motion.div>
      </div>
    </section>
  );
}
