// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import AllFruitsPage from "../pages/fruits/AllFruitsPage.jsx";
import ScrollToTop from "../Components/ScrollToTop.jsx";

const ParameciaFruits = lazy(() => import("../pages/fruits/paramecia/ParameciaFruits.jsx"));
const LogiaFruits = lazy(() => import("../pages/fruits/logia/LogiaFruits.jsx"));
const ZoanFruits = lazy(() => import("../pages/fruits/zoan/ZoanFruits.jsx"));
const CommunityFruits = lazy(() => import("../pages/fruits/community/CommunityFruits.jsx"));
const ExpandedFruit = lazy(() => import("../pages/fruits/expanded/ExpandedFruit.jsx"));
const FruitFinderPage = lazy(() => import("../pages/games/FruitFinderPage.jsx"));
const CrewWars = lazy(() => import("../pages/games/CrewWars.jsx"));
const PageNotFound = lazy(() => import("../pages/error/pageNotFound.jsx"));
const GrandRun = lazy(() => import("../pages/games/GrandRun.jsx"));
const DailyFight = lazy(() => import("../pages/games/dailyFight/dailyFight.jsx"));
const Quizzes = lazy(() => import("../pages/games/quizzes/Quizzes.jsx"));
const ExpandedQuizz = lazy(() => import("../pages/games/quizzes/expandedQuizz.jsx"));
const Store = lazy(() => import("../pages/store/store.jsx"));

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
                } catch {
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
            <ScrollToTop />
            <Suspense fallback={<div className="routeLoader" role="status">Loading…</div>}>
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


                {/* Store */}
                <Route path="/treasure-chest" element={<Store />} />

                {/* Jogos */}
                <Route path="/fruit-finder" element={<FruitFinderPage />} />
                <Route path="/crew-wars" element={<CrewWars />} />
                <Route path="/grand-run" element={<GrandRun />} />
                <Route path="/daily-fight" element={<DailyFight />} />

                {/* Quizzes */}
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/quizzes/:id" element={<ExpandedQuizz />} />

                {/* Redirecionar aliases antigos, se existirem */}
                <Route path="/fruits" element={<Navigate to="/" replace />} />

                {/* 404 */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            </Suspense>
        </>
    );
}
