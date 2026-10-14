import { useState } from 'react';
import styles from './expandedFruit.module.css';

export default function FruitGallery({ images, fruit }) {
    const [index, setIndex] = useState(0);
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);
    function move(next) { setIndex(next); setStatus('loading'); }
    return <div className={styles.gallery}>
        <div className={styles.carrosselWrapper}>
            {status !== 'error' && <img key={`${index}-${attempt}`} className={styles.carrosselImg}
                src={images[index]} alt={`${fruit.name} in use, image ${index + 1}`} loading="lazy"
                onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />}
            {status === 'loading' && <div className={styles.galleryMessage} role="status">Loading image…</div>}
            {status === 'error' && <div className={styles.galleryMessage} role="status">
                <p>This image couldn’t load.</p>
                <button type="button" onClick={() => { setAttempt(value => value + 1); setStatus('loading'); }}>Try again</button>
            </div>}
        </div>
        <div className={styles.galleryControls}>
            <button type="button" aria-label="Previous image" disabled={index === 0} onClick={() => move(index - 1)}>←</button>
            <span aria-live="polite">{index + 1} / {images.length}</span>
            <button type="button" aria-label="Next image" disabled={index === images.length - 1} onClick={() => move(index + 1)}>→</button>
        </div>
    </div>;
}
