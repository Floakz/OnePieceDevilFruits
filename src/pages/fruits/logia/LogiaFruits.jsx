// pages/fruits/AllFruitsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchAllFruitsOnce, filterByCategoryLocal, paginateLocal } from "../../../lib/fruitsApi.js";
import FruitCard from "../../../Components/FruitCard.jsx";
import Header from "../../../Components/header/Header.jsx";
import Seo from "../../../Components/Seo.jsx";
import Footer from "../../../Components/footer/footer.jsx";

const PAGE_SIZE = 12;

export default function LogiaFruits() {
    const [all, setAll] = useState([]);
    const [shown, setShown] = useState(PAGE_SIZE);

    useEffect(() => {
        (async () => setAll(await fetchAllFruitsOnce()))();
    }, []);

    const filtered = useMemo(() => filterByCategoryLocal(all, "Logia"), [all]);


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
                title="Logia Devil Fruits – Complete List & Users"
                description="All Logia fruits with users, abilities and images."
                canonical="https://onepiecedevilfruits.com/logia"
            />

            <Header headerShown={true} />
            <main>
                {visible.map(f => <FruitCard key={f.id} {...f} clickable={true} />)}
            </main>
            {hasMore && (
                <button className="loadButton" onClick={loadMore}>
                    load more
                </button>
            )}
            <Footer />
        </>
    );
}
