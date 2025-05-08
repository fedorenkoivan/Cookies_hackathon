import { useParams } from "react-router-dom";
import StarRatingAuto from "../Rating/StarRatingAuto";
import { useEffect, useState } from "react";
import { URL, Quest } from "@/components/Home/Slider";
import "./QuestPage.scss";

const QuestPage = () => {
  const { id } = useParams();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || !quest) {
    return <div className="quest">Loading quest data...</div>;
  }

  return (
    <div className="quest">
      <section className="quest__info">
        <div className="description">
          <p>{quest.title}</p>
          <h2>{quest.title}</h2>
          <div className="rating">
            <StarRatingAuto rating={quest.rating} />
            <p className="reviews">({quest.reviews})</p>
          </div>
        </div>
        <div className="image"></div>
      </section>
      <section className="quest__comments"></section>
    </div>
  );
};

export default QuestPage;
