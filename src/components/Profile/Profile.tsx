import StarRatingAuto from "../Rating/StarRatingAuto";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { useQuestContext } from "@/contexts/QuestContext";
import { Quest } from "@/types/quest";
import QuestCard from "../Home/QuestCard";
import "@/components/Home/QuestCard.scss";
import { FaEdit, FaShareAlt } from "react-icons/fa";
import { USERS_URL } from "@/constants/authConstants";
// import { BidirectionalPriorityQueue } from "@/utils/BidirectionalPriorityQueue";
import Loading from "../Loading/Loading";
interface UserData {
  id: string;
  name: string;
  email: string;
}

const Profile = () => {
  const [activeNavItem, setActiveNavItem] = useState<string | null>("Quests");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { allQuests } = useQuestContext();

  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest: Quest) => {
      if (activeNavItem === "Quests") {
        const userDataStr = sessionStorage.getItem("userData");
        if (!userDataStr) return false;

        try {
          const userData = JSON.parse(userDataStr);
          return quest.author === userData.name;
        } catch (error) {
          console.error("Error parsing userData from sessionStorage:", error);
          return false;
        }
      } else if (activeNavItem === "Saved") {
        const savedQuestsStr = localStorage.getItem("savedQuests");
        const savedQuests = savedQuestsStr ? JSON.parse(savedQuestsStr) : [];
        return savedQuests.includes(quest._id);
      } else {
        return false;
      }
    });
  }, [allQuests, activeNavItem]);

  const navigate = useNavigate();

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDataStr = sessionStorage.getItem("userData");
        if (userDataStr) {
          setUserData(JSON.parse(userDataStr));
        }
      } catch (e) {
        console.error("Error loading userData from sessionStorage:", e);
      }
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/log-in");
          return;
        }

        const response = await fetch(`${USERS_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          setUserData(data.data.user);
          sessionStorage.setItem("userData", JSON.stringify(data.data.user));
        } else {
          if (
            data.message === "Invalid ID format" ||
            data.message ===
              "Invalid user identification. Please log in again." ||
            data.message?.toLowerCase().includes("invalid")
          ) {
            console.error("Token contains invalid ID, logging out");
            localStorage.removeItem("accessToken");

            navigate("/log-in", {
              state: {
                message: "Your session is invalid. Please log in again.",
              },
            });
            return;
          }

          setError(data.message || "Помилка отримання даних користувача");
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            navigate("/log-in");
          }
        }
      } catch (err) {
        setError("Помилка конекту з сервером");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  //test
  // useEffect(() => {
  //   type QuestForTest = { title: string; score: number };
  //   const questQueue = new BidirectionalPriorityQueue<QuestForTest>();
  //   questQueue.enqueue({ title: "Quest A", score: 50 }, 0.5);
  //   questQueue.enqueue({ title: "Quest B", score: 80 }, 7 / 11);
  //   questQueue.enqueue({ title: "Quest C", score: 60 }, 6 / 9);
  //   questQueue.enqueue({ title: "Quest D", score: 50 }, 0.5);
  //   questQueue.enqueue({ title: "Quest E", score: 60 }, 3 / 8);
  //   questQueue.enqueue({ title: "Quest F", score: 30 }, 1 / 5);
  //   questQueue.enqueue({ title: "Quest G", score: 30 }, 1);

  //   console.group("BidirectionalPriorityQueue Tests");

  //   console.dir({ peekMax: questQueue.peek("max") }, { depth: 3 });
  //   console.dir({ peekMin: questQueue.peek("min") }, { depth: 3 });
  //   console.log("Initial size:", questQueue.getSize());

  //   console.dir({ dequeueMin: questQueue.dequeue("min") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });
  //   console.dir({ dequeueMax: questQueue.dequeue("max") }, { depth: 3 });

  //   console.log("Is empty after removals:", questQueue.isEmpty());

  //   console.groupEnd();
  // }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="profile__container">Error: {error}</div>;
  }

  return (
    <div className="profile__container">
      <div className="profile__top_container">
        <div className="profile__header">
          <div className="profile__avatar">
            <div className="image">
              <img src="./src/assets/img1.png" alt="Avatar" />
            </div>
          </div>
          <div className="profile__user-info">
            <h1>{userData?.name || "USERNAME"}</h1>
            <p>{userData?.email}</p>
            <div className="profile__rating">
              <StarRatingAuto rating={3.5} />
            </div>
          </div>
          <div className="profile__actions">
            <button className="profile__edit-btn">
              <FaEdit />
            </button>
            <button className="profile__share-btn">
              <FaShareAlt />
            </button>
          </div>
        </div>
        <div className="profile__nav">
          {["Saved", "Quests", "History"].map((item) => (
            <span
              key={item}
              className={`profile__nav-item ${
                activeNavItem === item ? "active" : ""
              }`}
              onClick={() => handleNavItemClick(item)}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="profile__quests">
        {userData ? (
          <div className="quests">
            <QuestCard quests={filteredQuests} />
          </div>
        ) : (
          <div className="loading-container">
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
