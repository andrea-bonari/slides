import fs from 'node:fs';
import { execSync } from 'node:child_process';

interface SlideSources {
    slug: string;
    sourceRepo: string;
    buildCommand: string;
    buildOutput: string;
}

const sourcesFilePath = './sources.json';
const distDir = './dist';

const sources = JSON.parse(fs.readFileSync(sourcesFilePath, 'utf-8')) as SlideSources[];

for (const source of sources) {
    console.log(`Processing slide source: ${source.slug}`);
    const repoDir = `./repos/${source.slug}`;
    const cloneCommand = `git clone ${source.sourceRepo} ${repoDir}`;

    execSync(cloneCommand, { stdio: 'inherit' });

    const buildOutput = `${repoDir}/${source.buildOutput}`;

    execSync(`${source.buildCommand} -- --base /${source.slug}/`, { cwd: repoDir, stdio: 'inherit' });

    console.log(`Build output for ${source.slug} is located at: ${buildOutput}`);

    const targetDir = `${distDir}/${source.slug}`;

    fs.mkdirSync(targetDir, { recursive: true });
    fs.cpSync(buildOutput, targetDir, { recursive: true });

    console.log(`Copied build output to: ${targetDir}`);
}

const buildIndex = (baseDir: string, urlBase: string): void => {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    const hasIndex = entries.some(e => e.isFile() && e.name === 'index.html');
    if (hasIndex) return; // already has an index, leave it alone

    const dirs = entries
        .filter(e => e.isDirectory())
        .map(e => e.name)
        .sort();

    if (dirs.length === 0) return;

    const links = dirs.map(name => {
        const href = `${urlBase}/${name}`;
        return `<li><a href="${href}">${name}</a></li>`;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Index of ${urlBase || '/'}</title></head>
<body>
<h1>Index of ${urlBase || '/'}</h1>
<ul>${links}</ul>
</body>
</html>`;

    fs.writeFileSync(`${baseDir}/index.html`, html);
    console.log(`Generated index at: ${baseDir}/index.html`);

    for (const name of dirs) {
        buildIndex(`${baseDir}/${name}`, `${urlBase}/${name}`);
    }
}

buildIndex(distDir, '');