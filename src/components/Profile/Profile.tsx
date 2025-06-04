import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useMemo, useEffect } from "react";
import "./Profile.scss";
import { useAppContext } from "@/contexts/AppContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import HistoryCard from "./HistoryCard";
import "@/components/Home/QuestCard.scss";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import { useProfileContext } from "@/contexts/ProfileContext";
import Pagination from "../Partial/Pagination";

import { useNavigate } from "react-router-dom";
import { BidirectionalPriorityQueue } from "@/utils/BidirectionalPriorityQueue";
import Loading from "../Loading/Loading";
import { historyQuest } from "@/types/quest";

const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>("Quests");
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [currentQuestsPage, setCurrentQuestsPage] = useState(1);
  const [currentSavedPage, setCurrentSavedPage] = useState(1);
  const historyItemsPerPage = 7;
  const questsPerPage = 6;

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
      const questDetails = allQuests.find((q: Quest) => q._id === quest.questId);
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

  const paginatedHistory = useMemo(() => {
    const sortedHistory = getSortedHistory().reverse();
    const startIndex = (currentHistoryPage - 1) * historyItemsPerPage;
    return sortedHistory.slice(startIndex, startIndex + historyItemsPerPage);
  }, [historyQuests, allQuests, currentHistoryPage, historyItemsPerPage]);

  const totalHistoryPages = useMemo(() => {
    const sortedHistory = getSortedHistory().reverse();
    return Math.ceil(sortedHistory.length / historyItemsPerPage);
  }, [historyQuests, allQuests, historyItemsPerPage]);

  const paginatedQuests = useMemo(() => {
    const startIndex = (currentQuestsPage - 1) * questsPerPage;
    const userQuests = filteredQuests.filter((quest: Quest) => 
      quest.author.authorId === userData?.id
    );
    return userQuests.slice(startIndex, startIndex + questsPerPage);
  }, [filteredQuests, currentQuestsPage, userData?.id]);

  const paginatedSavedQuests = useMemo(() => {
    const startIndex = (currentSavedPage - 1) * questsPerPage;
    const savedQuestsStr = localStorage.getItem("savedQuests");
    const savedQuests = savedQuestsStr ? JSON.parse(savedQuestsStr) : [];
    const savedQuestsList = filteredQuests.filter((quest: Quest) => 
      savedQuests.includes(quest._id)
    );
    return savedQuestsList.slice(startIndex, startIndex + questsPerPage);
  }, [filteredQuests, currentSavedPage]);

  const totalQuestsPages = useMemo(() => {
    const userQuests = filteredQuests.filter(
      (quest: Quest) => quest.author.authorId === userData?.id
    );
    return Math.ceil(userQuests.length / questsPerPage);
  }, [filteredQuests, userData?.id]);

  const totalSavedPages = useMemo(() => {
    const savedQuestsStr = localStorage.getItem("savedQuests");
    const savedQuests = savedQuestsStr ? JSON.parse(savedQuestsStr) : [];
    const savedQuestsCount = filteredQuests.filter((quest: Quest) => 
      savedQuests.includes(quest._id)
    ).length;
    return Math.ceil(savedQuestsCount / questsPerPage);
  }, [filteredQuests]);

  useEffect(() => {
    if (activeNavItem === "History") {
      setCurrentHistoryPage(1);
    } else if (activeNavItem === "Quests") {
      setCurrentQuestsPage(1);
    } else if (activeNavItem === "Saved") {
      setCurrentSavedPage(1);
    }
  }, [activeNavItem]);

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
            <button className="profile__edit-btn"
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
              <QuestCard quests={paginatedQuests} />
              
              {totalQuestsPages > 1 && (
                <div className="pagination-container">
                  <Pagination 
                    currentPage={currentQuestsPage}
                    totalPages={totalQuestsPages}
                    onPageChange={(page) => setCurrentQuestsPage(page)}
                  />
                </div>
              )}
            </div>
          ) : activeNavItem === "Saved" ? (
            <div className="quests">
              <QuestCard quests={paginatedSavedQuests} />
              
              {totalSavedPages > 1 && (
                <div className="pagination-container">
                  <Pagination 
                    currentPage={currentSavedPage}
                    totalPages={totalSavedPages}
                    onPageChange={(page) => setCurrentSavedPage(page)}
                  />
                </div>
              )}
            </div>
          ) : activeNavItem === "History" ? (
            <div className="history-container">
              {paginatedHistory.map((quest, index) => {
                const questDetails = allQuests.find((q: Quest) => q._id === quest.questId);
                return (
                  <HistoryCard
                    key={index}
                    questDetails={questDetails}
                    questId={quest.questId}
                    currentQuestionIndex={quest.currentQuestionIndex}
                    score={quest.score}
                    timeRemaining={quest.timeRemaining}
                    isFinished={quest.isFinished}
                  />
                );
              })}

              {totalHistoryPages > 1 && (
                <div className="pagination-container">
                  <Pagination 
                    currentPage={currentHistoryPage}
                    totalPages={totalHistoryPages}
                    onPageChange={(page) => setCurrentHistoryPage(page)}
                  />
                </div>
              )}
            </div>
          ) : null
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
