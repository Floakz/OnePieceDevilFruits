import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Components/header/Header.jsx';
import Footer from '../../Components/footer/footer.jsx';
import Seo from '../../Components/Seo.jsx';

export default function LegalDocument({ seo, html }) {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
        return () => cancelAnimationFrame(frame);
    }, [hash]);

    return <>
        <Seo {...seo} />
        <Header compact />
        <main className="legal-document" dangerouslySetInnerHTML={{ __html: html }} />
        <Footer />
    </>;
}
