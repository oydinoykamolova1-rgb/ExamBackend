import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TimerBadge({ durationMinutes, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(() => durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft < 300; // < 5 mins

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      background: isWarning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
      border: `1px solid ${isWarning ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
      color: isWarning ? '#f87171' : '#a5b4fc',
      fontWeight: 700,
      fontSize: '1rem',
      fontVariantNumeric: 'tabular-nums'
    }}>
      <Clock size={18} className={isWarning ? 'animate-pulse' : ''} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
