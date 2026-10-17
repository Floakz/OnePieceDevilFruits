import { useCallback, useEffect, useState } from 'react';
import { fetchAllFruitsOnce } from '../lib/fruitsApi.js';

export default function useFruits() {
    const [fruits, setFruits] = useState([]);
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);
    const retry = useCallback(() => setAttempt(value => value + 1), []);

    useEffect(() => {
        let active = true;
        setStatus('loading');
        fetchAllFruitsOnce().then(list => {
            if (!Array.isArray(list)) throw new Error('Invalid fruit list');
            if (active) { setFruits(list); setStatus('ready'); }
        }).catch(() => { if (active) setStatus('error'); });
        return () => { active = false; };
    }, [attempt]);

    return { fruits, status, retry };
}
