import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useMemo, useEffect } from "react";
import "./Profile.scss";
import { useAppContext } from "@/contexts/AppContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import "@/components/Home/QuestCard.scss";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import { useProfileContext } from "@/contexts/ProfileContext";
// import { BidirectionalPriorityQueue } from "@/utils/BidirectionalPriorityQueue";
import Loading from "../Loading/Loading";

const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>("Quests");

  const { userData, historyQuests, fetchHistoryQuests, loading, error } = useProfileContext();
  const { allQuests } = useAppContext();

  const filteredQuests = useMemo(() => {
    if (!userData || !allQuests) return [];

    return allQuests.filter((quest: Quest) => {
      if (activeNavItem === "Quests") {
        return quest.author.authorId === userData.id;
      } else if (activeNavItem === "Saved") {
        const savedQuestsStr = localStorage.getItem("savedQuests");
        const savedQuests = savedQuestsStr ? JSON.parse(savedQuestsStr) : [];
        return savedQuests.includes(quest._id);
      } else {
        return false;
      }
    });
  }, [allQuests, activeNavItem, userData]);

  useEffect(() => {
    if (activeNavItem === "History") {
      fetchHistoryQuests();
    }
  }, [activeNavItem]);

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="profile__container">Error: {error}</div>;
  }

  return (
    <div className="profile__container">
      <div className="profile__top_container">
        <div className="profile__header">
          <div className="profile__avatar">
            <div className="image">
              <img src="./src/assets/img1.png" alt="Avatar" />
            </div>
          </div>
          <div className="profile__user-info">
            <h1>{userData?.name || "USERNAME"}</h1>
            <p>{userData?.email}</p>
            <div className="profile__rating">
              <StarRatingAuto rating={3.5} />
            </div>
          </div>
          <div className="profile__actions">
            <button className="profile__edit-btn">
              <FaEdit />
            </button>
            <button className="profile__share-btn">
              <FaShareAlt />
            </button>
          </div>
        </div>
        <div className="profile__nav">
          {["Saved", "Quests", "History"].map((item) => (
            <span
              key={item}
              className={`profile__nav-item ${
                activeNavItem === item ? "active" : ""
              }`}
              onClick={() => handleNavItemClick(item)}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="profile__quests">
        {userData && activeNavItem !== "History" ? (
          <div className="quests">
            <QuestCard quests={filteredQuests} />
          </div>
        ) : activeNavItem === "History" ? (
          <div className="history-container">
            <h2>History</h2>
            {historyQuests?.map((quest, index) => {
              const questDetails = allQuests.find((q: Quest) => q._id === quest.questId);

              return (
                <div key={index} className="history-quest-item">
                  <p>Quest Title: {questDetails?.title || "Unknown"}</p>
                  <p>Author: {questDetails?.author.username || "Unknown"}</p>
                  <p>Category: {questDetails?.category || "Unknown"}</p>
                  <p>{quest.questId}</p>
                  <p>Score: {quest.score}</p>
                  <p>Time Remaining: {quest.timeRemaining}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loading-container">
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
