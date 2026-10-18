import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFruits from '../../hooks/useFruits.js';
import { slugify } from '../../lib/slugify.js';
import styles from './searchBar.module.css';

function normalize(value = '') {
    return String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[-\s]+/g, ' ').trim();
}

export default function SearchBar() {
    const navigate = useNavigate();
    const { fruits, status, retry } = useFruits();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const listId = useId();
    const inputRef = useRef(null);
    const results = useMemo(() => {
        const term = normalize(query);
        if (!term) return [];
        return fruits.filter(fruit => [fruit.name, fruit.romanizedName, fruit.japaneseName, fruit.user]
            .some(name => normalize(name).includes(term))).slice(0, 10);
    }, [query, fruits]);
    const expanded = open && Boolean(query.trim());
    const activeFruit = results[activeIndex];

    useEffect(() => {
        if (expanded && activeIndex >= 0) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, expanded, listId]);

    function choose(fruit) {
        setOpen(false);
        setActiveIndex(-1);
        navigate(`/fruit/${slugify(fruit.name)}/`);
    }
    function submit(event) {
        event.preventDefault();
        if (status === 'ready' && results.length) choose(activeFruit || results[0]);
        else { setOpen(true); inputRef.current?.focus(); }
    }
    function onKeyDown(event) {
        if (event.key === 'Escape') { setOpen(false); setActiveIndex(-1); return; }
        if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            if (!results.length) return;
            setActiveIndex(previous => event.key === 'ArrowDown'
                ? (previous + 1) % results.length
                : (previous <= 0 ? results.length - 1 : previous - 1));
        }
    }

    return <div className={styles.searchBarOutSideWrapper}>
        <form className={styles.searchBarWrapper} role="search" onSubmit={submit}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActiveIndex(-1); } }}>
            <input ref={inputRef} type="search" className={styles.inputBar}
                placeholder="Fruit name or user…" aria-label="Search fruits by name or user"
                autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={expanded}
                aria-controls={expanded ? listId : undefined}
                aria-activedescendant={expanded && activeFruit ? `${listId}-${activeIndex}` : undefined}
                value={query} onChange={event => { setQuery(event.target.value); setActiveIndex(-1); setOpen(true); }}
                onFocus={() => setOpen(true)} onKeyDown={onKeyDown} />
            <button type="submit" className={styles.searchButton} aria-label="Search">
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" />
                </svg>
            </button>
            {expanded && <div className={styles.resultsWrapper}>
                <div id={listId} role="listbox" aria-label="Matching fruits" aria-busy={status === 'loading'}>
                    {status === 'ready' && results.map((fruit, index) => <div key={fruit.id}
                        id={`${listId}-${index}`} role="option" aria-selected={index === activeIndex}
                        className={`${styles.searchResult} ${index === activeIndex ? styles.activeResult : ''}`}
                        onMouseDown={event => event.preventDefault()} onClick={() => choose(fruit)}>
                        <span>{fruit.name}{fruit.romanizedName ? ` · ${fruit.romanizedName}` : ''}</span>
                    </div>)}
                </div>
                {status === 'loading' && <p className={styles.searchResultEmpty} role="status">Loading fruits…</p>}
                {status === 'error' && <div className={styles.searchResultEmpty} role="alert">
                    <p>Search couldn’t load.</p><button type="button" className={styles.retryButton} onClick={retry}>Try again</button>
                </div>}
                {status === 'ready' && !results.length && <p className={styles.searchResultEmpty} role="status">No matches. Try another name.</p>}
            </div>}
        </form>
        <button type="button" className={styles.randomButton} aria-label="Discover a random fruit" title="Random fruit"
            disabled={status !== 'ready' || !fruits.length} onClick={() => choose(fruits[Math.floor(Math.random() * fruits.length)])}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                {[[8, 8], [16, 8], [12, 12], [8, 16], [16, 16]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" />)}
            </svg>
        </button>
    </div>;
}
