import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { buildIndex } from './buildIndex';
import type { SlideSources } from './types';

const sourcesFilePath = './sources.json';
const distDir = './dist';
const sources = JSON.parse(fs.readFileSync(sourcesFilePath, 'utf-8')) as SlideSources[];

for (const source of sources) {
  console.log(`Processing slide source: ${source.slug}`);

  const repoDir = `./repos/${source.slug}`;
  
  execSync(`git clone ${source.sourceRepo} ${repoDir}`, { stdio: 'inherit' });
  execSync(`${source.buildCommand} -- --base /${source.slug}/`, { cwd: repoDir, stdio: 'inherit' });

  const buildOutput = `${repoDir}/${source.buildOutput}`;
  console.log(`Build output for ${source.slug} is located at: ${buildOutput}`);

  const targetDir = `${distDir}/${source.slug}`;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(buildOutput, targetDir, { recursive: true });
  
  console.log(`Copied build output to: ${targetDir}`);
}

buildIndex(distDir, '');