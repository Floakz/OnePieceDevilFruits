import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllFruitsOnce, filterByCategoryLocal } from "../../../lib/fruitsApi.js";
import FruitCard from "../../../Components/FruitCard.jsx";
import FruitPagination from "../../../Components/FruitPagination.jsx";
import Header from "../../../Components/header/Header.jsx";
import Seo from "../../../Components/Seo.jsx";
import Footer from "../../../Components/footer/footer.jsx";
import DevilFruitTypeIntro from "../../../Components/DevilFruitTypeIntro/DevilFruitTypeIntro.jsx";
import FruitArcFilter from "../../../Components/FruitArcFilter/FruitArcFilter.jsx";
import { filterFruitsByDebutArc } from "../../../lib/fruitArcs.js";

const PAGE_SIZE = 12;

export default function LogiaFruits() {
    const [all, setAll] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        (async () => setAll(await fetchAllFruitsOnce()))();
    }, []);

    const categoryFruits = useMemo(() => filterByCategoryLocal(all, "Logia"), [all]);
    const selectedArc = searchParams.get("arc") || "all";
    const filtered = useMemo(
        () => filterFruitsByDebutArc(categoryFruits, selectedArc),
        [categoryFruits, selectedArc]
    );
    const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, totalPages);
    const visible = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, currentPage]);
    const canonical = `https://onepiecedevilfruits.com/logia${currentPage > 1 ? `?page=${currentPage}` : ""}`;

    function handleArcChange(arc) {
        const nextParams = new URLSearchParams(searchParams);
        if (arc === "all") nextParams.delete("arc");
        else nextParams.set("arc", arc);
        nextParams.delete("page");
        setSearchParams(nextParams);
    }

    return (
        <>
            <Seo
                title={`${currentPage > 1 ? `Page ${currentPage} — ` : ""}Logia Devil Fruits — Complete List & Users`}
                description="All Logia fruits with users, abilities and images."
                canonical={canonical}
            />
            <Header headerShown={true} headerTitle="Logia Fruits" />
            <DevilFruitTypeIntro
                title="Logia Fruits"
                image="https://cd-opf.pages.dev/fruits/488246a5-5153-416d-bdb7-a1aafc252f57.webp"
                imageAlt="Illustration of a Logia-type Devil Fruit"
                facts={[
                    { highlight: "Grants the power to create, control, and transform into a natural element,", text: " such as fire, ice, or lightning" },
                    { text: "Considered the rarest and most powerful type due to near-total physical intangibility" },
                    { text: "Users can typically only be harmed by Haki, other Logia-based elements, or specific environmental weaknesses" },
                    { text: "Allows near god-like control over an entire environment, from weather to terrain" },
                    { text: "Only a handful of Logia users have ever been shown in the series" },
                    { text: "Many Logia abilities double as instant transportation, such as becoming lightning, light, or smoke" },
                ]}
            />
            <FruitArcFilter
                fruits={categoryFruits}
                selectedArc={selectedArc}
                resultCount={filtered.length}
                onChange={handleArcChange}
            />
            <main id="fruit-list">
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination
                basePath="/logia"
                currentPage={currentPage}
                totalPages={totalPages}
                queryParams={selectedArc === "all" ? undefined : { arc: selectedArc }}
            />
            <Footer />
        </>
    );
}
