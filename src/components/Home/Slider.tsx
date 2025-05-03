import { useEffect, useState } from "react";
import { FaUser, FaClock } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import StarRatingAuto from "../Rating/StarRatingAuto";
import "./Slider.scss";

export const URL = "http://localhost:5000/quests";

export interface Quest {
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

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
};

const Slider = () => {
  const [bestQuests, setBestQuests] = useState([]);

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

export default Slider;
