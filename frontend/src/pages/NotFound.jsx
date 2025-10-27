export default function NotFound(){
  return (
    <section className="px-4 sm:px-6 text-center py-16">
      <h1 className="text-3xl md:text-5xl font-bold text-dark">Page introuvable</h1>
      <p className="mt-3 text-gray-600">La page demandée n'existe pas ou a été déplacée.</p>
      <a href="/" className="btn-primary inline-flex items-center justify-center mt-6">Retour à l'accueil</a>
    </section>
  );
}
