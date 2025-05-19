import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaClock, FaBookmark } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { QUESTS_URL as URL } from "@/constants/questConstants";
import { Quest } from "@/types/quest";
import "./Slider.scss";

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
};

const Slider = () => {
  const [bestQuests, setBestQuests] = useState<Quest[]>([]);
  const [savedQuests, setSavedQuests] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("savedQuests") || "[]");
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
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

  useEffect(() => {
    const handleSavedQuestsChanged = () => {
      setSavedQuests(JSON.parse(localStorage.getItem("savedQuests") || "[]"));
    };
    window.addEventListener("savedQuestsChanged", handleSavedQuestsChanged);
    return () => {
      window.removeEventListener(
        "savedQuestsChanged",
        handleSavedQuestsChanged
      );
    };
  }, []);

  const handleBookmarkClick = (questId: string) => {
    let updated;
    if (!savedQuests.includes(questId)) {
      updated = [...savedQuests, questId];
    } else {
      updated = savedQuests.filter((id) => id !== questId);
    }
    setSavedQuests(updated);
    localStorage.setItem("savedQuests", JSON.stringify(updated));
    window.dispatchEvent(new Event("savedQuestsChanged"));
  };

  return (
    <div className="quests__slider">
      <Swiper spaceBetween={20} slidesPerView={1} loop={true}>
        {bestQuests.map((quest: Quest) => (
          <SwiperSlide key={quest._id} className="quests__slider-slide">
            <div className="quests__slider-wrapper">
              <div className="image-container">
                <img
                  src={quest.image || "src/assets/logo.jpg"}
                  className="image"
                />
                <div className="bookmark">
                  <FaBookmark
                    className={`icon${
                      savedQuests.includes(quest._id) ? "-active" : ""
                    }`}
                    onClick={() => handleBookmarkClick(quest._id)}
                  />
                </div>
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
                  <button
                    className="button"
                    onClick={() => navigate(`/preview-quest/${quest._id}`)}
                  >
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

export default Slider;
