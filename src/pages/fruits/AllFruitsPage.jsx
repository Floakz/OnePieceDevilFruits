import useFruitCatalog from '../../hooks/useFruitCatalog.js';
import CatalogState from '../../Components/CatalogState.jsx';
import RatingsGuide from '../../Components/RatingsGuide.jsx';
import FruitCard from "../../Components/FruitCard.jsx";
import FruitPagination from "../../Components/FruitPagination.jsx";
import Header from "../../Components/header/Header.jsx";
import Seo from "../../Components/Seo.jsx";
import Footer from "../../Components/footer/footer.jsx";
import LatestSection from "../../Components/header/latestSection/latestSection.jsx";
import FruitArcFilter from "../../Components/FruitArcFilter/FruitArcFilter.jsx";


export default function AllFruitsPage() {
    const { categoryFruits, filtered, visible, totalPages, currentPage, filters, queryParams, onFilterChange, clearFilters, status, retry } = useFruitCatalog('all');
    const selectedArc = filters.arc;
    const canonical = `https://onepiecedevilfruits.com/${currentPage > 1 ? `?page=${currentPage}` : ''}`;

    return (
        <>
            <Seo
                title={`${currentPage > 1 ? `Page ${currentPage} — ` : ""}All Devil Fruits — Complete List, Types, Users & Powers`}
                description="Explore every Devil Fruit in One Piece: Paramecia, Zoan and Logia. See users, abilities, first appearances and more. Updated regularly."
                canonical={canonical}
            />
            <Header headerShown={true} />
            <LatestSection />
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
                <section className="semanticsSection" aria-labelledby="intro">
                    <h2 id="intro" className="visually-hidden">About this list</h2>
                    <p className="pageIntro">
                        This is the complete, fan-made catalog of One Piece Devil Fruits. Filter by type,
                        discover users, abilities and first appearances, and dive into each fruit’s page.
                    </p>
                </section>
                {visible.map(fruit => <FruitCard key={fruit.id} {...fruit} clickable={true} />)}
            </main>
            <FruitPagination
                basePath="/"
                currentPage={currentPage}
                totalPages={totalPages}
                queryParams={queryParams}
            />
            <Footer />
        </>
    );
}
