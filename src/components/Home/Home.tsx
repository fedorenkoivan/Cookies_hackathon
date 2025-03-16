import { FaPlus, FaSearch, FaTimes, FaUser, FaClock } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import './Home.scss';

interface Quest {
  author: string;
  id: number;
  title: string;
  description: string;
  category: string;
  time: number;
  image: string;
  rating: number;
  reviews: number;
}

const TABS = ["All", "Sports", "Gaming", "Education", "Other"];

const URL = "http://localhost:5000/quests";

const Slider = () => {
  const [bestQuests, setBestQuests] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${URL}/top-5`);
        const data = await res.json();
        setBestQuests(data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="quests__slider">
      <Swiper spaceBetween={20} slidesPerView={1} loop={true}>
        {bestQuests.map((quest: Quest) => (
          <SwiperSlide key={quest.id} className="quests__slider-slide">
            <div className="quests__slider-wrapper">
              <div className="image-container">
                <img src="src/assets/logo.jpg" className="image" />
              </div>
              <div className="info-container">
                <div className="top">
                  <div className="author">
                    <FaUser className="icon" />
                    <p>{quest.author}</p>
                  </div>
                  {quest.time === -1 ? (
                    <div>no time limit</div>
                  ) : (
                    <div className="clock">
                      <FaClock className="icon" />
                      <p>{quest.time}s</p>
                    </div>
                  )}
                </div>
                <div className="middle">
                  <p className="title">{quest.title}</p>
                  <p className="category">{quest.category}</p>
                </div>
                <div className="rating">
                  <StarRatingAuto rating={quest.rating} />
                  <p className="reviews">({quest.reviews})</p>
                </div>
                <div className="start">
                  <button className="button">Start quest</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const Home = () => {
  const [active, setActive] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [quests, setQuests] = useState([]);

  const handleTabClick = (tab: string) => {
    setActive(tab);
  };

  const handleSearchClick = () => {
    console.log(searchText);
  };

  const handleClearClick = () => {
    setSearchText("");
  };

  const navigate = useNavigate();

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(URL);
        const data = await res.json();
        setQuests(data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <section className="quest-section">
      <div className="quests__header">
        <img alt="stars" src="src/assets/stars.png"></img>
        <h2>BEST QUESTS OF THE DAY</h2>
      </div>

      <Slider />

      <div className="quests__cards">
        <div className="quests__cards-header">
          <p className="quests__cards-title">All quests:</p>
          <button
            className="quests__cards-button"
            onClick={() => navigate("/quest-form/1")}
          >
            <FaPlus className="quests__cards-icon" />
            <span className="quests__cards-title">Create quest</span>
          </button>
        </div>
        <hr className="quests__divider" />

        <div className="quests__cards-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`button${active === tab ? "-active" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="quests__cards-search">
          <button className="quests__cards-button" onClick={handleSearchClick}>
            <FaSearch />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="quests__cards-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button className="quests__cards-button" onClick={handleClearClick}>
              <FaTimes />
            </button>
          )}
        </div>

        <hr className="quests__divider" />
        <div className="quests__card">
          {quests.map((quest: Quest) => (
            <div className="quests__card-container" key={quest.id}>
              <div className="quests__card-image">
                <img src="src/assets/logo.jpg" />
              </div>
              <div className="quests__card-info">
                <div className="quests__card-title">
                  <p className="title">{truncateText(quest.title, 15)}</p>
                  <p className="category">{quest.category}</p>
                </div>
                <div className="quests__card-author">
                  <div className="author">
                    <FaUser className="icon" />
                    <p>{quest.author}</p>
                  </div>
                  <div className="rating">
                    <StarRatingAuto rating={quest.rating} />
                    <p className="reviews">({quest.reviews})</p>
                  </div>
                </div>
                <div className="quests__card-start">
                  {quest.time === -1 ? (
                    <div>no time limit</div>
                  ) : (
                    <div className="clock">
                      <FaClock className="icon" />
                      <p>{quest.time}s</p>
                    </div>
                  )}
                  <button className="button">Start quest</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
