import { motion } from "framer-motion";
import { useState } from "react";

const techs = [
  { name: "C++", icon: "⚡", color: "rgb(100,200,255)", glow: "rgba(100,200,255,0.5)", desc: "Systems & Performance" },
  { name: "Lua", icon: "🌙", color: "rgb(74,222,128)", glow: "rgba(74,222,128,0.5)", desc: "Game Scripting" },
  { name: "JavaScript", icon: "✦", color: "rgb(250,204,21)", glow: "rgba(250,204,21,0.5)", desc: "Web Development" },
  { name: "React", icon: "⚛", color: "rgb(97,218,251)", glow: "rgba(97,218,251,0.5)", desc: "UI Framework" },
  { name: "Node.js", icon: "◆", color: "rgb(104,195,80)", glow: "rgba(104,195,80,0.5)", desc: "Backend Runtime" },
];

const TechStack = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <motion.section
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <div className="flex flex-wrap justify-center gap-4">
        {techs.map((tech, i) => (
          <motion.div
            key={tech.name}
            className="relative group"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Tooltip */}
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-center whitespace-nowrap pointer-events-none z-20"
              style={{
                background: "rgba(10,10,20,0.9)",
                border: `1px solid ${tech.glow}`,
                boxShadow: `0 0 15px ${tech.glow}`,
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={hoveredIdx === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-[11px] font-bold" style={{ color: tech.color, textShadow: `0 0 8px ${tech.glow}` }}>
                {tech.name}
              </p>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{tech.desc}</p>
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                style={{ background: "rgba(10,10,20,0.9)", borderRight: `1px solid ${tech.glow}`, borderBottom: `1px solid ${tech.glow}` }}
              />
            </motion.div>

            {/* Hex card */}
            <motion.div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${hoveredIdx === i ? tech.glow : "rgba(255,255,255,0.1)"}`,
                boxShadow: hoveredIdx === i
                  ? `0 0 20px ${tech.glow}, 0 0 40px ${tech.glow}, inset 0 0 15px ${tech.glow}`
                  : "0 0 10px rgba(255,255,255,0.02)",
              }}
              whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Animated background pulse */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle, ${tech.glow} 0%, transparent 70%)`,
                  opacity: hoveredIdx === i ? 0.2 : 0.05,
                }}
                animate={hoveredIdx === i ? { scale: [1, 1.3, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              <span className="text-xl relative z-10" style={{
                filter: `drop-shadow(0 0 6px ${tech.glow})`,
              }}>
                {tech.icon}
              </span>
              <span className="text-[9px] font-bold mt-0.5 relative z-10" style={{
                color: tech.color,
                textShadow: `0 0 6px ${tech.glow}`,
              }}>
                {tech.name}
              </span>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-[1px]" style={{ background: tech.color, opacity: 0.5 }} />
              <div className="absolute top-0 left-0 w-[1px] h-2" style={{ background: tech.color, opacity: 0.5 }} />
              <div className="absolute bottom-0 right-0 w-2 h-[1px]" style={{ background: tech.color, opacity: 0.5 }} />
              <div className="absolute bottom-0 right-0 w-[1px] h-2" style={{ background: tech.color, opacity: 0.5 }} />
            </motion.div>

            {/* Orbiting dot */}
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: tech.color,
                boxShadow: `0 0 6px ${tech.glow}`,
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [-30, 0, 30, 0, -30],
              }}
              transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "linear" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Connecting line under the tech icons */}
      <motion.div
        className="mt-4 mx-auto h-[1px] max-w-xs"
        style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.3), rgba(139,92,246,0.3), transparent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      />
    </motion.section>
  );
};

export default TechStack;
