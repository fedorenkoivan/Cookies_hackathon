import React from "react";
import { FaStar, FaUser } from "react-icons/fa";
import "./Review.scss";
import { ReviewProps } from "@/types/review";

const Review: React.FC<ReviewProps> = ({
  username,
  rating,
  comment,
  date,
  reviewAuthorImage,
}) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user-info">
          <div className="review-avatar-container">
            {reviewAuthorImage ? (
              <img
                src={reviewAuthorImage}
                alt={username}
                className="review-avatar"
              />
            ) : (
              <FaUser className="review-avatar-icon" />
            )}
          </div>
          <div className="review-user-details">
            <h4 className="review-username">{username || "Anonymous User"}</h4>
            <span className="review-date">{formatDate(date)}</span>
          </div>
        </div>
        <div className="review-rating">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`star ${index < rating ? "filled" : ""}`}
              size={18}
            />
          ))}
        </div>
      </div>

      {comment && (
        <div className="review-content">
          <p className="review-comment">{comment}</p>
        </div>
      )}
    </div>
  );
};

export default Review;
