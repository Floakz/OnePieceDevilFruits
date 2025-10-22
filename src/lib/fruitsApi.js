
import {
    collection, doc, setDoc, getDocs, getDoc,
    query, orderBy, limit, addDoc, updateDoc, deleteDoc,
    startAfter, where
} from 'firebase/firestore';
import { db } from './firebase';

const col = collection(db, 'fruits');

// ---- CONFIG DE CACHE ----
const CACHE_KEY = 'fruits_cache_v6';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts > TTL_MS) return null; // expirado
        return data;
    } catch {
        return null;
    }
}
function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch { }
}

export async function fetchAllFruitsOnce() {

    // 1) tenta cache
    const cached = readCache();
    if (cached) return cached;

    // 2) senão, vai ao Firestore 1 vez
    const snap = await getDocs(collection(db, 'fruits'));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    writeCache(all);
    return all;
}


export async function refreshFruitsCache() {
    localStorage.removeItem(CACHE_KEY);
    return fetchAllFruitsOnce();
}


const ZOAN_TYPES = ['Zoan', 'Mythical Zoan', 'Ancient Zoan', 'Artificial Zoan'];

export async function listFruits({ limitTo = 100 } = {}) {
    const q = query(col, orderBy('name'), limit(limitTo));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getFruit(id) {
    const d = await getDoc(doc(col, id));
    return d.exists() ? { id: d.id, ...d.data() } : null;
}


export async function listFruitsPage({ pageSize = 12, cursor = null, category = "all" } = {}) {
    const constraints = [];
    if (category !== "all" && category !== "Random" && category !== "FruitBattle") {
        if (category === "Zoan") constraints.push(where("type", "in", ZOAN_TYPES));
        else constraints.push(where("type", "==", category));
    }
    if (cursor) constraints.push(startAfter(cursor));
    constraints.push(limit(pageSize + 1));
    const snap = await getDocs(query(col, ...constraints));
    const docs = snap.docs;
    const hasMore = docs.length > pageSize;
    const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
    const items = pageDocs.map(d => ({ id: d.id, ...d.data() }));
    const nextCursor = hasMore ? pageDocs[pageDocs.length - 1] : null;
    return { items, nextCursor, hasMore };
}

export async function getRandomFruits(count = 40) {
    const snap = await getDocs(collection(db, "fruits"));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, count);
}

export async function createFruit(data) { return await addDoc(col, data); }
export async function upsertFruit(id, data) { return await setDoc(doc(col, id), data, { merge: true }); }
export async function updateFruit(id, data) { return await updateDoc(doc(col, id), data); }
export async function removeFruit(id) { return await deleteDoc(doc(col, id)); }


// ----------------- HELPERS LOCAIS (filtrar e paginar em memória) -----------------

const LOCAL_ZOAN_TYPES = ZOAN_TYPES;

export function filterByCategoryLocal(all, category = 'all') {
    if (category === 'all' || category === 'Random' || category === 'FruitBattle') return all;
    if (category === 'Zoan') return all.filter(f => LOCAL_ZOAN_TYPES.includes(f.type));
    return all.filter(f => f.type === category);
}

export function paginateLocal(array, pageSize = 12, cursorIndex = 0) {
    const items = array.slice(cursorIndex, cursorIndex + pageSize);
    const nextCursorIndex = cursorIndex + items.length;
    const hasMore = nextCursorIndex < array.length;
    return { items, nextCursorIndex: hasMore ? nextCursorIndex : null, hasMore };
}
