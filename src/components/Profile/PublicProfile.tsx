import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useAppContext } from "@/contexts/AppContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import "@/components/Home/QuestCard.scss";
import { FaShareAlt } from "react-icons/fa";
import { useProfileContext } from "@/contexts/ProfileContext";
import Loading from "../Loading/Loading";
import defaultAvatar from "../../assets/img1.png";
import "./PublicProfile.scss";
import PaginatedContent from "../Partial/PaginatedContent";

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  const { userPublicData, loading, error, fetchUserPublicProfile } =
    useProfileContext();
  const { allQuests } = useAppContext();
useEffect(() => {
  if (userPublicData) {
    console.log("PublicProfile user data:", userPublicData);
  }
}, [userPublicData]);
  useEffect(() => {
    if (userId) {
      fetchUserPublicProfile(userId);
    }
  }, [userId, fetchUserPublicProfile]);

  const filteredQuests = useMemo(() => {
    if (!userPublicData || !allQuests) return [];

    return allQuests.filter(
      (quest: Quest) => quest.author.authorId === userPublicData.id
    );
  }, [allQuests, userPublicData]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="public-profile__container">Error: {error}</div>;
  }

  if (!userPublicData) {
    return <div className="public-profile__container">User not found</div>;
  }

  return (
    <div className="public-profile__container">
      <div className="public-profile__top_container">
        <div className="public-profile__header">
          <div className="public-profile__avatar">
            <div className="image">
              <img 
              src={userPublicData.profileImage || defaultAvatar} 
              alt="Avatar" 
              />
            </div>
          </div>
          <div className="public-profile__user-info">
            <h1>{userPublicData.name || "USERNAME"}</h1>
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
          <span className="public-profile__nav-item active">Quests</span>
        </div>
      </div>
      <div className="public-profile__quests">
        {filteredQuests.length > 0 ? (
          <div className="quests">
            <PaginatedContent
              items={filteredQuests}
              itemsPerPage={6}
              renderItems={(paginatedQuests) => (
                <QuestCard quests={paginatedQuests} />
              )}
              emptyMessage="This user hasn't created any quests yet."
            />
          </div>
        ) : (
          <div className="no-quests">
            <p>This user hasn't created any quests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
