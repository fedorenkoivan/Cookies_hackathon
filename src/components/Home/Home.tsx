import "../../styles/Home.scss";
import { FaPlus, FaSearch, FaTimes, FaUser, FaClock } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

interface Quest {
  author: string;
  id: number;
  title: string;
  description: string;
  category: string;
  time: number;
  image: string;
  rating: number;
  review: number;
}

const QUESTS: Quest[] = [
  {
    id: 1,
    author: "Alice",
    title: "Lost Treasure Hunt",
    description:
      "Find the hidden treasure in the ancient ruins before time runs out!",
    category: "Adventure",
    time: 300,
    image: "logo.jpg",
    rating: 3.8,
    review: 120,
  },
  {
    id: 2,
    author: "Bob",
    title: "Escape the Haunted Mansion",
    description:
      "Solve puzzles and escape the haunted mansion before the ghosts get you!",
    category: "Mystery",
    time: 600,
    image: "logo.jpg",
    rating: 4.5,
    review: 98,
  },
  {
    id: 3,
    author: "Charlie",
    title: "Cyber Hacker Challenge",
    description:
      "Crack the security codes and hack into the secret server before time runs out!",
    category: "Tech",
    time: 450,
    image: "logo.jpg",
    rating: 4.7,
    review: 85,
  },
  {
    id: 4,
    author: "Dana",
    title: "Survival in the Jungle",
    description:
      "Gather resources and survive the wild jungle for as long as you can!",
    category: "Survival",
    time: 900,
    image: "logo.jpg",
    rating: 4.6,
    review: 110,
  },
  {
    id: 5,
    author: "Eve",
    title: "Time Traveler's Dilemma",
    description:
      "Fix the broken time machine and prevent a paradox from destroying the timeline!",
    category: "Sci-Fi",
    time: 500,
    image: "logo.jpg",
    rating: 4.9,
    review: 150,
  },
];

const TABS = ["All", "Sports", "Gaming", "Education", "Other"];

const Slider = () => {
  return (
    <div className="quests__slider">
      <Swiper spaceBetween={20} slidesPerView={1} loop={true}>
        {QUESTS.map((quest) => (
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
                  <div className="clock">
                    <FaClock className="icon" />
                    <p>{quest.time}s</p>
                  </div>
                </div>
                <div className="middle">
                  <p className="title">{quest.title}</p>
                  <p className="category">{quest.category}</p>
                </div>
                <div className="rating">
                  <StarRatingAuto rating={quest.rating} />
                  <p className="reviews">({quest.review})</p>
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
          {QUESTS.map((quest) => (
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
                    <p className="reviews">({quest.review})</p>
                  </div>
                </div>
                <div className="quests__card-start">
                  <div className="clock">
                    <FaClock className="icon" />
                    <p>{quest.time}s</p>
                  </div>
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