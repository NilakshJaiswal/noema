import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultContent, mergeContent } from './contentSchema.js';

const defaultPath = fileURLToPath(new URL('../data/site-content.json', import.meta.url));
const path = process.env.SITE_CONTENT_FILE ? resolve(process.env.SITE_CONTENT_FILE) : defaultPath;
let pendingWrite = Promise.resolve();

export async function readContent() {
  let data;
  try {
    data = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { content: defaultContent, revision: 0, publishedAt: null };
  }

  const { content, revision, publishedAt } = JSON.parse(data);
  if (!content || !Number.isSafeInteger(revision)) throw new Error('Invalid published website content.');
  return { content: mergeContent(content), revision, publishedAt };
}

export function publishContent(content, expectedRevision) {
  const write = pendingWrite.then(async () => {
    const current = await readContent();
    if (current.revision !== expectedRevision) return null;

    const next = { content, revision: current.revision + 1, publishedAt: new Date().toISOString() };
    await mkdir(dirname(path), { recursive: true });
    const stagingPath = `${path}.${randomUUID()}.tmp`;
    try {
      await writeFile(stagingPath, JSON.stringify(next), { encoding: 'utf8', flag: 'wx', mode: 0o600, flush: true });
      await rename(stagingPath, path);
    } finally {
      await rm(stagingPath, { force: true });
    }
    return next;
  });
  pendingWrite = write.catch(() => {});
  return write;
}

