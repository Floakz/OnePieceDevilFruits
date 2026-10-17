export default function CatalogState({ status, empty, retry, clearFilters }) {
    if (status === 'ready' && !empty) return null;
    return (
        <div className="catalogState" role={status === 'error' ? 'alert' : 'status'}>
            {status === 'loading' ? <p>Loading the fruit list…</p> : status === 'error' ? <>
                <p>The fruit list couldn’t load. Give it another try.</p>
                <button type="button" onClick={retry}>Try again</button>
            </> : <>
                <p>No fruits match those filters.</p>
                <button type="button" onClick={clearFilters}>Clear filters</button>
            </>}
        </div>
    );
}
