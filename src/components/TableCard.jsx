// src/components/TableCard.jsx
import React from 'react';
import { formatTime, calculateCost } from '../utils';
import './TableCard.css'; // Ensure this CSS is updated or styles are fine

const HOURLY_RATE = 15; // GEL per hour

const TableCard = ({ table, onOpenStartModal, onStop, onPayAndClear }) => {
  const { name, timerStartTime, elapsedTimeInSeconds, isRunning, timerMode, initialCountdownSeconds } = table;

  let displayTimeSeconds = 0;
  let currentCost = "0.00";
  let sessionCost = "0.00"; // Cost for the entire session (especially for countdown)

  if (timerMode === 'countdown') {
    const totalPassedTime = isRunning && timerStartTime
      ? elapsedTimeInSeconds + (Date.now() - timerStartTime) / 1000
      : elapsedTimeInSeconds;
    displayTimeSeconds = initialCountdownSeconds ? initialCountdownSeconds - totalPassedTime : 0;
    sessionCost = calculateCost(initialCountdownSeconds || 0, HOURLY_RATE);
    currentCost = sessionCost; // For countdown, cost is fixed
    if (isRunning && displayTimeSeconds < 0) displayTimeSeconds = 0; // Don't show negative time
  } else { // Standard timer
    displayTimeSeconds = isRunning && timerStartTime
      ? elapsedTimeInSeconds + (Date.now() - timerStartTime) / 1000
      : elapsedTimeInSeconds;
    currentCost = calculateCost(displayTimeSeconds, HOURLY_RATE);
    sessionCost = currentCost;
  }


  const canStart = !isRunning && (!initialCountdownSeconds || displayTimeSeconds <=0 || timerMode === 'standard');
  // Pay & Clear is available if time has run or a countdown was set
  const canPayAndClear = (timerMode === 'standard' && (elapsedTimeInSeconds > 0 || isRunning)) || (timerMode === 'countdown' && initialCountdownSeconds > 0) ;


  return (
    <div className={`table-card ${isRunning ? 'running' : ''} ${timerMode === 'countdown' ? 'countdown-mode' : ''}`}>
      <h3>{name}</h3>
      <div className="timer-mode-display">Mode: {timerMode === 'countdown' ? `Countdown (${formatTime(initialCountdownSeconds || 0)})` : 'Standard Timer'}</div>
      <div className="timer-display">{formatTime(displayTimeSeconds)}</div>
      <div className="cost-display">
        {timerMode === 'countdown' && initialCountdownSeconds > 0 ? `Session Cost: ${sessionCost} GEL` : `Current Cost: ${currentCost} GEL`}
      </div>
      <div className="controls">
        {canStart && (
          <button onClick={() => onOpenStartModal(table.id)} className="start-btn">
            Start
          </button>
        )}
        {isRunning && (
          <button onClick={() => onStop(table.id)} className="stop-btn">
            Stop
          </button>
        )}
        <button
          onClick={() => onPayAndClear(table.id)}
          className="pay-clear-btn"
          disabled={!canPayAndClear}
        >
          Pay & Clear
        </button>
      </div>
      {timerMode === 'countdown' && isRunning && displayTimeSeconds <=0 && (
         <div className="timer-ended-indicator">Time's Up!</div>
      )}
    </div>
  );
};

export default TableCard;