import fs from 'node:fs';
import { generateIndexHtml } from './generateIndexHtml';

export const buildIndex = (baseDir: string, urlBase: string): void => {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const hasIndex = entries.some(e => e.isFile() && e.name === 'index.html');
  if (hasIndex) return;

  const dirs = entries
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort();

  if (dirs.length === 0) return;

  const html = generateIndexHtml(dirs, urlBase);
  fs.writeFileSync(`${baseDir}/index.html`, html);
  console.log(`Generated index at: ${baseDir}/index.html`);

  for (const name of dirs) {
    buildIndex(`${baseDir}/${name}`, `${urlBase}/${name}`);
  }
};