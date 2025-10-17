// pages/fruits/AllFruitsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchAllFruitsOnce, filterByCategoryLocal } from "../../lib/fruitsApi.js";
import FruitCard from "../../Components/FruitCard.jsx";
import Header from "../../Components/header/Header.jsx";
import Seo from '../../Components/Seo.jsx'
import Footer from "../../Components/footer/footer.jsx";

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
                title="All Devil Fruits – Complete List, Types, Users & Powers"
                description="Explore every Devil Fruit in One Piece: Paramecia, Zoan and Logia. See users, abilities, first appearances and more. Updated regularly."
                canonical="https://onepiecedevilfruits.com/"
            />
            <Header headerShown={true} allFruits={all} />
            <main>

                {/* Section to improve SEO reach and assitive tech friendly */}
                <section className="semanticsSection" aria-labelledby="intro">
                    <h2 id="intro" className="visually-hidden">About this list</h2>
                    <p className="pageIntro">
                        This is the complete, fan-made catalog of One Piece Devil Fruits. Filter by type,
                        discover users, abilities and first appearances, and dive into each fruit’s page.
                    </p>
                </section>

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
