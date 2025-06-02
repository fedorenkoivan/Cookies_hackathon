export type ReviewData = {
  userId: string;
  username: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: Date | string;
};

export type ReviewProps = Omit<ReviewData, "userId">;

export type StarRatingProps = {
  totalStars?: number;
  onRate?: (rating: number) => void;
  initialRating?: number;
};
