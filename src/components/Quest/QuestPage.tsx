import { useParams, useNavigate } from "react-router-dom";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import "./QuestPage.scss";
import Review from "./Review";
import { useQuestContext } from "@/contexts/QuestContext";
import logoImage from "@/assets/logo.jpg";
import avatarImage from "@/assets/img1.png";
import Loading from "../Loading/Loading";
import { QUESTS_URL } from "@/constants/questConstants";
import { ReviewData } from "@/types/review";
import PaginatedContent from "../Partial/PaginatedContent";

const QuestPage = () => {
  const { questId } = useParams();
  const { questPreview: quest, loading, error, fetchQuest } = useQuestContext();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuest(questId as string);
  }, [questId, fetchQuest]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!questId) return;

      try {
        setLoadingReviews(true);
        const response = await fetch(`${QUESTS_URL}/${questId}/reviews`);

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data);
        setReviewsError(null);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [questId]);

  if (loading) {
    return <Loading />;
  }

  if (!quest) {
    return <div className="quest">Quest not found</div>;
  }

  if (error) {
    return <div className="quest">Error: {error}</div>;
  }

  return (
    <div className="quest">
      <section className="quest__info">
        <div className="description">
          <div className="general">
            <p className="category">{quest.category}</p>
            <h2 className="title">{quest.title}</h2>
            <div className="rating">
              <StarRatingAuto rating={quest.rating} />
              <div className="reviews">
                <p>({quest.reviews})</p>
              </div>
            </div>
            <h3 className="description-title">Description</h3>
            <p className="desc">{quest.description}</p>
            <p className="number">
              Number of questions: {quest.questions.length}
            </p>
            <p className="score">Maximum score: 12 points</p>
            <p className="time">
              Time limit: {quest.time === -1 ? "no limit" : quest.time + "s"}
            </p>
          </div>
          <div className="author">
            <p>Created by</p>
            <div className="author-image">
              <img src={avatarImage} />
              <p>{quest.author.username}</p>
            </div>
          </div>
        </div>
        <div className="image">
          <img src={quest?.image || logoImage} />
        </div>
      </section>
      <section className="quest__start">
        <button
          onClick={() => {
            if (quest.questions && quest.questions.length > 0) {
              navigate(`/complete-quest/${quest._id}`);
            } else {
              alert("This quest has no questions.");
            }
          }}
        >
          Start
        </button>

        <hr />
      </section>
      <section className="quest__comments">
        <div className="comments-header">
          <h2>Reviews</h2>
          <div className="comments-stats">
            <p>Number of completions: 0</p>
            <p>Comments: {reviews.length}</p>
          </div>
        </div>

        {loadingReviews ? (
          <div className="comments-loading">
            <Loading />
          </div>
        ) : reviewsError ? (
          <div className="comments-error">
            <p>{reviewsError}</p>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="comments-list">
              <PaginatedContent
                items={reviews}
                itemsPerPage={5}
                renderItems={(paginatedReviews) => (
                  <>
                    {paginatedReviews.map((review, index) => (
                      <Review
                        key={index}
                        username={review.username}
                        avatar={review.avatar}
                        rating={review.rating}
                        comment={review.comment}
                        date={review.date}
                      />
                    ))}
                  </>
                )}
                emptyMessage="No reviews yet. Be the first to complete this quest and leave a review!"
              />
            </div>
          </>
        ) : (
          <div className="no-comments">
            <p>No reviews yet</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default QuestPage;
