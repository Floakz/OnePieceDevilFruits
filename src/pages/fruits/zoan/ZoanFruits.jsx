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

export default function ZoanFruits() {
    const [all, setAll] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        (async () => setAll(await fetchAllFruitsOnce()))();
    }, []);

    const filtered = useMemo(() => filterByCategoryLocal(all, "Zoan"), [all]);
    const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, totalPages);
    const visible = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, currentPage]);
    const canonical = `https://onepiecedevilfruits.com/zoan${currentPage > 1 ? `?page=${currentPage}` : ""}`;

    return (
        <>
            <Seo
                title={`${currentPage > 1 ? `Page ${currentPage} — ` : ""}Zoan Devil Fruits — Complete List & Users`}
                description="All Zoan fruits with users, abilities and images."
                canonical={canonical}
            />
            <Header headerShown={true} headerTitle="Zoan Fruits" />
            <DevilFruitTypeIntro
                title="Zoan Fruits"
                image="https://cd-opf.pages.dev/fruits/566d7c09-6866-4455-b85b-d3a05609c671.webp"
                imageAlt="Illustration of a Zoan-type Devil Fruit"
                facts={[
                    { highlight: "Grants the power to transform into an animal,", text: " in full, hybrid, or human form" },
                    { text: "The only type that provides a passive boost to strength, speed, and endurance even outside of combat" },
                    { text: "Divided into three rarity tiers: Common, Ancient, and Mythical Zoan" },
                    { text: "The hybrid form is usually considered the most versatile, balancing human intellect with animal power" },
                    { text: "The only Devil Fruit type that can currently be artificially replicated" },
                    { text: "Mythical Zoans grant the powers of legendary or divine creatures, such as dragons and phoenixes" },
                ]}
            />
            <main id="fruit-list">
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination basePath="/zoan" currentPage={currentPage} totalPages={totalPages} />
            <Footer />
        </>
    );
}
