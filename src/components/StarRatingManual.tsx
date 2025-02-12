import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
    totalStars?: number;
    onRate?: (rating: number) => void;
}

const StarRatingManual = ({ totalStars = 5, onRate }: StarRatingProps) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const [selected, setSelected] = useState<number>(0);

    const handleMouseEnter = (index: number) => setHovered(index);
    const handleMouseLeave = () => setHovered(null);
    const handleClick = (index: number) => {
        setSelected(index);
        if (onRate) onRate(index);
    };

    return (
        <div className="star-rating">
            {[...Array(totalStars)].map((_, index) => {
                const starIndex = index + 1;
                return (
                    <FaStar
                        key={starIndex}
                        className="star"
                        size={30}
                        color={starIndex <= (hovered ?? selected) ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starIndex)}
                    />
                );
            })}
        </div>
    );
};

export default StarRatingManual;
