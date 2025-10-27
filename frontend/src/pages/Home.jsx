import Hero from '../components/Hero.jsx';
import { motion } from 'framer-motion';
import { slowFadeUp, slowScaleIn, slowStagger } from '../animations/variants.js';
import imgLivraison from '../images/livraison.png';
import imgOriginal from '../images/original.png';
import imgPrix from '../images/prix.png';

export default function Home(){
  return (
    <div className="space-y-8 sm:space-y-10 px-4 sm:px-6">
      <Hero />
      <motion.section
        variants={slowStagger}
        initial="hidden"
        whileInView="show"
        viewport={{once:true, amount:0.2}}
        className="space-y-6 sm:space-y-8"
      >
        {/* Feature 1: Livraison rapide */}
        <motion.div variants={slowFadeUp} className="rounded-2xl bg-gradient-to-br from-beige100 via-white to-white p-4 sm:p-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="order-2 md:order-1 text-center md:text-left">
              <motion.h3 variants={slowFadeUp} className="text-xl md:text-2xl font-bold text-dark mb-2 sm:mb-3">Livraison rapide</motion.h3>
              <motion.p variants={slowFadeUp} className="text-gray-600 mt-1.5 sm:mt-2 text-sm md:text-base">24–72h selon zone, suivi disponible.</motion.p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="h-28 md:h-36 w-full max-w-[220px] sm:max-w-[260px] my-2 sm:my-0 flex items-center justify-center">
                <motion.img
                  variants={slowScaleIn}
                  className="max-h-full max-w-full rounded-xl object-contain"
                  src={imgLivraison}
                  alt="Livraison rapide"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature 2: Parfums 100% originaux */}
        <motion.div variants={slowFadeUp} className="rounded-2xl bg-gradient-to-br from-beige100 via-white to-white p-4 sm:p-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="flex justify-center">
              <div className="h-28 md:h-36 w-full max-w-[220px] sm:max-w-[260px] my-2 sm:my-0 flex items-center justify-center">
                <motion.img
                  variants={slowScaleIn}
                  className="max-h-full max-w-full rounded-xl object-contain"
                  src={imgOriginal}
                  alt="Parfums originaux"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <motion.h3 variants={slowFadeUp} className="text-xl md:text-2xl font-bold text-dark mb-2 sm:mb-3">Parfums 100% originaux</motion.h3>
              <motion.p variants={slowFadeUp} className="text-gray-600 mt-1.5 sm:mt-2 text-sm md:text-base">Sélection certifiée de marques authentiques.</motion.p>
            </div>
          </div>
        </motion.div>

        {/* Feature 3: Prix abordables */}
        <motion.div variants={slowFadeUp} className="rounded-2xl bg-gradient-to-br from-beige100 via-white to-white p-4 sm:p-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="order-2 md:order-1 text-center md:text-left">
              <motion.h3 variants={slowFadeUp} className="text-xl md:text-2xl font-bold text-dark mb-2 sm:mb-3">Prix abordables</motion.h3>
              <motion.p variants={slowFadeUp} className="text-gray-600 mt-1.5 sm:mt-2 text-sm md:text-base">Le luxe accessible, offres régulières.</motion.p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="h-28 md:h-36 w-full max-w-[220px] sm:max-w-[260px] my-2 sm:my-0 flex items-center justify-center">
                <motion.img
                  variants={slowScaleIn}
                  className="max-h-full max-w-full rounded-xl object-contain"
                  src={imgPrix}
                  alt="Prix abordables"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
