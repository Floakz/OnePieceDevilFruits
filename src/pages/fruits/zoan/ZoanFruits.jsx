import useFruitCatalog from '../../../hooks/useFruitCatalog.js';
import CatalogState from '../../../Components/CatalogState.jsx';
import RatingsGuide from '../../../Components/RatingsGuide.jsx';
import FruitCard from "../../../Components/FruitCard.jsx";
import FruitPagination from "../../../Components/FruitPagination.jsx";
import Header from "../../../Components/header/Header.jsx";
import Seo from "../../../Components/Seo.jsx";
import Footer from "../../../Components/footer/footer.jsx";
import DevilFruitTypeIntro from "../../../Components/DevilFruitTypeIntro/DevilFruitTypeIntro.jsx";
import FruitArcFilter from "../../../Components/FruitArcFilter/FruitArcFilter.jsx";


export default function ZoanFruits() {
    const { categoryFruits, filtered, visible, totalPages, currentPage, filters, queryParams, onFilterChange, clearFilters, status, retry } = useFruitCatalog('Zoan');
    const selectedArc = filters.arc;
    const canonical = `https://onepiecedevilfruits.com/zoan${currentPage > 1 ? `?page=${currentPage}` : ''}`;

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
            <FruitArcFilter
                fruits={categoryFruits}
                selectedArc={selectedArc}
                resultCount={filtered.length}
                onChange={arc => onFilterChange('arc', arc)}
                filters={filters}
                onFilterChange={onFilterChange}
                clearFilters={clearFilters}
            />
            <main id="fruit-list" aria-busy={status === 'loading'}>
                <CatalogState status={status} empty={!filtered.length} retry={retry} clearFilters={clearFilters} />
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination
                basePath="/zoan"
                currentPage={currentPage}
                totalPages={totalPages}
                queryParams={queryParams}
            />
            <Footer />
        </>
    );
}
