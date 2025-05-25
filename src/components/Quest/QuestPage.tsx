import { useParams, useNavigate } from "react-router-dom";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect } from "react";
import "./QuestPage.scss";
import Comments from "./Comments";
import { useQuestContext } from "@/contexts/QuestContext";
import logoImage from "@/assets/logo.jpg";
import avatarImage from "@/assets/img1.png";

const QuestPage = () => {
  const { id } = useParams();
  const { quest, loading, error, fetchQuest } = useQuestContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuest(id as string);
  }, [id, fetchQuest]);

  if (loading) {
    return <div className="quest">Loading quest data...</div>;
  }

  if (!quest) {
    return <div className="quest">Quest not found</div>;
  }

  if (error) {
    return <div className="quest">Error: {error}</div>;
  }

  return (
    <div className="quest">
      <section className="quest__info">
        <div className="description">
          <div className="general">
            <p className="category">{quest.category}</p>
            <h2 className="title">{quest.title}</h2>
            <div className="rating">
              <StarRatingAuto rating={quest.rating} />
              <div className="reviews"><p>({quest.reviews})</p></div>
            </div>
            <h3 className="description-title">Description</h3>
            <p className="desc">{quest.description}</p>
            <p className="number">
              Number of questions: {quest.questions.length}
            </p>
            <p className="score">Maximum score: 12 points</p>
            <p className="time">Time limit: {quest.time === -1 ? "no limit" : quest.time + "s"}</p>
          </div>
          <div className="author">
            <p>Created by</p>
            <div className="author-image">
              <img src={avatarImage}/>
              <p>{quest.author}</p>
            </div>
          </div>
        </div>
        <div className="image">
          <img src={quest?.image || logoImage} />
        </div>
      </section>
      <section className="quest__start">
        <button
          onClick={() => {
            if (quest.questions && quest.questions.length > 0) {
              navigate(
                `/complete-quest/${quest._id}/${quest.questions[0]._id}`
              );
            } else {
              alert("This quest has no questions.");
            }
          }}
        >
          Start
        </button>

        <hr />
      </section>
      <section className="quest__comments">
        <p>Number of completions: 1234</p>
        <p>Comments: 123</p>
        <div>
          <Comments />
        </div>
      </section>
    </div>
  );
};

export default QuestPage;
