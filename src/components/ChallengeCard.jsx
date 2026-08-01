import React from "react";
import { calculateProgress, formatNumber } from "../utils/helpers";

function ChallengeCard({ challenge, onUpdateProgress, onToggleComplete, onDelete }) {
  const { id, text, mode, current, target, completed } = challenge;
  const progress = calculateProgress(current, target);

  const applyUpdate = (newValue) => {
    const clamped = Math.min(newValue, target);
    onUpdateProgress(id, clamped);

    if (clamped >= target && !completed) {
      onToggleComplete(id);
    }
  };

  const handleIncrement = (amount) => {
    applyUpdate(current + amount);
  };

  const handleCustom = () => {
    const input = prompt(`Enter value to add (current: ${current})`);
    if (!input) return;

    const amount = parseInt(input, 10);
    if (isNaN(amount)) return;

    applyUpdate(current + amount);
  };

  return (
    <div className={`challenge-card ${completed ? "completed" : ""}`}>
      <div className="challenge-header">
        <div className="challenge-info">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggleComplete(id)}
          />
          <span className="challenge-text">{text}</span>
          {mode && <span className="mode-badge">{mode}</span>}
        </div>
        <button className="delete-btn" onClick={() => onDelete(id)}>
          ×
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          {formatNumber(current)} / {formatNumber(target)} ({progress}%)
        </div>
      </div>

      {!completed && (
        <div className="button-group">
          <button onClick={() => handleIncrement(1)}>+1</button>
          <button onClick={() => handleIncrement(5)}>+5</button>
          <button onClick={() => handleIncrement(10)}>+10</button>
          <button onClick={handleCustom}>Custom</button>
        </div>
      )}
    </div>
  );
}

export default ChallengeCard;
