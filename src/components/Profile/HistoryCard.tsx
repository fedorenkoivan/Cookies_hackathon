import React from "react";
import "./HistoryCard.scss";
import { Quest } from "@/types/quest";
import { useNavigate } from "react-router-dom";
import { truncateText } from "@/utils/text.ts";

type HistoryCardProps = {
  questDetails: Quest | undefined;
  questId: string;
  currentQuestionIndex: number;
  score: number;
  timeRemaining: number;
  isFinished: boolean;
};

const HistoryCard: React.FC<HistoryCardProps> = ({
  questDetails,
  questId,
  currentQuestionIndex,
  score,
  timeRemaining,
  isFinished,
}) => {
  const navigate = useNavigate();

  const calculatePercentage = (): number => {
    if (questDetails === undefined) return 0;
    if (questDetails.questions.length === 0) return 0;
    return Math.round(
      (currentQuestionIndex / questDetails.questions.length) * 100
    );
  };

  if (!questDetails) {
    return (
      <div className="history-card-container">No quest details available.</div>
    );
  }

  return (
    <div
      className="history-card-container"
      onClick={() => navigate(`/preview-quest/${questId}`)}
    >
      <div className="history-card">
        <div className="text-container">
          <div className="quest-details">
            <h2 className="history-card__title">{truncateText(questDetails.title, 17)}</h2>
            <div className="quest-info">
              <button
                className="author"
                onClick={() =>
                  navigate(`/public-profile/${questDetails.author.authorId}`)
                }
              >
                <p>Created by {questDetails.author.username}</p>
              </button>
              <p>{questDetails.category}</p>
            </div>
          </div>
          <div className="quest-progress">
            <h3>
              {isFinished
                ? `Score: ${score}`
                : `${calculatePercentage()}% Complete`}
            </h3>
            {timeRemaining !== -1 && !isFinished ? (
              <p>Time left: {timeRemaining} seconds</p>
            ) : isFinished && timeRemaining !== -1 ? (
              <p>Total time: {questDetails.time - timeRemaining} seconds</p>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="image-container">
          <img
            src={questDetails.image || "./src/assets/logo.jpg"}
            alt={questDetails.title}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
