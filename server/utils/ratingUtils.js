import { User } from "../models/userModel.js";

export const generateFakeQuestResults = () => {
  return {
    score: Math.floor(Math.random() * 100),
    totalTime: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    avgTimePerQuestion: `0:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  };
}

export const findUserRatingIndex = (userRatings, userId) => {
  if (!userRatings || !Array.isArray(userRatings)) {
    return -1;
  }

  return userRatings.findIndex(entry => 
    entry && entry.userId && entry.userId.toString() === userId.toString()
  );
};

export const validateRatingInput = (questId, userId, rating) => {
  if (!userId) throw new Error("User ID is required");
  if (!questId) throw new Error("Quest ID is required");
  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  return numericRating;
};

export const recalculateAverageRating = (quest, oldRating, newRating, isUpdate) => {
  if (isUpdate) {
    if (quest.reviews > 0) {
      const totalRatingPoints = quest.rating * quest.reviews;
      quest.rating = (totalRatingPoints - oldRating + newRating) / quest.reviews;
    }
  } else {
    quest.reviews = (quest.reviews || 0) + 1;
    if (quest.reviews === 1) {
      quest.rating = newRating;
    } else {
      const totalBefore = (quest.rating || 0) * (quest.reviews - 1);
      quest.rating = (totalBefore + newRating) / quest.reviews;
    }
  }
};

export const getFormattedReviews = async (quest) => {
  if (!quest.userRatings || !Array.isArray(quest.userRatings)) {
    return [];
  }

  const reviews = await Promise.all(
    quest.userRatings
      .filter(
        (review) => review && review.comment && review.comment.trim() !== "",
      )
      .map(async (review) => {
        let username = "Anonymous User";

        if (review.userId) {
          const user = await User.findById(review.userId);
          if (user) {
            username = user.name || user.email || "User";
            console.log(username);
          }
        }

        return {
          userId: review.userId,
          username,
          avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // заглушка, потім доробити динамічно
          rating: review.rating,
          comment: review.comment,
          date: review.date || new Date(),
        };
      }),
  );

  // return reviews.sort(
  //   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  // );
  return reviews;
};
