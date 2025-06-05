import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useMemo } from "react"; // Remove useEffect
import "./Profile.scss";
import { useAppContext } from "@/contexts/AppContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import HistoryCard from "./HistoryCard";
import "@/components/Home/QuestCard.scss";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import { useProfileContext } from "@/contexts/ProfileContext";
import { useNavigate } from "react-router-dom";
import { BidirectionalPriorityQueue } from "@/utils/BidirectionalPriorityQueue";
import Loading from "../Loading/Loading";
import { historyQuest } from "@/types/quest";
import PaginatedContent from "../Partial/PaginatedContent";

const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>("Quests");

  const { userData, historyQuests, loading, error } = useProfileContext();
  const { allQuests } = useAppContext();

  const navigate = useNavigate();

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

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  const getSortedHistory = () => {
    if (!historyQuests || !allQuests) return [];

    const queue = new BidirectionalPriorityQueue<historyQuest>();

    historyQuests.forEach((quest) => {
      const questDetails = allQuests.find(
        (q: Quest) => q._id === quest.questId
      );
      if (!questDetails?.questions?.length) return;

      let priority = 0;
      if (!quest.isFinished) {
        priority = quest.currentQuestionIndex / questDetails.questions.length;
      }
      queue.enqueue(quest, priority);
    });

    const result = [];
    while (!queue.isEmpty()) {
      const item = queue.dequeue("min");
      if (item) result.push(item.item);
    }

    return result;
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
            <button
              className="profile__edit-btn"
              onClick={() => navigate("change-info")}
            >
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
        {userData ? (
          activeNavItem === "Quests" ? (
            <div className="quests">
              <PaginatedContent
                items={filteredQuests.filter(
                  (quest: Quest) => quest.author.authorId === userData.id
                )}
                itemsPerPage={6}
                renderItems={(quests) => <QuestCard quests={quests} isDeleteEnabled={true} />}
                emptyMessage="You haven't created any quests yet."
              />
            </div>
          ) : activeNavItem === "Saved" ? (
            <div className="quests">
              <PaginatedContent
                items={filteredQuests}
                itemsPerPage={6}
                renderItems={(quests) => <QuestCard quests={quests} />}
                emptyMessage="You haven't saved any quests yet."
              />
            </div>
          ) : activeNavItem === "History" ? (
            <div className="history-container">
              <PaginatedContent
                items={getSortedHistory().reverse()}
                itemsPerPage={7}
                renderItems={(quests) => (
                  <>
                    {quests.map((quest: historyQuest, index) => {
                      const questDetails = allQuests.find(
                        (q: Quest) => q._id === quest.questId
                      );
                      return (
                        <HistoryCard
                          key={index}
                          _id={quest._id}
                          questDetails={questDetails}
                          questId={quest.questId}
                          currentQuestionIndex={quest.currentQuestionIndex}
                          score={quest.score}
                          timeRemaining={quest.timeRemaining}
                          isFinished={quest.isFinished}
                        />
                      );
                    })}
                  </>
                )}
                emptyMessage="You haven't attempted any quests yet."
              />
            </div>
          ) : null
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Profile;
