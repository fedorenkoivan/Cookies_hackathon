import QuestCard from "../Quests/QuestCard";
import "../../styles/QuestCard.scss";

const HomePage = () => {
    return (
        <>
            <section className="quests">
            <div className="quests__cards">
                <QuestCard />
            </div>
            </section>
        </>
    );
};

export default HomePage;
