import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "Hello, World!",
  "Welcome to BioWebsite",
];

const TypingIntro = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = phrases[phraseIndex];

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => setIsDeleting(true), 1800);
      return;
    }
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, current.length]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex items-center gap-1">
        <span className="text-xs font-mono px-2 py-0.5 rounded"
          style={{
            color: "rgba(100,200,255,0.6)",
            background: "rgba(100,200,255,0.05)",
            border: "1px solid rgba(100,200,255,0.15)",
          }}
        >
          {">"}_
        </span>
        <span
          className="text-lg font-mono font-medium"
          style={{
            color: "rgba(100,200,255,0.9)",
            textShadow: "0 0 15px rgba(100,200,255,0.5), 0 0 30px rgba(100,200,255,0.2)",
          }}
        >
          {current.slice(0, charIndex)}
        </span>
        <motion.span
          className="inline-block w-[2px] h-5 ml-0.5"
          style={{
            background: "rgb(100,200,255)",
            boxShadow: "0 0 8px rgba(100,200,255,0.8)",
          }}
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default TypingIntro;
