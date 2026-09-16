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
    const [randomPick, setRandomPick] = useState(null);


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





    function handleRandomClick() {
        const pick = allFruits[Math.floor(Math.random() * allFruits.length)];
        navigate(`/fruit/${pick.id}`);
    }


    useEffect(() => {
        if (allFruits.length > 0) {
            setRandomPick(allFruits[Math.floor(Math.random() * allFruits.length)]);
        }
    }, [allFruits]);

    return (
        <div className={styles.searchBarOutSideWrapper}>
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

            <button className={styles.randomButton} aria-label="Random Fruit" onClick={() => handleRandomClick()}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.25 7.75H16.255M16.25 16.25H16.255M7.75 7.75H7.755M12 12H12.005M7.75 16.25H7.755M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21ZM16.5 7.75C16.5 7.88807 16.3881 8 16.25 8C16.1119 8 16 7.88807 16 7.75C16 7.61193 16.1119 7.5 16.25 7.5C16.3881 7.5 16.5 7.61193 16.5 7.75ZM16.5 16.25C16.5 16.3881 16.3881 16.5 16.25 16.5C16.1119 16.5 16 16.3881 16 16.25C16 16.1119 16.1119 16 16.25 16C16.3881 16 16.5 16.1119 16.5 16.25ZM8 7.75C8 7.88807 7.88807 8 7.75 8C7.61193 8 7.5 7.88807 7.5 7.75C7.5 7.61193 7.61193 7.5 7.75 7.5C7.88807 7.5 8 7.61193 8 7.75ZM12.25 12C12.25 12.1381 12.1381 12.25 12 12.25C11.8619 12.25 11.75 12.1381 11.75 12C11.75 11.8619 11.8619 11.75 12 11.75C12.1381 11.75 12.25 11.8619 12.25 12ZM8 16.25C8 16.3881 7.88807 16.5 7.75 16.5C7.61193 16.5 7.5 16.3881 7.5 16.25C7.5 16.1119 7.61193 16 7.75 16C7.88807 16 8 16.1119 8 16.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>Go to a random fruit</p>
            </button>
        </div>
    );
}
