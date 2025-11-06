// Eagerly import every webp inside src/assets/powerDisplays/<id>/<n>.webp
const modules = import.meta.glob('/src/assets/powerDisplays/*/*.webp', {
    eager: true,
    as: 'url',
});

// Build { [id]: [{ n, url }, ...] } and sort numerically (1,2,3…)
const map = Object.entries(modules).reduce((acc, [path, url]) => {
    const m = path.match(/powerDisplays\/([^/]+)\/(\d+)\.webp$/);
    if (!m) return acc;
    const [, id, n] = m;
    (acc[id] ||= []).push({ n: Number(n), url });
    return acc;
}, {});

Object.values(map).forEach(list => list.sort((a, b) => a.n - b.n));

export function getFruitImages(id) {
    return map[id]?.map(x => x.url) ?? [];
}
