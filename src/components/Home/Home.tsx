import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeMenu from "./WelcomeMenu";
import Slider from "./Slider";
import "swiper/swiper-bundle.css";
import "./Home.scss";
import { userAuthorizationEvent } from "@/utils/userData";
import { CATEGORIES as TABS } from "@/constants/questConstants";
import { Quest } from "@/types/quest";
import { useAppContext } from "@/contexts/AppContext";
import QuestCard from "./QuestCard";
import Loading from "@/components/Loading/Loading";
import PaginatedContent from "../Partial/PaginatedContent";

const Home = () => {
  const [active, setActive] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const { allQuests, loading, error } = useAppContext();

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
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/sign-up", { state: { from: "/quest-form" } });
    } else {
      navigate("/quest-form");
    }
  };

  const navigate = useNavigate();

  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest: Quest) => {
      const categoryMatch = active === "All" || quest.category === active;
      const searchMatch =
        !searchText ||
        quest.title.toLowerCase().startsWith(searchText.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [allQuests, active, searchText]);

  useEffect(() => {
    const handleAuthStatus = () => {
      setIsAuthorized(!!sessionStorage.getItem("isAuthorized"));
    };
    handleAuthStatus();

    window.addEventListener(userAuthorizationEvent, handleAuthStatus);

    return () =>
      window.removeEventListener(userAuthorizationEvent, handleAuthStatus);
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="quest-section">
      {isAuthorized ? <></> : <WelcomeMenu />}

      <div className="quests__header">
        <img alt="stars" src="src/assets/stars.png"></img>
        <h1>BEST QUESTS OF THE DAY</h1>
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
          {TABS.map((tab: string) => (
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
        <div className="quests__content">
          <PaginatedContent
            items={filteredQuests}
            itemsPerPage={9}
            renderItems={(paginatedQuests) => (
              <QuestCard quests={paginatedQuests} />
            )}
            emptyMessage="No quests found. Try changing your search or filters."
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
