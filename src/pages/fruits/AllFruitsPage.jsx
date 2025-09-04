// pages/fruits/AllFruitsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchAllFruitsOnce, filterByCategoryLocal } from "../../lib/fruitsApi.js";
import FruitCard from "../../Components/FruitCard.jsx";
import Header from "../../Components/header/Header.jsx";
import Seo from '../../Components/Seo.jsx'


const PAGE_SIZE = 12;

export default function AllFruitsPage() {
    const [all, setAll] = useState([]);
    const [shown, setShown] = useState(PAGE_SIZE);

    useEffect(() => {
        (async () => setAll(await fetchAllFruitsOnce()))();
    }, []);

    const filtered = useMemo(() => filterByCategoryLocal(all, "all"), [all]);


    useEffect(() => {
        setShown(PAGE_SIZE);
    }, [filtered]);

    const visible = useMemo(
        () => filtered.slice(0, shown),
        [filtered, shown]
    );

    const hasMore = shown < filtered.length;

    function loadMore() {
        setShown(s => Math.min(s + PAGE_SIZE, filtered.length));
    }

    return (
        <>
            <Seo
                title="All Devil Fruits – Types, Users & Powers"
                description="Browse every known Devil Fruit by type, user and powers."
                canonical="https://onepiecedevilfruits.com/"
            />
            <Header />
            <main>
                {visible.map(f => <FruitCard key={f.id} {...f} />)}
            </main>
            {hasMore && (
                <button className="loadButton" onClick={loadMore}>
                    load more
                </button>
            )}
        </>
    );
}
