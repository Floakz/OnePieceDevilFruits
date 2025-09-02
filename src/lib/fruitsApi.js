import {
    collection, doc, setDoc, getDocs, getDoc,
    query, orderBy, limit, addDoc, updateDoc, deleteDoc,
    startAfter, where
} from 'firebase/firestore';
import { db } from './firebase';

const col = collection(db, 'fruits');

export async function listFruits({ limitTo = 100 } = {}) {
    const q = query(col, orderBy('name'), limit(limitTo));
    const snap = await getDocs(q); // <- usar a query!
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getFruit(id) {
    const d = await getDoc(doc(col, id));
    return d.exists() ? { id: d.id, ...d.data() } : null;
}

export async function listFruitsPage({ pageSize = 12, cursor = null, category = "all" } = {}) {
    const baseConstraints =
        category === "all"
            ? [orderBy("name"), limit(pageSize)]
            : [where("type", "==", category), limit(pageSize)]; // sem orderBy => sem índice composto

    const q = cursor
        ? query(col, ...baseConstraints, startAfter(cursor))
        : query(col, ...baseConstraints);

    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;

    return { items, nextCursor };
}

export async function getRandomFruits(count = 20) {
    const snap = await getDocs(collection(db, "fruits"));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));


    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, count);
}


export async function createFruit(data) {
    return await addDoc(col, data); // auto ID
}

export async function upsertFruit(id, data) {
    return await setDoc(doc(col, id), data, { merge: true });
}

export async function updateFruit(id, data) {
    return await updateDoc(doc(col, id), data);
}

export async function removeFruit(id) {
    return await deleteDoc(doc(col, id));
}
