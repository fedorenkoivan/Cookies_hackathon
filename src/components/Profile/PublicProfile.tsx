import StarRatingAuto from "../Rating/StarRatingAuto";
import { useMemo } from "react";
import { useQuestContext } from "@/contexts/QuestContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import "@/components/Home/QuestCard.scss";
import { FaShareAlt } from "react-icons/fa";
import { useProfileContext } from "@/contexts/ProfileContext";
import Loading from "../Loading/Loading";
import defaultAvatar from "../../assets/img1.png"
import "./PublicProfile.scss";

const PublicProfile = () => {
  const { userData, loading, error } = useProfileContext();
  const { allQuests } = useQuestContext();

  const filteredQuests = useMemo(() => {
    if (!userData || !allQuests) return [];

    return allQuests.filter((quest: Quest) => quest.author.authorId === userData.id);
  }, [allQuests, userData]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="public-profile__container">Error: {error}</div>;
  }

  return (
    <div className="public-profile__container">
      <div className="public-profile__top_container">
        <div className="public-profile__header">
          <div className="public-profile__avatar">
            <div className="image">
              <img src={defaultAvatar} alt="Avatar" />
            </div>
          </div>
          <div className="public-profile__user-info">
            <h1>{userData?.name || "USERNAME"}</h1>
            <p>{userData?.email}</p>
            <div className="public-profile__rating">
              <StarRatingAuto rating={3.5} />
            </div>
          </div>
          <div className="public-profile__actions">
            <button className="public-profile__share-btn">
              <FaShareAlt />
            </button>
          </div>
        </div>
        <div className="public-profile__nav">
          <span key="Quests" className="public-profile__nav-item active">
            Quests
          </span>
        </div>
      </div>
      <div className="public-profile__quests">
        {userData ? (
          <div className="quests">
            <QuestCard quests={filteredQuests} />
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

export default PublicProfile;
