import { FaSearch } from "react-icons/fa";
import "../styles/HeroSection.scss";

const HeroSection = () => {
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            CREATE & EXPLORE VIRTUAL QUESTS, <br /> and Interactive Challenges
          </h1>
          <p className="hero__subtitle">
            Submit Quests, Solve Puzzles, and Compete in Virtual Experiences.
          </p>

          <div className="hero__search">
            <input
              type="text"
              placeholder="Search Quests"
              className="hero__search-input"
            />
            <button className="hero__search-button">
              <FaSearch />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
