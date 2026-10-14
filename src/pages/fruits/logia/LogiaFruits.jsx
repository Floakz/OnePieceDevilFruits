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


export default function LogiaFruits() {
    const { categoryFruits, filtered, visible, totalPages, currentPage, filters, queryParams, onFilterChange, clearFilters, status, retry } = useFruitCatalog('Logia');
    const selectedArc = filters.arc;
    const canonical = `https://onepiecedevilfruits.com/logia${currentPage > 1 ? `?page=${currentPage}` : ''}`;

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
                onChange={arc => onFilterChange('arc', arc)}
                filters={filters}
                onFilterChange={onFilterChange}
                clearFilters={clearFilters}
            />
            <RatingsGuide compact />
            <main id="fruit-list" aria-busy={status === 'loading'}>
                <CatalogState status={status} empty={!filtered.length} retry={retry} clearFilters={clearFilters} />
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination
                basePath="/logia"
                currentPage={currentPage}
                totalPages={totalPages}
                queryParams={queryParams}
            />
            <Footer />
        </>
    );
}
