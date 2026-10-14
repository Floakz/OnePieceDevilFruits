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


export default function ParameciaFruits() {
    const { categoryFruits, filtered, visible, totalPages, currentPage, filters, queryParams, onFilterChange, clearFilters, status, retry } = useFruitCatalog('Paramecia');
    const selectedArc = filters.arc;
    const canonical = `https://onepiecedevilfruits.com/paramecia${currentPage > 1 ? `?page=${currentPage}` : ''}`;

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
                basePath="/paramecia"
                currentPage={currentPage}
                totalPages={totalPages}
                queryParams={queryParams}
            />
            <Footer />
        </>
    );
}
