import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useQuestContext } from "@/contexts/QuestContext";
import { Question } from "@/types/quest";
import "./QuestionPage.scss";
import logoImage from "@/assets/logo.jpg";
import Loading from "../Loading/Loading";
import ProgressBar from "../Partial/ProgressBar";
import { useProfileContext } from "@/contexts/ProfileContext";
import { PROGRESS_URL as URL } from "@/constants/progressConstants";

const QuestionPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const { questPreview: quest, loading, error, fetchQuest } = useQuestContext();
  const { userData } = useProfileContext();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questId) {
      fetchQuest(questId);
    }
  }, [questId, fetchQuest]);

  const navigate = useNavigate();

  const saveProgress = async (
    isFinished = false,
    finalScore: number | null = null
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isFinished) {
      localStorage.removeItem(`quest_progress_${questId}`);
    }

    try {
      const token = localStorage.getItem("accessToken");

      const userId = userData?.id;
      if (!token || !userId) return;

      const progressData = {
        questId,
        userId,
        currentQuestionIndex,
        score: finalScore !== null ? finalScore : score,
        isFinished,
        timeRemaining: time,
      };

      const response = await fetch(`${URL}/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      await response.json();
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (time === null || time < 0) {
      return;
    }

    if (time === 0) {
      console.log("You have no time left!");
      isNavigatingRef.current = true;
      saveProgress(true).then(() => {
        navigate("/rating-form");
      });
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

  const handleFinishQuest = async () => {
    isNavigatingRef.current = true;
    const finalScore = parseFloat(calculateScore(score).toFixed(1));
    setScore(finalScore);
    await saveProgress(true, finalScore);
    navigate("/rating-form");
  };

  const calculateScore = (prevScore: number) => {
    const correctCount = selectedAnswers.filter((answer) =>
      correctAnswers.includes(answer)
    ).length;

    const score = ((correctCount / correctAnswers.length) * points).toFixed(1);
    return prevScore + parseFloat(score);
  };

  const handleNextQuestion = () => {
    if (!quest || !quest.questions) return;
    if (selectedAnswers.length === 0) return;
    if (isSubmitting) return;

    setShowAnswers(true);
    setIsSubmitting(true);
    setScore(calculateScore(score));

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
        isNavigatingRef.current = true;
        handleFinishQuest();
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }

      if (prev.length >= correctAnswers.length) {
        return [...prev.slice(1), value];
      }

      return [...prev, value];
    });
  };

  useEffect(() => {
    console.log("score changed:", score);
  }, [score]);

  const handleContinueLater = async () => {
    if (isSubmitting) return;
    const confirmed = window.confirm(
      "Your progress will be saved and you can continue later. Exit now?"
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    isNavigatingRef.current = true;
    await saveProgress(false);
    navigate("/");
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isNavigatingRef.current && quest) {
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

        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [questId, currentQuestionIndex, selectedAnswers, time, score, quest]);

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
              {userData?.id ? (
                <button
                  className="continue-later-button"
                  onClick={handleContinueLater}
                  disabled={isSubmitting}
                >
                  Continue Later
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={handleNextQuestion}
                disabled={
                  loading ||
                  !quest.questions ||
                  selectedAnswers.length === 0 ||
                  isSubmitting
                }
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
