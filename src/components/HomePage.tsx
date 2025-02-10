import HeroSection from "./HeroSection";
import QuestCard from "./QuestCard";
import "../styles/QuestCard.scss";
import Users from "./Users";

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <section className="quests">
            <p className="quests__subtitle">Complete new quests:</p>
            <div className="quests__cards">
                <QuestCard />
                <QuestCard />
                <QuestCard />
                <QuestCard />
                <QuestCard />
            </div>
            <Users />
            </section>
        </>
    );
};

export default HomePage