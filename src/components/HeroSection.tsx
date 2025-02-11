import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/HeroSection.scss";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            CREATE & EXPLORE VIRTUAL QUESTS, <br /> and Interactive Challenges
          </h1>
          <h2 className="hero__subtitle">
            Submit Quests, Solve Puzzles, and Compete in Virtual Experiences.
          </h2>

          <div className="hero__create">
            <button
              className="hero__create-button"
              onClick={() => navigate("/quest-form/1")}
            >
              <FaPlus />
              <b>Create your own quest</b>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
