// src/lib/fruitsApi.js
import {
    collection, doc, setDoc, getDocs, getDoc,
    query, orderBy, limit, addDoc, updateDoc, deleteDoc,
    startAfter, where
} from 'firebase/firestore';
import { db } from './firebase';

const col = collection(db, 'fruits');

// ---------- STATIC DATA (Netlify /public/data) ----------
const STATIC_URL = '/data/fruits_v12.json'; // your single full file

// ---- CACHE CONFIG ----
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_KEY = 'fruits_cache_v12'; // bump version when file changes

function readCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts > TTL_MS) return null; // expired
        return data;
    } catch {
        return null;
    }
}
function writeCache(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch { }
}

// ---- STATIC FETCH (preferred) ----
async function fetchStatic() {
    const cached = readCache(CACHE_KEY);
    if (cached) return cached;

    const res = await fetch(STATIC_URL, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Static fetch failed: ${res.status}`);
    const data = await res.json();

    writeCache(CACHE_KEY, data);
    return data;
}

// ---------- PUBLIC API ----------

// Prefer static file; fallback to Firestore only if static fails
export async function fetchAllFruitsOnce() {
    try {
        return await fetchStatic();
    } catch {
        const snap = await getDocs(collection(db, 'fruits'));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        writeCache(CACHE_KEY, all);
        return all;
    }
}

export async function refreshFruitsCache() {
    localStorage.removeItem(CACHE_KEY);
    return fetchAllFruitsOnce();
}

// List fruits
export async function listFruits({ limitTo = 100 } = {}) {
    try {
        const all = await fetchAllFruitsOnce();
        const sorted = [...all].sort((a, b) => a.name.localeCompare(b.name));
        return sorted.slice(0, limitTo);
    } catch {
        const q = query(col, orderBy('name'), limit(limitTo));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
}

// Get single fruit
export async function getFruit(id) {
    try {
        const all = await fetchAllFruitsOnce();
        const found = all.find(f => f.id === id);
        if (found) return found;
    } catch { }
    const d = await getDoc(doc(col, id));
    return d.exists() ? { id: d.id, ...d.data() } : null;
}

// Pagination using local data
const ZOAN_TYPES = ['Zoan', 'Mythical Zoan', 'Ancient Zoan', 'Artificial Zoan'];

export async function listFruitsPage({ pageSize = 12, cursor = null, category = "all" } = {}) {
    const all = await fetchAllFruitsOnce();
    const filtered = filterByCategoryLocal(all, category);
    const startIndex = cursor ? cursor : 0;
    const { items, nextCursorIndex, hasMore } = paginateLocal(filtered, pageSize, startIndex);
    return { items, nextCursor: nextCursorIndex, hasMore };
}

// Random sample
export async function getRandomFruits(count = 40) {
    const all = await fetchAllFruitsOnce();
    const copy = [...all];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

// Writes remain in Firestore (for dynamic features)
export async function createFruit(data) { return await addDoc(col, data); }
export async function upsertFruit(id, data) { return await setDoc(doc(col, id), data, { merge: true }); }
export async function updateFruit(id, data) { return await updateDoc(doc(col, id), data); }
export async function removeFruit(id) { return await deleteDoc(doc(col, id)); }

// ----------------- LOCAL HELPERS -----------------
export function filterByCategoryLocal(all, category = 'all') {
    if (category === 'all' || category === 'Random' || category === 'FruitBattle') return all;
    if (category === 'Zoan') return all.filter(f => ZOAN_TYPES.includes(f.type));
    return all.filter(f => f.type === category);
}

export function paginateLocal(array, pageSize = 12, cursorIndex = 0) {
    const items = array.slice(cursorIndex, cursorIndex + pageSize);
    const nextCursorIndex = cursorIndex + items.length;
    const hasMore = nextCursorIndex < array.length;
    return { items, nextCursorIndex: hasMore ? nextCursorIndex : null, hasMore };
}
