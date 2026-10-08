import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllFruitsOnce, filterByCategoryLocal } from "../../../lib/fruitsApi.js";
import FruitCard from "../../../Components/FruitCard.jsx";
import FruitPagination from "../../../Components/FruitPagination.jsx";
import Header from "../../../Components/header/Header.jsx";
import Seo from "../../../Components/Seo.jsx";
import Footer from "../../../Components/footer/footer.jsx";
import DevilFruitTypeIntro from "../../../Components/DevilFruitTypeIntro/DevilFruitTypeIntro.jsx";

const PAGE_SIZE = 12;

export default function ParameciaFruits() {
    const [all, setAll] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        (async () => setAll(await fetchAllFruitsOnce()))();
    }, []);

    const filtered = useMemo(() => filterByCategoryLocal(all, "Paramecia"), [all]);
    const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, totalPages);
    const visible = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, currentPage]);
    const canonical = `https://onepiecedevilfruits.com/paramecia${currentPage > 1 ? `?page=${currentPage}` : ""}`;

    return (
        <>
            <Seo
                title={`${currentPage > 1 ? `Page ${currentPage} — ` : ""}Paramecia Devil Fruits — Complete List & Users`}
                description="All Paramecia fruits with users, abilities and images."
                canonical={canonical}
            />
            <Header headerShown={true} headerTitle="Paramecia Fruits" />
            <DevilFruitTypeIntro
                title="Paramecia Fruits"
                image="https://cd-opf.pages.dev/fruits/4a4af37d-bd12-4366-9f51-a4cfb7cef101.webp"
                imageAlt="Illustration of a Paramecia-type Devil Fruit"
                facts={[
                    { highlight: "The most common Devil Fruit type,", text: " making up the majority of all known fruits" },
                    { text: "Covers any power that isn't animal transformation or elemental control" },
                    { text: "Powers generally fall into four categories: body alteration, environment manipulation, substance generation, or object creation" },
                    { text: "The most unpredictable type abilities range from simple to bizarre" },
                    { text: "Substances created are typically \"manmade\" rather than natural elements" },
                    { text: "Grants a vast range of unique, standalone abilities unlike any other fruit" },
                ]}
            />
            <main id="fruit-list">
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination basePath="/paramecia" currentPage={currentPage} totalPages={totalPages} />
            <Footer />
        </>
    );
}
