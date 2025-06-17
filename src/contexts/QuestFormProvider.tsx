import { useEffect, useState, ReactNode, useCallback } from "react";
import { Question, Answer, SavedFormData } from "@/types/quest";
import { QuestFormContext } from "./QuestFormContext";

const STORAGE_KEY = "questFormData";

export const QuestFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  //Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      order: 0,
      value: "",
      image: "",
      points: 1,
      answers: [{ order: 0, value: "", isCorrect: false }],
    },
  ]);
  const [totalPoints, setTotalPoints] = useState<number>(1);

  //Form useStates
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [time, setTime] = useState<number>(-1);
  const [showTimeControls, setShowTimeControls] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Load QuestForm progress
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData: SavedFormData = JSON.parse(storedData);
        setImage(parsedData.image);
        setTitle(parsedData.title);
        setDescription(parsedData.description);
        setCategory(parsedData.category);
        setTime(parsedData.time);
        setShowTimeControls(parsedData.showTimeControls);
        setQuestions(parsedData.questions);
      }
    } catch (error) {
      console.error("Error loading QuestForm progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //Save QuestForm progress
  useEffect(() => {
    if (isLoading) return;
    try {
      const data: SavedFormData = {
        image,
        title,
        description,
        category,
        time,
        showTimeControls,
        questions,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving QuestForm progress:", error);
    }
  }, [
    isLoading,
    image,
    title,
    description,
    category,
    time,
    showTimeControls,
    questions,
  ]);

  //Clear QuestForm progress
  const clearSavedData = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing QuestForm progress:", error);
    }
  }, []);

  useEffect(() => {
    setQuestions((prev) => prev.map((q, index) => ({ ...q, order: index })));
  }, [questions.length]);

  useEffect(() => {
    const newPoints = questions.reduce((acc, q) => acc + q.points, 0);
    setTotalPoints(newPoints);
  }, [questions]);

  const findQuestion = useCallback(
    (questionOrder: number): Question | undefined => {
      return questions.find((q) => q.order === questionOrder);
    },
    [questions],
  );

  //Question methods
  const addQuestion = useCallback(() => {
    if (questions.length >= 20) return;
    setQuestions((prev) => [
      ...prev,
      {
        order: prev.length,
        value: "",
        image: "",
        points: 1,
        answers: [{ order: 0, value: "", isCorrect: false }],
      },
    ]);
  }, [questions.length]);

  const removeQuestion = useCallback(
    (order: number) => {
      if (questions.length <= 1) return;
      setQuestions((prev) => {
        const filtered = prev.filter((q) => q.order !== order);
        return filtered.map((q, index) => ({ ...q, order: index }));
      });
    },
    [questions.length],
  );

  const updateQuestion = useCallback(
    (
      order: number,
      value: string,
      image: string,
      points: number,
      answers: Answer[],
    ) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.order === order ? { ...q, value, image, points, answers } : q,
        ),
      );
    },
    [],
  );

  const updateQuestionValue = useCallback(
    (questionOrder: number, value: string) => {
      setQuestions((prev) =>
        prev.map((q) => (q.order === questionOrder ? { ...q, value } : q)),
      );
    },
    [],
  );

  const updateQuestionImage = useCallback(
    (questionOrder: number, image: string) => {
      setQuestions((prev) =>
        prev.map((q) => (q.order === questionOrder ? { ...q, image } : q)),
      );
    },
    [],
  );

  const updateQuestionPoints = useCallback(
    (questionOrder: number, points: number) => {
      const boundedPoints = Math.min(Math.max(0, points), 99);
      setQuestions((prev) =>
        prev.map((q) =>
          q.order === questionOrder ? { ...q, points: boundedPoints } : q,
        ),
      );
    },
    [],
  );

  //Answer methods
  const updateAnswer = useCallback(
    (
      questionOrder: number,
      order: number,
      value: string,
      isCorrect: boolean,
    ) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.order !== questionOrder) return q;

          const updatedAnswers = q.answers.map((a) =>
            a.order === order ? { ...a, value, isCorrect } : a,
          );

          return { ...q, answers: updatedAnswers };
        }),
      );
    },
    [],
  );

  const addAnswer = useCallback((questionOrder: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.order !== questionOrder) return q;
        if (q.answers.length >= 7) return q;

        return {
          ...q,
          answers: [
            ...q.answers,
            { order: q.answers.length, value: "", isCorrect: false },
          ],
        };
      }),
    );
  }, []);

  const deleteAnswer = useCallback(
    (questionOrder: number, answerOrder: number) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.order !== questionOrder) return q;
          if (q.answers.length <= 1) return q;

          const filtered = q.answers.filter((a) => a.order !== answerOrder);
          const reorderedAnswers = filtered.map((ans, index) => ({
            ...ans,
            order: index,
          }));

          return { ...q, answers: reorderedAnswers };
        }),
      );
    },
    [],
  );

  return (
    <QuestFormContext.Provider
      value={{
        questions,
        totalPoints,
        addQuestion,
        removeQuestion,
        updateQuestion,
        updateQuestionValue,
        updateQuestionImage,
        updateQuestionPoints,
        updateAnswer,
        addAnswer,
        deleteAnswer,
        findQuestion,

        image,
        setImage,
        title,
        setTitle,
        description,
        setDescription,
        category,
        setCategory,
        time,
        setTime,
        showTimeControls,
        setShowTimeControls,

        clearSavedData,
      }}
    >
      {children}
    </QuestFormContext.Provider>
  );
};
