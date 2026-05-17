import { useEffect, useState } from 'react';
import './IntroOverlay.css';

const IntroOverlay = () => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompleted(true);
    }, 3000); // Intro lasts 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (completed) return null;

  return (
    <div className={`intro-overlay ${completed ? 'completed' : ''}`} role="dialog" aria-label="Intro" aria-modal="true" onClick={() => setCompleted(true)}>
      <div className="intro-content">
        <div className="intro-brand">NetClaks</div>
        <div className="intro-tagline">Drive beyond limits</div>
      </div>
      <div className="intro-skip-hint">Click to continue</div>
    </div>
  );
};

export default IntroOverlay;
