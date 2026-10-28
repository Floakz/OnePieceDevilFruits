import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { normalize } from 'node:path';

const sourcePath = fileURLToPath(new URL('../src/data/characterProfiles.json', import.meta.url));
const virtualId = 'virtual:character-index';
const resolvedId = `\0${virtualId}`;
const summaryFields = ['slug', 'name', 'japaneseName', 'romanizedName', 'alias', 'group', 'role', 'debutArc',
    'fruitId', 'fruitName', 'fruitType', 'fruitRomanizedName', 'about', 'portrait', 'seoName', 'seoDescription'];

export function createCharacterAssets(profiles) {
    const index = [];
    const assets = new Map();
    const slugs = new Set();
    for (const profile of profiles) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.slug) || slugs.has(profile.slug)) {
            throw new Error(`Invalid or duplicate character slug: ${profile.slug}`);
        }
        slugs.add(profile.slug);
        const source = JSON.stringify(profile);
        const hash = createHash('sha256').update(source).digest('hex').slice(0, 12);
        const profilePath = `/data/character-profiles/${profile.slug}.${hash}.json`;
        index.push({ ...Object.fromEntries(summaryFields.map(field => [field, profile[field]])), profilePath });
        assets.set(profilePath, source);
    }
    return { index, assets };
}

// One authored file; Vite exposes a small list index and a separate file per biography.
export default function characterDataPlugin() {
    let data;
    const loadData = async () => {
        data = createCharacterAssets(JSON.parse(await readFile(sourcePath, 'utf8')));
        return data;
    };
    return {
        name: 'character-data',
        async buildStart() {
            this.addWatchFile(sourcePath);
            await loadData();
        },
        resolveId(id) { if (id === virtualId) return resolvedId; },
        async load(id) {
            if (id !== resolvedId) return;
            this.addWatchFile(sourcePath);
            return `export default ${JSON.stringify((await loadData()).index)};`;
        },
        generateBundle() {
            for (const [url, source] of data.assets) {
                this.emitFile({ type: 'asset', fileName: url.slice(1), source });
            }
        },
        configureServer(server) {
            server.watcher.add(sourcePath);
            server.middlewares.use(async (request, response, next) => {
                const url = request.url?.split('?')[0];
                if (!url?.startsWith('/data/character-profiles/')) return next();
                try {
                    const source = (data || await loadData()).assets.get(url);
                    if (!source) { response.statusCode = 404; response.end('Character not found'); return; }
                    response.setHeader('Content-Type', 'application/json; charset=utf-8');
                    response.setHeader('Cache-Control', 'no-cache');
                    response.end(source);
                } catch (error) { next(error); }
            });
        },
        async handleHotUpdate(context) {
            if (normalize(context.file) !== normalize(sourcePath)) return;
            await loadData();
            const module = context.server.moduleGraph.getModuleById(resolvedId);
            if (module) context.server.moduleGraph.invalidateModule(module);
            context.server.ws.send({ type: 'full-reload' });
            return [];
        },
    };
}
