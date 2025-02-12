import "../styles/RatingForm.scss";
import "../styles/HeroSection.scss";
import StarRatingManual from "./StarRatingManual";
import { useNavigate } from "react-router-dom";

const RatingForm = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/");
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

                <form className="rating-form">
                    <div className="rating-form__group">
                        <div className="rating-form__rate">
                            <h3>Rate this quest:</h3>
                            <StarRatingManual />
                        </div>
                    </div>
                    <div className="rating-form__group">
                        <h3>Leave a comment:</h3>
                        <textarea placeholder="What do you think about this quest?" />
                    </div>
                </form>
            </div>
            <div className="parent-container">
                <button className="home-button" type="button" onClick={handleHomeClick}>
                    Home
                </button>
            </div>
        </>
    );
};

export default RatingForm;
