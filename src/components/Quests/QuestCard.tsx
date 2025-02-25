import "../../styles/QuestCard.scss";
import { FaUser } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import axios from "axios";
import { useEffect, useState } from "react";

interface Quest {
  author: string;
  id: number;
  title: string;
  description: string;
  category: string;
  time_limit: number;
  image_url: string;
  rating: number;
  review: number;
}

const QuestCard = () => {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/quests");
        setQuests(response.data);
        console.log(response, response.data);
      } catch (err) {
        console.log("err:", err);
      }
    })();
  }, []);

  return (
    <div className="quests__container">
      {quests.map((quest) => (
        <div className="quests__card" key={quest.id}>
          <img
            src={`http://localhost:3000${quest.image_url}`}
            alt="Quest"
            className="quests__image"
          />
          <div className="quests__info">
            <div className="quests__author-time">
              <div className="quests__author">
                <FaUser /> {quest.author}
              </div>
              <div className="quests__time">{quest.time_limit}s</div>
            </div>
            <StarRatingAuto rating={quest.rating} />
            <span>({quest.review})</span>
            <h3 className="quests__title">{quest.title}</h3>
            <p className="quests__description">{quest.description}</p>
            <button className="quests__button">Start quest</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestCard;
