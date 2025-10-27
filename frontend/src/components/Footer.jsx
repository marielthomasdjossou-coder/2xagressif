export default function Footer(){
  return (
    <footer className="mt-10 sm:mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex items-center justify-between gap-4">
        <p className="text-gray-600 text-xs sm:text-sm transition-colors duration-900">© {new Date().getFullYear()} 2XAGRESSIF. Tous droits réservés.</p>
        <a href="/admin" className="text-[10px] sm:text-xs text-gray-400 hover:text-beige800 transition-colors duration-900" title="Espace admin">2XA</a>
      </div>
    </footer>
  );
}
