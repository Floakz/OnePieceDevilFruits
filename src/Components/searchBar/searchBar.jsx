import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./searchBar.module.css";
import { fetchAllFruitsOnce } from "../../lib/fruitsApi";

// Normalize: lowercase + strip accents
function normalize(str = "") {
    return String(str)
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();
}

export default function SearchBar() {
    const navigate = useNavigate();

    const [allFruits, setAllFruits] = useState([]);
    const [query, setQuery] = useState("");              // controlled value
    const [open, setOpen] = useState(false);             // is dropdown visible?

    useEffect(() => {
        (async () => {
            const list = await fetchAllFruitsOnce();
            setAllFruits(Array.isArray(list) ? list : []);
        })();
    }, []);

    // Compute results from current query (no stale state bugs)
    const results = useMemo(() => {
        const q = normalize(query);
        if (!q) return [];
        return allFruits
            .filter(f => normalize(f.name).includes(q))
            .slice(0, 10);
    }, [query, allFruits]);

    return (
        <div className={styles.searchBarWrapper}>
            <input
                type="search"
                className={styles.inputBar}
                placeholder="ex: Dark-Dark Fruit"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}      // <- controlled
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 0)} // let clicks land
            />

            <button className={styles.searchButton} aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 717 766">
                    <path d="m541 517l176 176l-72 73l-184-185c-45 25-97 39-151 39C139 620 0 481 0 310S139 0 310 0s311 139 311 310c0 80-31 153-80 207zM103 310c0 115 92 207 207 207s207-92 207-207s-92-207-207-207s-207 92-207 207z"></path>
                </svg>
            </button>

            {open && query && (
                <div className={styles.resultsWrapper}>
                    {results.length === 0 ? (
                        <div className={styles.searchResultEmpty}>No fruits found</div>
                    ) : (
                        results.map((fruit) => (
                            <div
                                key={fruit.id}
                                className={styles.searchResult}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    navigate(`/fruit/${fruit.id}`);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 717 766">
                                    <path d="m541 517l176 176l-72 73l-184-185c-45 25-97 39-151 39C139 620 0 481 0 310S139 0 310 0s311 139 311 310c0 80-31 153-80 207zM103 310c0 115 92 207 207 207s207-92 207-207s-92-207-207-207s-207 92-207 207z"></path>
                                </svg>
                                <span>{fruit.name}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
