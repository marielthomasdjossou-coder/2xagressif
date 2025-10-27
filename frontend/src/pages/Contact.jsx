const WHATSAPP = '+2290196486557';

export default function Contact(){
  const message = encodeURIComponent('Bonjour, je souhaite plus d\'informations.');
  const wa = `https://wa.me/${WHATSAPP.replace(/^[+]/,'')}?text=${message}`;
  return (
    <section className="card max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-dark">Contact</h2>
      <p className="text-gray-600 mt-2">Discutez directement via WhatsApp.</p>
      <a className="btn-primary mt-6 inline-block" href={wa} target="_blank" rel="noreferrer">Ouvrir WhatsApp</a>
    </section>
  );
}
