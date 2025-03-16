import StarRatingManual from "./StarRatingManual";
import './RatingForm.scss';

const RatingForm = () => {
  return (
    <>
      <section className="rating-form__header">
        <div className="rating-form__content">
          <h1 className="rating-form__title">Rate this quest! <br /> Leave a review!</h1>
        </div>
      </section>

      <div className="rating-form__container">
        <div className="rating-form__result-info">
          <h1 className="rating-form__title">Congratulations! Your result:</h1>
          <h3 className="rating-form__top-text">Score:</h3>
          <h3 className="rating-form__top-text">Total time:</h3>
          <h3 className="rating-form__top-text">Time per question:</h3>
        </div>

        <form className="rating-form">
          <div className="rating-form__group">
            <div className="rating-form__rate">
              <h3>Rate this quest:</h3>
              <StarRatingManual
                onRate={(rating) => {
                  console.log("Rating:", rating);
                }}
              />
            </div>
          </div>
          <div className="rating-form__group">
            <h3>Leave a comment:</h3>
            <textarea
              maxLength={600}
              placeholder="What do you think about this quest?"
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