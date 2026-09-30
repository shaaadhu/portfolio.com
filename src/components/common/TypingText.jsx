import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Typewriter with a static prefix and a rotating typed phrase.
 * - Per-keystroke timing jitter + small pause on spaces/punctuation (feels human)
 * - Cursor stays solid while typing/deleting, blinks while idle
 * - Respects prefers-reduced-motion (shows the first phrase, no animation)
 */
export default function TypingText({
  prefix = '',
  phrases = [],
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseAfterType = 1800,
  pauseAfterDelete = 350,
  startDelay = 700,
}) {
  const reduce = prefersReducedMotion();
  const [text, setText] = useState(() => (reduce ? phrases[0] ?? '' : ''));
  const [typing, setTyping] = useState(false);
  const phrasesKey = phrases.join('|');

  useEffect(() => {
    if (reduce || phrases.length === 0) return undefined;

    let phraseIndex = 0;
    let length = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const full = phrases[phraseIndex];
      let delay;

      if (!deleting) {
        length += 1;
        setText(full.slice(0, length));
        setTyping(true);
        if (length === full.length) {
          deleting = true;
          setTyping(false);
          delay = pauseAfterType;
        } else {
          const lastChar = full[length - 1];
          delay = typingSpeed * (0.6 + Math.random() * 0.9) + (/[\s,.—-]/.test(lastChar) ? 70 : 0);
        }
      } else {
        length -= 1;
        setText(full.slice(0, length));
        setTyping(true);
        if (length === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTyping(false);
          delay = pauseAfterDelete;
        } else {
          delay = deletingSpeed;
        }
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
    // phrasesKey covers phrase content changes without re-running on new array identities
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrasesKey, typingSpeed, deletingSpeed, pauseAfterType, pauseAfterDelete, startDelay, reduce]);

  return (
    <span className="typing-text">
      <span className="sr-only">{`${prefix} ${phrases[0] ?? ''}`}</span>
      <span aria-hidden="true">
        {prefix}
        {prefix && ' '}
        {text}
      </span>
      <span aria-hidden="true" className={`typing-cursor${typing ? ' is-typing' : ''}`} />
    </span>
  );
}
