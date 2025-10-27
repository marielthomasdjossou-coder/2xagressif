import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slowFadeUp, slowStagger } from '../animations/variants.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock scroll when menu open
  useEffect(()=>{
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  },[open]);

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beige200 focus-visible:ring-offset-2';
  const linkBase = `text-dark hover:opacity-80 py-2 transition duration-900 ${focusRing}`;
  const active = `text-beige800 font-semibold py-2 transition duration-900 ${focusRing}`;

  return (
    <header className={`${open ? 'bg-white' : 'bg-white/80 backdrop-blur'} sticky top-0 z-50 border-b border-beige200/60`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 flex items-center justify-between">
        <Link to="/" className="select-none uppercase text-xl md:text-2xl tracking-wide md:tracking-tight text-dark leading-none inline-block">
          <span className="text-beige800">2X</span>
          <span aria-hidden="true" className="mx-1">🪬</span>
          <span>AGRESSIF</span>
          <span aria-hidden="true" className="ml-1">🖤</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          <NavLink to="/" className={({isActive})=>isActive? active: linkBase}>Accueil</NavLink>
          <NavLink to="/parfums" className={({isActive})=>isActive? active: linkBase}>Nos Parfums</NavLink>
          <NavLink to="/contact" className={({isActive})=>isActive? active: linkBase}>Contact</NavLink>
        </nav>

        {/* Burger button */}
        <button
          className={`md:hidden inline-flex items-center justify-center w-8 h-8 rounded-xl border border-beige200 text-dark transition duration-900 ${focusRing}`}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={()=>setOpen(v=>!v)}
        >
          <span className="sr-only">Menu</span>
          <div className="relative w-5 h-5">
            <span className={`absolute inset-x-0 top-1 h-[2px] bg-dark transition ${open?'rotate-45 top-2':''}`}></span>
            <span className={`absolute inset-x-0 top-2.5 h-[2px] bg-dark transition ${open?'opacity-0':''}`}></span>
            <span className={`absolute inset-x-0 top-4 h-[2px] bg-dark transition ${open?'-rotate-45 top-2':''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              className="fixed inset-0 md:hidden bg-beige100 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={()=>setOpen(false)}
            />
            {/* Panel full-screen for solid background */}
            <motion.nav
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-0 h-full w-screen bg-white p-6 md:hidden flex flex-col gap-4 z-50"
              aria-label="Menu mobile"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-dark">2X🪬AGRESSIF 🖤</span>
                <button className={`w-9 h-9 rounded-lg border border-beige200 transition duration-900 ${focusRing}`} onClick={()=>setOpen(false)} aria-label="Fermer">
                  ×
                </button>
              </div>
              <motion.div variants={slowStagger} initial="hidden" animate="show" className="flex flex-col gap-2">
                <motion.div variants={slowFadeUp}>
                  <NavLink onClick={()=>setOpen(false)} to="/" className={({isActive})=>isActive? active: linkBase}>Accueil</NavLink>
                </motion.div>
                <motion.div variants={slowFadeUp}>
                  <NavLink onClick={()=>setOpen(false)} to="/parfums" className={({isActive})=>isActive? active: linkBase}>Nos Parfums</NavLink>
                </motion.div>
                <motion.div variants={slowFadeUp}>
                  <NavLink onClick={()=>setOpen(false)} to="/contact" className={({isActive})=>isActive? active: linkBase}>Contact</NavLink>
                </motion.div>
              </motion.div>
              <div className="mt-auto text-xs text-gray-500">© {new Date().getFullYear()} 2XAGRESSIF</div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
