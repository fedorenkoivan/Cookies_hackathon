import QuestCard from "./QuestCard";
import "../styles/QuestCard.scss";

const QuestsSection = () => {
  return (
    <section className="quests">
      <p className="quests__subtitle">Complete new quests:</p>
      <div className="quests__cards">
        <QuestCard />
        <QuestCard />
        <QuestCard />
        <QuestCard />
        <QuestCard />
      </div>
    </section>
  );
};

export default QuestsSection;
