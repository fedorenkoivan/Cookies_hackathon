import React from "react";
import "./ProgressBar.scss";

interface ProgressBarProps {
  current: number;
  total: number;
  time?: number | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, time }) => {
  const percentage = (100 * current) / total;

  const transformTime = (time: number | null | undefined): string => {
    if (!time) return "No time limit";
    const minutes = Math.trunc(time / 60);
    const seconds = time % 60;

    return `${`${minutes}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;
  };
  return (
    <div className="progress-container">
      <h2>
        {current} / {total}
      </h2>
      <div className="progress-bar">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <h2 className="progress-timer">{transformTime(time)}</h2>
    </div>
  );
};

export default ProgressBar;
