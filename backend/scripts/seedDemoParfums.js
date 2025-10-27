import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'parfums.db');

const demos = [
  {
    nom: 'Nocturne Élite',
    prix: '35000',
    description: 'Boisé ambré, notes de bergamote, patchouli et ambre gris.',
    details: 'Sillage élégant pour soirées. Tenue 8-10h.',
    image: 'https://images.unsplash.com/photo-1547887538-047f814bfb4b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: "Aurore d'Or",
    prix: '30000',
    description: 'Floral lumineux, jasmin sambac, néroli et musc blanc.',
    details: 'Idéal journée. Fraîcheur longue durée.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Sable Noir',
    prix: '42000',
    description: 'Oriental vanillé, vanille de Madagascar, cardamome, oud.',
    details: 'Chaud et sensuel. Signature nocturne.',
    image: 'https://images.unsplash.com/photo-1605979257913-1702c9ef9f9d?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Brise Céleste',
    prix: '28000',
    description: 'Aromatique marin, agrumes, accord sel marin, cèdre.',
    details: 'Parfait été. Projection modérée.',
    image: 'https://images.unsplash.com/photo-1629198735660-46ff5a0ccc69?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Velours Rouge',
    prix: '39000',
    description: 'Gourmand fruité, framboise, rose, praline.',
    details: 'Douceur addictive. Compliments garantis.',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Bois Éclipse',
    prix: '36000',
    description: 'Boisé épicé, poivre rose, vétiver, santal.',
    details: 'Polyvalent bureau/soir. Chic discret.',
    image: 'https://images.unsplash.com/photo-1602075432748-22d08aa374d2?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Perle Blanche',
    prix: '27000',
    description: 'Musc poudré, iris, ambrette, vanille douce.',
    details: 'Confort skin-scent. Tenue 6-8h.',
    image: 'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Cuir Royal',
    prix: '45000',
    description: 'Cuiré noble, safran, cuir, bouleau, résines.',
    details: 'Caractère affirmé. Hiver/soirée.',
    image: 'https://images.unsplash.com/photo-1585386959983-9f15e8b7f62e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Éclat Citrus',
    prix: '24000',
    description: 'Hespéridé tonique, citron, pamplemousse, vétiver.',
    details: 'Ultra frais. Idéal sport/quotidien.',
    image: 'https://images.unsplash.com/photo-1520975922284-9e0ce827f8be?q=80&w=1200&auto=format&fit=crop'
  },
  {
    nom: 'Nuit Safran',
    prix: '41000',
    description: 'Épicé oriental, safran, rose noire, bois ambrés.',
    details: 'Luxueux et envoûtant. Tenue 10h+.',
    image: 'https://images.unsplash.com/photo-1520792395445-91baf2fba6e4?q=80&w=1200&auto=format&fit=crop'
  }
];

async function run(){
  const db = new sqlite3.Database(dbPath);
  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS parfums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prix TEXT NOT NULL,
        description TEXT,
        details TEXT,
        image TEXT
      )`);
      const stmtDelete = db.prepare('DELETE FROM parfums WHERE nom = ?');
      const stmtInsert = db.prepare('INSERT INTO parfums (nom, prix, description, details, image) VALUES (?, ?, ?, ?, ?)');
      demos.forEach(p => {
        stmtDelete.run(p.nom);
        stmtInsert.run(p.nom, p.prix, p.description, p.details, p.image);
      });
      stmtDelete.finalize();
      stmtInsert.finalize((err)=>{
        if (err) reject(err); else resolve();
      });
    });
  });
  console.log('Seed de 10 parfums démos terminé.');
  db.close();
}

run().catch(e=>{ console.error(e); process.exit(1); });
