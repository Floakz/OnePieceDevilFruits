// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AllFruitsPage from "../pages/fruits/AllFruitsPage.jsx";
import ParameciaFruits from "../pages/fruits/paramecia/ParameciaFruits.jsx";
import LogiaFruits from "../pages/fruits/logia/LogiaFruits.jsx";
import ZoanFruits from "../pages/fruits/zoan/ZoanFruits.jsx";
import CommunityFruits from "../pages/fruits/community/CommunityFruits.jsx";

import RandomFruitPage from "../pages/games/RandomFruitPage.jsx";
import FruitBattlePage from "../pages/games/FruitBattlePage.jsx";
import PageNotFound from "../pages/error/pageNotFound.jsx";
import GrandRun from "../pages/games/GrandRun.jsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Home = All */}
            <Route path="/" element={<AllFruitsPage />} />

            {/* Categorias */}
            <Route path="/paramecia" element={<ParameciaFruits />} />
            <Route path="/logia" element={<LogiaFruits />} />
            <Route path="/zoan" element={<ZoanFruits />} />
            <Route path="/community" element={<CommunityFruits />} />

            {/* Jogos */}
            <Route path="/random-fruit" element={<RandomFruitPage />} />
            <Route path="/fruit-battle" element={<FruitBattlePage />} />
            <Route path="/grand-run" element={<GrandRun />} />

            {/* Redirecionar aliases antigos, se existirem */}
            <Route path="/fruits" element={<Navigate to="/" replace />} />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}
