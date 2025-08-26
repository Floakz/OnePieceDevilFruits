import {
    collection, doc, setDoc, getDocs, getDoc, query, orderBy, limit, addDoc,
    updateDoc, deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

const col = collection(db, 'fruits');

export async function listFruits({ limitTo = 100 } = {}) {
    const q = query(col, orderBy('name'), limit(limitTo));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getFruit(id) {
    const d = await getDoc(doc(col, id));
    return d.exists() ? { id: d.id, ...d.data() } : null;
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
