import React, { useState } from "react";
import "../styles/RatingForm.scss";
import "../styles/HeroSection.scss";
import StarRatingManual from "./StarRatingManual";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RatingForm = () => {
  const navigate = useNavigate();
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Comment:", comment);
    console.log("Rating:", rating);

    try {
      const response = await axios.post("http://localhost:5000/reviews", {
        comment,
        rating,
      });

      if (response.status === 201) {
        console.log("Form submitted successfully");
        setComment("");
        setRating(null);
        navigate("/");
      } else {
        console.error("Failed to submit form");
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form!");
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Rate this quest! <br /> Leave a review!
          </h1>
        </div>
      </section>
      <div className="rating-form__container">
        <div className="rating-form__result-info">
          <h1 className="rating-form__title">Congratulations! Your result:</h1>
          <h3 className="rating-form__top-text">Score:</h3>
          <h3 className="rating-form__top-text">Total time:</h3>
          <h3 className="rating-form__top-text">Time per question:</h3>
        </div>

        <form className="rating-form" onSubmit={handleSubmit}>
          <div className="rating-form__group">
            <div className="rating-form__rate">
              <h3>Rate this quest:</h3>
              <StarRatingManual
                onRate={(rating) => {
                  console.log("Rating:", rating);
                  setRating(rating);
                }}
              />
            </div>
          </div>
          <div className="rating-form__group">
            <h3>Leave a comment:</h3>
            <textarea
              placeholder="What do you think about this quest?"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
          <div className="parent-container">
            <button className="submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RatingForm;
