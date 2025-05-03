import { FaPlus, FaSearch, FaTimes, FaUser, FaClock } from "react-icons/fa";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeMenu from "./WelcomeMenu";
import Slider, { Quest, URL } from "./Slider";
import "swiper/swiper-bundle.css";
import "./Home.scss";
import { userAuthorizationEvent } from "@/utils/userData";

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

  const handleCreateClick = () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      navigate("/sign-up", { state: { from: "/quest-form" } });
    } else {
      navigate('/quest-form')
    }
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

  useEffect(() => {
    const handleAuthStatus = () => {
      setIsAuthorized(!!sessionStorage.getItem("isAuthorized"));
      console.log(
        "isAuthorized useState",
        !!sessionStorage.getItem("isAuthorized")
      );
    };

    handleAuthStatus();

    window.addEventListener(userAuthorizationEvent, handleAuthStatus);

    return () =>
      window.removeEventListener(userAuthorizationEvent, handleAuthStatus);
  }, []);

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
          <button className="quests__cards-button" onClick={handleCreateClick}>
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
