import { FaPlus, FaSearch, FaTimes, FaUser, FaClock } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import WelcomeMenu from "./WelcomeMenu";
import "swiper/swiper-bundle.css";
import "./Home.scss";
import { userAuthorizationEvent } from "@/utils/userData";

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

const TABS: string[] = [
  "All",
  "Adventure",
  "Puzzle",
  "Educational",
  "Gaming",
  "Team challenges",
  "Mystery",
  "Other",
];

const URL = "http://localhost:5000/quests";

const Slider = () => {
  const [bestQuests, setBestQuests] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const getToday = () => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return today.toISOString();
        };
        const res = await fetch(
          `${URL}?limit=5&sort=rating:desc&createdAt.gte=${getToday()}`
        );
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
                  <button className="button">
                    <p>Start quest</p>
                  </button>
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
  const [inputValue, setInputValue] = useState("");
  const [quests, setQuests] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleTabClick = (tab: string) => {
    setActive(tab);
    setSearchText("");
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      setSearchText(inputValue);
      setInputValue("");
    }
  };

  const handleClearClick = () => {
    setSearchText("");
    setInputValue("");
  };

  const navigate = useNavigate();

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  useEffect(() => {
    (async () => {
      try {
        let filterQuery = `?category=${active}`;
        if (active === "All") filterQuery = "?";
        let searchQuery = "";
        const search = searchText.toLowerCase().trim();
        if (search !== "") {
          const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          searchQuery += `&title.re=^${safeSearch}`;
        }
        const res = await fetch(URL + `${filterQuery}${searchQuery}`);
        const data = await res.json();
        setQuests(data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [active, searchText]);

  //temporary
  useEffect(() => {
    const handleAuthStatus = () => {
      setIsAuthorized(!!sessionStorage.getItem("isAuthorized"));
      console.log("isAuthorized useState", !!sessionStorage.getItem("isAuthorized"));
    }

    handleAuthStatus();

    window.addEventListener(userAuthorizationEvent, handleAuthStatus);

    return () => window.removeEventListener(userAuthorizationEvent, handleAuthStatus);
  }, []);
  //

  return (
    <section className="quest-section">
      {isAuthorized ? <></> : <WelcomeMenu />}
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
            onClick={() => navigate("/quest-form")}
          >
            <div className="quests__cards-container">
              <FaPlus className="quests__cards-icon" />
              <span className="quests__cards-title">Create quest</span>
            </div>
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
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
                    <div className="icon">
                      <FaUser className="" />
                    </div>
                    <p>{quest.author}</p>
                  </div>
                  <div className="rating">
                    <StarRatingAuto rating={quest.rating} />
                    <p className="reviews">({quest.reviews})</p>
                  </div>
                </div>
                <div className="quests__card-start">
                  {quest.time === -1 ? (
                    <div>
                      <p>No time limit</p>
                    </div>
                  ) : (
                    <div className="clock">
                      <div className="icon">
                        <FaClock className="" />
                      </div>
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
