import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuestContext } from "@/contexts/QuestContext";
import { Question } from "@/types/quest";
import "./QuestionPage.scss";
import logoImage from "@/assets/logo.jpg";

const QuestionPage = () => {
  const { id, question_id } = useParams<{ id: string; question_id: string }>();
  const { quest, loading, error, fetchQuest } = useQuestContext();
  const [question, setQuestion] = useState<Question | null>(
    quest?.questions[0] || null
  );

  useEffect(() => {
    if (id) {
      fetchQuest(id);
    }
  }, [id, fetchQuest]);

  const navigate = useNavigate();

  const handleNextQuestion = () => {
    if (!quest || !quest.questions) {
      console.error("Quest or questions not available");
      return;
    }

    const currentQuestionIndex = quest.questions.findIndex(
      (question) => question._id === question_id
    );

    if (currentQuestionIndex === -1) {
      console.error("Current question not found in quest");
      return;
    }

    console.log(currentQuestionIndex);
    if (currentQuestionIndex < quest.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setQuestion(quest.questions[nextIndex]);
      navigate(`/complete-quest/${id}/${quest.questions[nextIndex]._id}`);
    } else {
      navigate(`/preview-quest/${id}`);
      console.log("This is the last question");
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading question...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : !quest ? (
        <p>No quest found</p>
      ) : (
        <>
          <div className="question">
            <div className="question__info">
              <h1>{question?.value}</h1>
              <p>
                {question?.points} {question?.points === 1 ? "point" : "points"}
              </p>
              <div className="question__image">
                <img
                  src={question?.image || logoImage}
                  alt="Question image"
                />
              </div>
              <div className="question__answers">
                {question?.answers.map((answer) => (
                  <label className="answer">
                    <input type="radio" name="answer" value={answer.value} />
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
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionPage;
