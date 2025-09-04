import { useEffect } from "react";

function setMeta(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setMetaProperty(property, content) {
    if (!content) return;
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setLinkRel(rel, href) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

export default function Seo({
    title,
    description,
    canonical,
    image,
    noindex = false,
}) {
    useEffect(() => {
        if (title) document.title = title;
        setMeta("description", description);
        setLinkRel("canonical", canonical);

        // Open Graph / Twitter básico
        setMetaProperty("og:title", title);
        setMetaProperty("og:description", description);
        setMetaProperty("og:url", canonical);
        setMetaProperty("og:type", "website");
        setMetaProperty("og:image", image);
        setMeta("twitter:card", image ? "summary_large_image" : "summary");
        setMeta("twitter:title", title);
        setMeta("twitter:description", description);
        if (image) setMeta("twitter:image", image);

        // noindex opcional
        if (noindex) setMeta("robots", "noindex");
    }, [title, description, canonical, image, noindex]);

    return null; // não renderiza nada
}
