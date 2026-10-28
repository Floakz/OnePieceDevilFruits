import { Link } from "react-router-dom";

function pageUrl(basePath, page, queryParams = {}) {
    const params = new URLSearchParams(queryParams);
    if (page > 1) params.set("page", String(page));
    else params.delete("page");

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
}

function scrollToList(event, listId) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    window.setTimeout(() => {
        const list = document.getElementById(listId);
        if (!list) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const listTop = window.scrollY + list.getBoundingClientRect().top - 70;
        window.scrollTo({
            top: Math.max(0, listTop),
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }, 0);
}

export default function FruitPagination({ basePath, currentPage, totalPages, queryParams, listId = 'fruit-list', label = 'Fruit list pages', getPageUrl }) {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 3;
    let firstVisiblePage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const lastVisiblePage = Math.min(totalPages, firstVisiblePage + maxVisiblePages - 1);
    firstVisiblePage = Math.max(1, lastVisiblePage - maxVisiblePages + 1);

    const pages = Array.from(
        { length: lastVisiblePage - firstVisiblePage + 1 },
        (_, index) => firstVisiblePage + index
    );
    const url = page => getPageUrl ? getPageUrl(page, queryParams) : pageUrl(basePath, page, queryParams);
    const onPageClick = event => scrollToList(event, listId);

    return (
        <nav className="fruitPagination" aria-label={label}>
            {currentPage > 1 && (
                <Link to={url(currentPage - 1)} rel="prev" aria-label="Previous page" onClick={onPageClick}>Previous</Link>
            )}
            <div className="fruitPaginationPages">
                {pages.map(page => (
                    page === currentPage
                        ? <span key={page} aria-current="page">{page}</span>
                        : <Link key={page} to={url(page)} aria-label={`Page ${page}`} onClick={onPageClick}>{page}</Link>
                ))}
            </div>
            {currentPage < totalPages && (
                <Link to={url(currentPage + 1)} rel="next" aria-label="Next page" onClick={onPageClick}>Next</Link>
            )}
        </nav>
    );
}
