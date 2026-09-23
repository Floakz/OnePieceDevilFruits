import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllFruitsOnce, filterByCategoryLocal } from "../../lib/fruitsApi.js";
import FruitCard from "../../Components/FruitCard.jsx";
import FruitPagination from "../../Components/FruitPagination.jsx";
import Header from "../../Components/header/Header.jsx";
import Seo from "../../Components/Seo.jsx";
import Footer from "../../Components/footer/footer.jsx";
import LatestSection from "../../Components/header/latestSection/latestSection.jsx";

const PAGE_SIZE = 12;

export default function AllFruitsPage() {
    const [all, setAll] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        (async () => setAll(await fetchAllFruitsOnce()))();
    }, []);

    const filtered = useMemo(() => filterByCategoryLocal(all, "all"), [all]);
    const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, totalPages);
    const visible = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, currentPage]);
    const canonical = `https://onepiecedevilfruits.com/${currentPage > 1 ? `?page=${currentPage}` : ""}`;

    return (
        <>
            <Seo
                title={`${currentPage > 1 ? `Page ${currentPage} — ` : ""}All Devil Fruits — Complete List, Types, Users & Powers`}
                description="Explore every Devil Fruit in One Piece: Paramecia, Zoan and Logia. See users, abilities, first appearances and more. Updated regularly."
                canonical={canonical}
            />
            <Header headerShown={true} />
            <LatestSection />
            <main id="fruit-list">
                <section className="semanticsSection" aria-labelledby="intro">
                    <h2 id="intro" className="visually-hidden">About this list</h2>
                    <p className="pageIntro">
                        This is the complete, fan-made catalog of One Piece Devil Fruits. Filter by type,
                        discover users, abilities and first appearances, and dive into each fruit’s page.
                    </p>
                </section>
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination basePath="/" currentPage={currentPage} totalPages={totalPages} />
            <Footer />
        </>
    );
}
