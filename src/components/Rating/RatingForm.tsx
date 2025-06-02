import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StarRatingManual from "./StarRatingManual";
import "./RatingForm.scss";
import { CompletedQuestInfo } from "@/types/quest";
import { QUESTS_URL } from "@/constants/questConstants";

const RatingForm = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [questInfo, setQuestInfo] = useState<CompletedQuestInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { questId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (questId) {
      const fetchQuestInfo = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");

          if (!accessToken) {
            toast.error("You are not logged in");
            navigate("/log-in");
            return;
          }

          const response = await fetch(`${QUESTS_URL}/${questId}/rating`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to get quest information");
          }

          const data = await response.json();
          setQuestInfo(data);

          if (data.userRating) {
            setRating(data.userRating);
            setComment(data.userComment || "");
          }
        } catch (error) {
          console.error("Error while receiving data:", error);
        }
      };

      fetchQuestInfo();
    }
  }, [questId, navigate]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questId) {
      console.error("Quest ID is missing");
      return;
    }

    if (rating === 0) {
      navigate(`/preview-quest/${questId}`);
      return;
    }

    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("You must be logged in to rate quests");
        navigate("/log-in");
        return;
      }

      const response = await fetch(`${QUESTS_URL}/${questId}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save rating");
      }

      toast.success("Thank you for your rating!");
      navigate(`/preview-quest/${questId}`);
    } catch (error: unknown) {
      console.error("Error sending rating:", error);
      toast.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="rating-form__header">
        <div className="rating-form__content">
          <h1 className="rating-form__title">
            Rate this quest! <br /> Leave a review!
          </h1>
        </div>
      </section>

      <div className="rating-form__container">
        <div className="rating-form__result-info">
          <h1 className="rating-form__title">
            {questInfo
              ? `Congratulations! You have completed "${questInfo.questTitle}"`
              : "Congratulations! Your result:"}{" "}
          </h1>
          <h3 className="rating-form__top-text">
            Score: {questInfo?.score || 0}
          </h3>
          <h3 className="rating-form__top-text">
            Total time: {questInfo?.totalTime || "0:00"}
          </h3>
          <h3 className="rating-form__top-text">
            Time per question: {questInfo?.avgTimePerQuestion || "0:00"}
          </h3>
        </div>

        <form className="rating-form" onSubmit={handleRatingSubmit}>
          <div className="rating-form__group">
            <div className="rating-form__rate">
              <h3>Rate this quest:</h3>
              <StarRatingManual
                onRate={(ratingValue) => {
                  setRating(ratingValue);
                }}
                initialRating={rating}
              />
            </div>
          </div>
          <div className="rating-form__group">
            <h3>Leave a comment:</h3>
            <textarea
              maxLength={600}
              placeholder="What do you think about this quest?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="parent-container">
            <button
              className="submit-button"
              type={rating === 0 ? "button" : "submit"}
              disabled={loading}
              onClick={
                rating === 0
                  ? () => navigate(`/preview-quest/${questId}`)
                  : undefined
              }
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RatingForm;
