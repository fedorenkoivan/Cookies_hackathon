import HeroSection from "./HeroSection";
import QuestCard from "./QuestCard";
import "../styles/QuestCard.scss";

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <section className="quests">
            <p className="quests__subtitle">Complete new quests:</p>
            <div className="quests__cards">
                <QuestCard />
            </div>
            </section>
        </>
    );
};

export default HomePage;
