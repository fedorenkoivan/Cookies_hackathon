import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
}

const StarRatingAuto = ({ rating }: StarRatingProps) => {
  const INDEXES = [0, 1, 2, 3, 4];

  return (
    <div className="quests__rating">
      {INDEXES.map((index) => {
        const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

        return (
          <div key={index} className="quests__rating star-wrapper">
            <FaStar className="quests__rating star-bg" />
            <FaStar
              className="quests__rating star-fill"
              style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRatingAuto;