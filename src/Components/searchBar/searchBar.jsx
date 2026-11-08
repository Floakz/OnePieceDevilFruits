import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFruits from '../../hooks/useFruits.js';
import characterIndex from '../../lib/characterIndex.js';
import { filterCharacters } from '../../lib/characterCatalog.js';
import { slugify } from '../../lib/slugify.js';
import styles from './searchBar.module.css';

function normalize(value = '') {
    return String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[-\s]+/g, ' ').trim();
}

function SearchBarContent({
    query,
    setQuery,
    results,
    items,
    status,
    retry,
    select,
    getKey,
    getLabel,
    placeholder,
    searchLabel,
    randomLabel,
    randomTitle,
    resultLabel,
    loadingMessage,
    errorMessage,
    emptyMessage,
}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const listId = useId();
    const inputRef = useRef(null);
    const expanded = open && Boolean(query.trim());
    const activeItem = results[activeIndex];

    useEffect(() => {
        if (expanded && activeIndex >= 0) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, expanded, listId]);

    function choose(item) {
        setOpen(false);
        setActiveIndex(-1);
        select(item);
    }
    function submit(event) {
        event.preventDefault();
        if (status === 'ready' && results.length) choose(activeItem || results[0]);
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
                placeholder={placeholder} aria-label={searchLabel}
                autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={expanded}
                aria-controls={expanded ? listId : undefined}
                aria-activedescendant={expanded && activeItem ? `${listId}-${activeIndex}` : undefined}
                value={query} onChange={event => { setQuery(event.target.value); setActiveIndex(-1); setOpen(true); }}
                onFocus={() => setOpen(true)} onKeyDown={onKeyDown} />
            <button type="submit" className={styles.searchButton} aria-label="Search">
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" />
                </svg>
            </button>
            {expanded && <div className={styles.resultsWrapper}>
                <div id={listId} role="listbox" aria-label={resultLabel} aria-busy={status === 'loading'}>
                    {status === 'ready' && results.map((item, index) => <div key={getKey(item)}
                        id={`${listId}-${index}`} role="option" aria-selected={index === activeIndex}
                        className={`${styles.searchResult} ${index === activeIndex ? styles.activeResult : ''}`}
                        onMouseDown={event => event.preventDefault()} onClick={() => choose(item)}>
                        <span>{getLabel(item)}</span>
                    </div>)}
                </div>
                {status === 'loading' && <p className={styles.searchResultEmpty} role="status">{loadingMessage}</p>}
                {status === 'error' && <div className={styles.searchResultEmpty} role="alert">
                    <p>{errorMessage}</p>{retry && <button type="button" className={styles.retryButton} onClick={retry}>Try again</button>}
                </div>}
                {status === 'ready' && !results.length && <p className={styles.searchResultEmpty} role="status">{emptyMessage}</p>}
            </div>}
        </form>
        <button type="button" className={styles.randomButton} aria-label={randomLabel} title={randomTitle}
            disabled={status !== 'ready' || !items.length} onClick={() => choose(items[Math.floor(Math.random() * items.length)])}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                {[[8, 8], [16, 8], [12, 12], [8, 16], [16, 16]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" />)}
            </svg>
        </button>
    </div>;
}

function FruitSearchBar() {
    const navigate = useNavigate();
    const { fruits, status, retry } = useFruits();
    const [query, setQuery] = useState('');
    const results = useMemo(() => {
        const term = normalize(query);
        if (!term) return [];
        return fruits.filter(fruit => [fruit.name, fruit.romanizedName, fruit.japaneseName, fruit.user]
            .some(name => normalize(name).includes(term))).slice(0, 10);
    }, [query, fruits]);

    return <SearchBarContent query={query} setQuery={setQuery} results={results} items={fruits} status={status} retry={retry}
        select={fruit => navigate(`/fruit/${slugify(fruit.name)}`)}
        getKey={fruit => fruit.id} getLabel={fruit => `${fruit.name}${fruit.romanizedName ? ` · ${fruit.romanizedName}` : ''}`}
        placeholder="Fruit name or user…" searchLabel="Search fruits by name or user"
        randomLabel="Discover a random fruit" randomTitle="Random fruit" resultLabel="Matching fruits"
        loadingMessage="Loading fruits…" errorMessage="Search couldn’t load." emptyMessage="No matches. Try another name." />;
}

function CharacterSearchBar({ query = '', onQueryChange = () => {}, group = 'all' }) {
    const navigate = useNavigate();
    const results = useMemo(() => query.trim() ? filterCharacters(characterIndex, query, group).slice(0, 10) : [], [query, group]);

    return <SearchBarContent query={query} setQuery={onQueryChange} results={results} items={characterIndex} status="ready"
        select={profile => navigate(`/characters/${profile.slug}`)}
        getKey={profile => profile.slug}
        getLabel={profile => `${profile.name}${profile.romanizedName ? ` · ${profile.romanizedName}` : ''}`}
        placeholder="Name, alias, or Devil Fruit…" searchLabel="Search characters by name, alias, or Devil Fruit"
        randomLabel="Discover a random character" randomTitle="Random character" resultLabel="Matching characters"
        loadingMessage="" errorMessage="" emptyMessage="No matches. Try another name." />;
}

export default function SearchBar({ mode = 'fruit', ...characterSearchProps } = {}) {
    return mode === 'characters'
        ? <CharacterSearchBar {...characterSearchProps} />
        : <FruitSearchBar />;
}
