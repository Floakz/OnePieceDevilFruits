import { useEffect } from "react";

function setMeta(attribute, key, content) {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!content) {
        element?.remove();
        return;
    }
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function setLinkRel(rel, href) {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!href) {
        element?.remove();
        return;
    }
    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }
    element.setAttribute("href", href);
}

export default function Seo({
    title,
    description,
    canonical,
    image,
    type = "website",
    noindex = false,
    jsonLd,
}) {
    useEffect(() => {
        if (title) document.title = title;
        setMeta("name", "description", description);
        setLinkRel("canonical", canonical);

        setMeta("property", "og:title", title);
        setMeta("property", "og:description", description);
        setMeta("property", "og:url", canonical);
        setMeta("property", "og:type", type);
        setMeta("property", "og:image", image);
        setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
        setMeta("name", "twitter:title", title);
        setMeta("name", "twitter:description", description);
        setMeta("name", "twitter:image", image);
        setMeta("name", "robots", noindex ? "noindex,follow" : null);

        let structuredData = document.getElementById("page-json-ld");
        if (!jsonLd) {
            structuredData?.remove();
        } else {
            if (!structuredData) {
                structuredData = document.createElement("script");
                structuredData.id = "page-json-ld";
                structuredData.type = "application/ld+json";
                document.head.appendChild(structuredData);
            }
            structuredData.textContent = JSON.stringify(jsonLd);
        }
    }, [title, description, canonical, image, type, noindex, jsonLd]);

    return null;
}
