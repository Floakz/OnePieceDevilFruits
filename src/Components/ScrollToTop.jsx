import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();
    const previousPath = useRef(null);

    useEffect(() => {
        if (previousPath.current === pathname) return;
        previousPath.current = pathname;
        if (hash) return;
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, [pathname, hash]);

    return null;
}
