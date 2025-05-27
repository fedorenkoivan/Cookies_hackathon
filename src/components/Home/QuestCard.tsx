import { Quest } from "@/types/quest";
import { FaUser, FaClock, FaBookmark } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/logo.jpg";

const truncateText = (text: string, limit: number) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

interface QuestCardProps {
  quests: Quest[];
}

const QuestCard = ({ quests }: QuestCardProps) => {
  const [savedQuests, setSavedQuests] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("savedQuests") || "[]");
  });

  const navigate = useNavigate();

  const handleBookmarkClick = (questId: string) => {
    let updated;
    if (!savedQuests.includes(questId)) {
      updated = [...savedQuests, questId];
    } else {
      updated = savedQuests.filter((id) => id !== questId);
    }
    setSavedQuests(updated);
    localStorage.setItem("savedQuests", JSON.stringify(updated));
    window.dispatchEvent(new Event("savedQuestsChanged"));
  };

  useEffect(() => {
    const handleSavedQuestsChanged = () => {
      setSavedQuests(JSON.parse(localStorage.getItem("savedQuests") || "[]"));
    };
    window.addEventListener("savedQuestsChanged", handleSavedQuestsChanged);
    return () => {
      window.removeEventListener(
        "savedQuestsChanged",
        handleSavedQuestsChanged
      );
    };
  }, []);

  return (
    <div>
      <div className="quests__card">
        {quests.map((quest: Quest) => (
          <div className="quests__card-container" key={quest._id}>
            <div className="quests__card-image">
              <img src={quest.image || defaultImage} />
              <div className="bookmark">
                <FaBookmark
                  className={`icon${
                    savedQuests.includes(quest._id) ? "-active" : ""
                  }`}
                  onClick={() => handleBookmarkClick(quest._id)}
                />
              </div>
            </div>
            <div className="quests__card-info">
              <div className="quests__card-title">
                <p className="title">{truncateText(quest.title, 15)}</p>
                <p className="category">{quest.category}</p>
              </div>
              <div className="quests__card-author">
                <div className="author">
                  <div className="icon">
                    <FaUser className="" />
                  </div>
                  <p>{quest.author.username}</p>
                </div>
                <div className="rating">
                  <StarRatingAuto rating={quest.rating} />
                  <p className="reviews">({quest.reviews})</p>
                </div>
              </div>
              <div className="quests__card-start">
                <div className="clock">
                  <div className="icon">
                    <FaClock className="" />
                  </div>
                  {quest.time === -1 ? <p>No limit</p> : <p>{quest.time}s</p>}
                </div>
                <button
                  className="button"
                  onClick={() => navigate(`/preview-quest/${quest._id}`)}
                >
                  Start quest
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestCard;
