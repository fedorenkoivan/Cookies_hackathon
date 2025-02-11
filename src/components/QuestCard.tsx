import "../styles/QuestCard.scss";
import { FaUser } from "react-icons/fa";
import StarRating from "./StarRating";

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
        <StarRating rating={DATA.rating} />
        <span>({DATA.reviews})</span>
        <h3 className="quests__title">{DATA.title}</h3>

        <p className="quests__description">{DATA.description}</p>
        <button className="quests__button">Start quest</button>
      </div>
    </div>
  );
};

export default QuestCard;