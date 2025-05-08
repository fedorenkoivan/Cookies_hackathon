import { useParams, useNavigate } from "react-router-dom";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import { Quest } from "@/types/quest";
import { QUESTS_URL as URL } from "@/constants/questConstants";
import "./QuestPage.scss";

const QuestPage = () => {
  const { id } = useParams();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${URL}?_id=${id}`);
        const data = await res.json();
        setQuests(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const quest = quests[0];
  console.log(quest);

  if (loading || !quest) {
    return <div className="quest">Loading quest data...</div>;
  }

  return (
    <div className="quest">
      <section className="quest__info">
        <div className="description">
          <p>{quest.category}</p>
          <h2>{quest.title}</h2>
          <div className="rating">
            <StarRatingAuto rating={quest.rating} />
            <p className="reviews">({quest.reviews})</p>
          </div>
          <h3>Description</h3>
          <p>{quest.description}</p>
          <p>Number of questions: {quest.questions.length}</p>
          <p>Time limit: {quest.time}s</p>
        </div>
        <div className="image">
          <img src={quest.image} />
        </div>
      </section>
      <section>
        <button
          onClick={() =>
            navigate(`/complete-quest/${quest._id}/${quest.questions[0]._id}`)
          }
        >
          Start
        </button>

        <hr />
      </section>
      <section className="quest__comments"></section>
    </div>
  );
};

export default QuestPage;
