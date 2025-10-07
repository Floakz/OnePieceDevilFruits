// pages/fruits/AllFruitsPage.jsx
import Header from "../../../Components/header/Header.jsx";
import Seo from "../../../Components/Seo.jsx";
import Footer from "../../../Components/footer/footer.jsx";
import FruitCard from "../../../Components/FruitCard.jsx";
import communityFruits from "../../../lib/communityFruits.js";
import { useState, useMemo } from "react";

export default function CommunityFruits() {
    const [fruitsPerPage, setFruitsPerPage] = useState(12);

    const visibleFruits = useMemo(
        () => communityFruits.slice(0, fruitsPerPage),
        [fruitsPerPage]
    );

    const hasMore = fruitsPerPage < communityFruits.length;

    return (
        <>
            <Seo
                title="Community Devil Fruits – Fan-Made One Piece Ideas (Submit Yours)"
                description="Explore community-made Devil Fruits with names, powers, and art. Browse fan creations and submit your own One Piece Devil Fruit idea."
                canonical="https://onepiecedevilfruits.com/fruits/community"
                ogTitle="Community Devil Fruits"
                ogDescription="Fan-made One Piece Devil Fruits. Get inspired and submit yours."
                ogType="website"
            />


            <Header />
            <h2 className="communityTitle">This section of fruits are made by the community</h2>
            <span className="communitySubTitle">if you have any cool fruit ideias send it us via email.</span>

            <main>
                {visibleFruits.map((fruit, idx) => (
                    <FruitCard key={fruit.id ?? idx} {...fruit} clickable={false} />
                ))}
            </main>

            {hasMore && (
                <button
                    className="loadButton"
                    onClick={() => setFruitsPerPage(p => p + 12)}
                >
                    load more
                </button>
            )}

            <Footer />
        </>
    );
}
