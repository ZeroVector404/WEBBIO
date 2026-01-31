import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const KonamiEasterEgg = () => {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; hue: number }[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.join(",") === KONAMI.join(",")) {
          setActivated(true);
          // Spawn celebration particles
          const p = Array.from({ length: 40 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            hue: Math.random() * 360,
          }));
          setParticles(p);
          setTimeout(() => { setActivated(false); setParticles([]); }, 4000);
        }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {activated && (
        <>
          {/* Celebration particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="fixed pointer-events-none z-[100] rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                background: `hsl(${p.hue}, 80%, 60%)`,
                boxShadow: `0 0 12px hsl(${p.hue}, 80%, 60%)`,
              }}
              initial={{ opacity: 1, scale: 0, y: 0 }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0.5],
                y: [0, -(Math.random() * 400 + 200)],
                x: [(Math.random() - 0.5) * 200],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
            />
          ))}

          {/* Center message */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-center">
              <motion.p
                className="text-4xl font-bold"
                style={{
                  color: "#fff",
                  textShadow: "0 0 30px rgba(100,200,255,0.8), 0 0 60px rgba(139,92,246,0.6), 0 0 90px rgba(100,200,255,0.4)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                🎮 KONAMI CODE! 🎮
              </motion.p>
              <motion.p
                className="text-sm mt-2"
                style={{ color: "rgba(100,200,255,0.8)", textShadow: "0 0 10px rgba(100,200,255,0.5)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                You found the secret!
              </motion.p>
            </div>
          </motion.div>

          {/* Screen flash */}
          <motion.div
            className="fixed inset-0 z-[99] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(100,200,255,0.15), transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default KonamiEasterEgg;
