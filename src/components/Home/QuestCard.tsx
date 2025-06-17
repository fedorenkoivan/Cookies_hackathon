import { Quest } from "@/types/quest";
import { FaUser, FaClock, FaBookmark, FaTrash } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/logo.jpg";
import { truncateText } from "@/utils/text.ts";
import { useAppContext } from "@/contexts/AppContext";
import { useProfileContext } from "@/contexts/ProfileContext";

interface QuestCardProps {
  quests: Quest[];
  isDeleteEnabled?: boolean;
}

const QuestCard = ({ quests, isDeleteEnabled = false }: QuestCardProps) => {
  const [savedQuests, setSavedQuests] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("savedQuests") || "[]");
  });

  const navigate = useNavigate();
  const { deleteQuest } = useAppContext();
  const { deleteHistoryQuests } = useProfileContext();

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

  const handleDeleteClick = (questId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quest?",
    );

    if (!confirmed) return;

    if (isDeleteEnabled) {
      deleteQuest(questId);
      deleteHistoryQuests(questId, true);
      setSavedQuests((prev) => prev.filter((id) => id !== questId));
      localStorage.setItem(
        "savedQuests",
        JSON.stringify(savedQuests.filter((id) => id !== questId)),
      );
      window.dispatchEvent(new Event("savedQuestsChanged"));
    }
  };

  useEffect(() => {
    const handleSavedQuestsChanged = () => {
      setSavedQuests(JSON.parse(localStorage.getItem("savedQuests") || "[]"));
    };
    window.addEventListener("savedQuestsChanged", handleSavedQuestsChanged);
    return () => {
      window.removeEventListener(
        "savedQuestsChanged",
        handleSavedQuestsChanged,
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
              {isDeleteEnabled && (
                <div
                  className="delete"
                  onClick={() => handleDeleteClick(quest._id)}
                >
                  <FaTrash className="icon" />
                </div>
              )}
            </div>
            <div className="quests__card-info">
              <div className="quests__card-title">
                <p className="title">{truncateText(quest.title, 15)}</p>
                <p className="category">{quest.category}</p>
              </div>
              <div className="quests__card-author">
                <div className="author">
                  <div className="icon">
                    {quest.author.profileImage ? (
                      <img
                        src={quest.author.profileImage}
                        alt={quest.author.username}
                        className="author-avatar"
                      />
                    ) : (
                      <FaUser className="" />
                    )}
                  </div>
                  <button
                    className="author-name-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/public-profile/${quest.author.authorId}`);
                    }}
                  >
                    {quest.author.username}
                  </button>
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
