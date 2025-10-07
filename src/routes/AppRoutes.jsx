// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import AllFruitsPage from "../pages/fruits/AllFruitsPage.jsx";
import ParameciaFruits from "../pages/fruits/paramecia/ParameciaFruits.jsx";
import LogiaFruits from "../pages/fruits/logia/LogiaFruits.jsx";
import ZoanFruits from "../pages/fruits/zoan/ZoanFruits.jsx";
import CommunityFruits from "../pages/fruits/community/CommunityFruits.jsx";
import ExpandedFruit from "../pages/fruits/expanded/ExpandedFruit.jsx";

import RandomFruitPage from "../pages/games/RandomFruitPage.jsx";
import FruitBattlePage from "../pages/games/FruitBattlePage.jsx";
import PageNotFound from "../pages/error/pageNotFound.jsx";
import GrandRun from "../pages/games/GrandRun.jsx";


function ClarityTracker() {
    const location = useLocation();
    const lastPathRef = useRef("");

    useEffect(() => {
        // evita duplicados na mesma rota (ex: StrictMode)
        const pathKey = location.pathname + location.search + location.hash;
        if (lastPathRef.current === pathKey) return;
        lastPathRef.current = pathKey;

        let tries = 0;
        const iv = setInterval(() => {
            tries++;
            if (typeof window !== "undefined" && typeof window.clarity === "function") {
                try {
                    window.clarity("trackPageview");
                } catch (_) {
                    // se a lib ainda estiver a inicializar, ignora
                } finally {
                    clearInterval(iv);
                }
            }
            if (tries > 20) clearInterval(iv); // ~5s de tentativas
        }, 250);

        return () => clearInterval(iv);
    }, [location.pathname, location.search, location.hash]);

    return null;
}


export default function AppRoutes() {


    return (
        <>
            <ClarityTracker />
            <Routes>
                {/* Home = All */}
                <Route path="/" element={<AllFruitsPage />} />

                {/* Categorias */}
                <Route path="/paramecia" element={<ParameciaFruits />} />
                <Route path="/logia" element={<LogiaFruits />} />
                <Route path="/zoan" element={<ZoanFruits />} />
                <Route path="/community" element={<CommunityFruits />} />

                {/* Fruit Expanded */}
                <Route path="/fruit/:id" element={<ExpandedFruit />} />

                {/* Jogos */}
                <Route path="/random-fruit" element={<RandomFruitPage />} />
                <Route path="/fruit-battle" element={<FruitBattlePage />} />
                <Route path="/grand-run" element={<GrandRun />} />

                {/* Redirecionar aliases antigos, se existirem */}
                <Route path="/fruits" element={<Navigate to="/" replace />} />

                {/* 404 */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    );
}
