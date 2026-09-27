import { Link } from "react-router-dom";

function pageUrl(basePath, page) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
}

function scrollToFruitList(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    window.setTimeout(() => {
        const fruitList = document.getElementById("fruit-list");
        if (!fruitList) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const listTop = window.scrollY + fruitList.getBoundingClientRect().top - 70;
        window.scrollTo({
            top: Math.max(0, listTop),
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }, 0);
}

export default function FruitPagination({ basePath, currentPage, totalPages }) {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 3;
    let firstVisiblePage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const lastVisiblePage = Math.min(totalPages, firstVisiblePage + maxVisiblePages - 1);
    firstVisiblePage = Math.max(1, lastVisiblePage - maxVisiblePages + 1);

    const pages = Array.from(
        { length: lastVisiblePage - firstVisiblePage + 1 },
        (_, index) => firstVisiblePage + index
    );

    return (
        <nav className="fruitPagination" aria-label="Fruit list pages">
            {currentPage > 1 && (
                <Link to={pageUrl(basePath, currentPage - 1)} rel="prev" aria-label="Previous page" onClick={scrollToFruitList}>Previous</Link>
            )}
            <div className="fruitPaginationPages">
                {pages.map(page => (
                    page === currentPage
                        ? <span key={page} aria-current="page">{page}</span>
                        : <Link key={page} to={pageUrl(basePath, page)} aria-label={`Page ${page}`} onClick={scrollToFruitList}>{page}</Link>
                ))}
            </div>
            {currentPage < totalPages && (
                <Link to={pageUrl(basePath, currentPage + 1)} rel="next" aria-label="Next page" onClick={scrollToFruitList}>Next</Link>
            )}
        </nav>
    );
}
