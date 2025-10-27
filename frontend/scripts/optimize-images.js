/* Optimize hero image for faster load during Netlify build.
   - Input: src/images/hero.png
   - Output: public/images/hero.webp (max width 800px, quality 76)
*/
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const input = path.join(root, 'src', 'images', 'hero.png');
const outDir = path.join(root, 'public', 'images');
const output = path.join(outDir, 'hero.webp');

async function run(){
  try{
    if (!fs.existsSync(input)) {
      console.log('[optimize-images] input not found, skipping:', input);
      return;
    }
    fs.mkdirSync(outDir, { recursive: true });
    await sharp(input)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(output);
    console.log('[optimize-images] generated', output);
  }catch(e){
    console.error('[optimize-images] failed:', e?.message || e);
    // Do not fail the build if optimization fails
  }
}
run();
