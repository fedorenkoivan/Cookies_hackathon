import "../styles/QuestCard.scss";
import { FaUser } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const QuestCard = () => {

  const DATA = {
    author: "QuestMaker52",
    title: "Hard math problem",
    description: "Test for true cookie lovers",
    time: "5:00",
    rating: 4.33,
    reviews: 52,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Vxi41gNCvVjNnZRBMd8COaKOVsdG6yCFDA&s",
  };

  const INDEXES = [0, 1, 2, 3, 4];

  return (
    <div className="quests__card">
      <img src={DATA.image} alt="Quest" className="quests__image" />
      <div className="quests__info">
        <div className="quests__author-time">
          <div className="quests__author">
            <FaUser /> {DATA.author}
          </div>
          <div className="quests__time">{DATA.time}</div>
        </div>
        <div className="quests__rating">
          {INDEXES.map((index) => {
            const fillPercentage =
              Math.min(Math.max(DATA.rating - index, 0), 1) * 100;

            return (
              <div key={index} className="quests__rating star-wrapper">
                <FaStar className="quests__rating star-bg" />
                <FaStar
                  className="quests__rating star-fill"
                  style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
                />
              </div>
            );
          })}
          <span>({DATA.reviews})</span>
        </div>

        <h3 className="quests__title">{DATA.title}</h3>

        <p className="quests__description">{DATA.description}</p>
        <button className="quests__button">Start quest</button>
      </div>
    </div>
  );
};

export default QuestCard;
