import { useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../Components/header/Header.jsx';
import Footer from '../../Components/footer/footer.jsx';
import Seo from '../../Components/Seo.jsx';
import CharacterCard from './CharacterCard.jsx';
import FruitPagination from '../../Components/FruitPagination.jsx';
import characterIndex from '../../lib/characterIndex.js';
import { paginateCharacters, characterPageUrl, CHARACTER_GROUPS, CHARACTER_SCOPE } from '../../lib/characterCatalog.js';
import { getCharactersSeo } from '../../lib/characterSeo.js';
import styles from './characters.module.css';

export default function CharactersPage() {
    const [params] = useSearchParams();
    const { page } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const query = params.get('q') || '';
    const group = CHARACTER_GROUPS.includes(params.get('group')) ? params.get('group') : 'all';
    const { visible, total, totalPages, currentPage, rangeStart, rangeEnd } = paginateCharacters(characterIndex, { query, group, page });
    const pagePath = characterPageUrl(currentPage);
    const queryParams = { ...(query ? { q: query } : {}), ...(group !== 'all' ? { group } : {}) };

    useEffect(() => {
        if (pathname !== pagePath) navigate(characterPageUrl(currentPage, params), { replace: true });
    }, [pathname, pagePath, currentPage, params, navigate]);

    function changeFilter(key, value) {
        const next = new URLSearchParams(params);
        if (!value || value === 'all') next.delete(key);
        else next.set(key, value);
        navigate(characterPageUrl(1, next), { replace: true });
    }

    return <>
        <Seo {...getCharactersSeo(currentPage)} />
        <Header headerShown={false} compact />
        <main className={styles.page}>
            <div className={styles.intro}>
                <h1>One Piece<br /><span className="colorYellow">Characters</span></h1>
                <p>Background, abilities, and stories from East Blue to Arabasta.</p>
                <small>{characterIndex.length} Devil Fruit users. {CHARACTER_SCOPE}</small>
            </div>
            <section className={styles.filters} aria-label="Character filters">
                <label className={styles.search} htmlFor="character-search">Find a character
                    <input id="character-search" type="search" placeholder="Name, alias, or Devil Fruit…"
                        value={query} onChange={event => changeFilter('q', event.target.value)} />
                </label>
                <label className={styles.groupSelect} htmlFor="character-group">Crew or group
                    <select id="character-group" value={group} onChange={event => changeFilter('group', event.target.value)}>
                        <option value="all">All groups</option>
                        {CHARACTER_GROUPS.map(group => <option key={group}>{group}</option>)}
                    </select>
                </label>
                <p className={styles.count} role="status">{total === 1 ? '1 character' : total ? `${rangeStart}–${rangeEnd} of ${total} characters` : '0 characters'}</p>
                {(query || group !== 'all') && <button className={styles.clear} type="button" onClick={() => navigate('/characters', { replace: true })}>Clear filters</button>}
            </section>
            <div id="character-list" className={styles.grid}>
                {visible.map(profile => <CharacterCard key={profile.slug} profile={profile} />)}
            </div>
            {!visible.length && <div className={styles.empty}>
                <h2>No characters found</h2><p>Try another name or clear the filters to see everyone.</p>
                <button className={styles.button} type="button" onClick={() => navigate('/characters', { replace: true })}>Show all characters</button>
            </div>}
        </main>
        <FruitPagination basePath="/characters" currentPage={currentPage} totalPages={totalPages} queryParams={queryParams}
            getPageUrl={characterPageUrl} listId="character-list" label="Character list pages" />
        <Footer />
    </>;
}
