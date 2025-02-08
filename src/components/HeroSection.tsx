import { FaSearch } from "react-icons/fa";
import "./HeroSection.scss";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">
          PITCH YOUR STARTUP, <br /> CONNECT WITH ENTREPRENEURS
        </h1>
        <p className="hero__subtitle">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>

        <div className="hero__search">
          <input
            type="text"
            placeholder="Search Startups"
            className="hero__search-input"
          />
          <button className="hero__search-button">
            <FaSearch />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection