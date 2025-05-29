import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const [time, setTime] = useState<number | null>(
    quest?.time !== undefined ? quest.time : null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(question?.points || 0);
  const [score, setScore] = useState<number>(0);
  const isNavigatingRef = useRef(false);

  const [correctAnswers, setCorrectAnswers] = useState<string[]>(
    question?.answers.filter((a) => a.isCorrect).map((a) => a.value) || []
  );

  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (questId) {
      fetchQuest(questId);
    }
  }, [questId, fetchQuest]);

  const navigate = useNavigate();

  useEffect(() => {
    if (time === null || time < 0) {
      return;
    }

    if (time === 0) {
      console.log("You have no time left!");

      isNavigatingRef.current = true;

      setTimeout(() => {
        localStorage.removeItem(`quest_progress_${questId}`);
        navigate("/rating-form");
      }, 0);

      return;
    }

    const timerId = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [time, navigate, questId]);

  useEffect(() => {
    if (quest && quest.questions && quest.questions.length > 0) {
      const savedProgress = JSON.parse(
        localStorage.getItem(`quest_progress_${questId}`) || "null"
      );

      if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
        setQuestion(quest.questions[savedProgress.currentQuestionIndex]);
        setSelectedAnswers(savedProgress.selectedAnswers);
        setTime(savedProgress.timeRemaining);
        setPoints(
          quest.questions[savedProgress.currentQuestionIndex].points || 0
        );
        setScore(savedProgress.score || 0);
        setCorrectAnswers(
          quest.questions[savedProgress.currentQuestionIndex].answers
            .filter((a) => a.isCorrect)
            .map((a) => a.value)
        );
      } else {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setTime(quest.time);
        setQuestion(quest.questions[0]);
        setPoints(quest.questions[0].points);
        setScore(0);
        setCorrectAnswers(
          quest.questions[0].answers
            .filter((a) => a.isCorrect)
            .map((a) => a.value)
        );
      }
    }
  }, [quest, questId]);

  useEffect(() => {
    if (quest && questId && !isNavigatingRef.current) {
      const progressData = {
        questId,
        currentQuestionIndex,
        selectedAnswers,
        timeRemaining: time,
        score,
      };

      localStorage.setItem(
        `quest_progress_${questId}`,
        JSON.stringify(progressData)
      );
    }
  }, [questId, currentQuestionIndex, selectedAnswers, time, quest, score]);

  const handleFinishQuest = () => {
    isNavigatingRef.current = true;
    localStorage.removeItem(`quest_progress_${questId}`);
    navigate("/rating-form");
  };

  const handleNextQuestion = () => {
    if (!quest || !quest.questions) return;
    if (selectedAnswers.length === 0) return;

    setShowAnswers(true);

    setScore((prevScore) => {
      const selectedCorrectAnswers = selectedAnswers.filter((answer) =>
        correctAnswers.includes(answer)
      );

      const earnedScore =
        (selectedCorrectAnswers.length / correctAnswers.length) * points;
      if (selectedAnswers.length === correctAnswers.length) {
        return Math.round(prevScore + earnedScore);
      }

      const calculatedScore =
        earnedScore / (selectedAnswers.length - selectedCorrectAnswers.length);
      return Math.round(prevScore + calculatedScore);
    });

    setTimeout(() => {
      setShowAnswers(false);
      setSelectedAnswers([]);
      console.log("Selected answers:", selectedAnswers);
      console.log("Correct answers:", correctAnswers);

      if (currentQuestionIndex < quest.questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setQuestion(quest.questions[nextIndex]);
        setPoints(quest.questions[nextIndex].points || 0);
        setCorrectAnswers(
          quest.questions[nextIndex].answers
            .filter((a) => a.isCorrect)
            .map((a) => a.value)
        );
      } else {
        handleFinishQuest();
      }
    }, 1000);
  };

  useEffect(() => {
    console.log("score:", score);
  }, [score]);

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
                {points} {points === 1 ? "point" : "points"}
              </p>
              <div className="question__image">
                <img src={question?.image || logoImage} alt="Question image" />
              </div>
              <div className="question__answers">
                {question?.answers.map((answer) => {
                  let answerClass = "answer";
                  if (showAnswers) {
                    if (correctAnswers.includes(answer.value)) {
                      answerClass += " correct";
                    } else if (selectedAnswers.includes(answer.value)) {
                      answerClass += " incorrect";
                    }
                  }
                  return (
                    <label className={answerClass} key={answer.order}>
                      <input
                        type="checkbox"
                        name="answer"
                        value={answer.order}
                        checked={selectedAnswers.includes(answer.value)}
                        onChange={() => handleCheckboxChange(answer.value)}
                      />
                      <span className="custom-checkbox"></span>
                      {answer.value}
                    </label>
                  );
                })}
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
