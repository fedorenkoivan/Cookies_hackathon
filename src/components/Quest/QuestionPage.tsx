import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuestContext } from "@/contexts/QuestContext";
import { Question } from "@/types/quest";
import "./QuestionPage.scss";
import logoImage from "@/assets/logo.jpg";
import Loading from "../Loading/Loading";
import ProgressBar from "../Partial/ProgressBar";

const QuestionPage = () => {

  const { questId } = useParams<{ questId: string }>();
  const { questPreview: quest, loading, error, fetchQuest } = useQuestContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(
    quest?.questions[0] || null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [time, setTime] = useState<number | null>(quest?.time || null);

  useEffect(() => {
    if (questId) {
      fetchQuest(questId);
    }
  }, [questId, fetchQuest]);

  const navigate = useNavigate();

  useEffect(() => {
    if (time === null || time < 0) {
      setTime(null);
      return;
    }

    if (time === 0) {
      console.log("You have no time left!");
      navigate("/rating-form");
      return;
    }

    const timerId = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [time]);

  const handleNextQuestion = () => {
    if (!quest || !quest.questions) {
      console.error("Quest or questions not available");
      return;
    }

    setSelectedAnswers([]);

    if (currentQuestionIndex < quest.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestion(quest.questions[nextIndex]);
    } else {
      navigate("/rating-form");
    }
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedAnswers((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <p>Error: {error}</p>
      ) : !quest ? (
        <p>No quest found</p>
      ) : (
        <>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={quest.questions.length}
            time={time}
          />
          <div className="question">
            <div className="question__info">
              <h1>{question?.value}</h1>
              <p>
                {question?.points} {question?.points === 1 ? "point" : "points"}
              </p>
              <div className="question__image">
                <img src={question?.image || logoImage} alt="Question image" />
              </div>
              <div className="question__answers">
                {question?.answers.map((answer) => (
                  <label className="answer" key={answer.order}>
                    <input
                      type="checkbox"
                      name="answer"
                      value={answer.order}
                      checked={selectedAnswers.includes(
                        answer.order.toString()
                      )}
                      onChange={() =>
                        handleCheckboxChange(answer.order.toString())
                      }
                    />
                    <span className="custom-checkbox"></span>
                    {answer.value}
                  </label>
                ))}
              </div>
            </div>
            <div className="question__submit">
              <button
                onClick={handleNextQuestion}
                disabled={loading || !quest.questions}
              >
                {currentQuestionIndex === quest.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionPage;
