import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "C++", level: 85, color: "rgba(100,200,255,0.9)", glow: "rgba(100,200,255,0.5)" },
  { name: "Lua", level: 75, color: "rgba(74,222,128,0.9)", glow: "rgba(74,222,128,0.5)" },
  { name: "JavaScript", level: 70, color: "rgba(250,204,21,0.9)", glow: "rgba(250,204,21,0.5)" },
  { name: "React", level: 65, color: "rgba(97,218,251,0.9)", glow: "rgba(97,218,251,0.5)" },
  { name: "Node.js", level: 60, color: "rgba(104,195,80,0.9)", glow: "rgba(104,195,80,0.5)" },
];

const SkillBars = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      className="w-full mt-20"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-8 text-center"
        style={{
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)",
        }}
      >
        Skills
      </motion.h2>

      <div className="glass-glow glow-border rounded-2xl p-6 space-y-5 relative overflow-hidden">
        {/* Top edge glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.5), transparent)" }}
        />

        {skills.map((skill, i) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: skill.color, textShadow: `0 0 8px ${skill.glow}` }}>
                {skill.name}
              </span>
              <motion.span
                className="text-xs font-mono"
                style={{ color: "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {skill.level}%
              </motion.span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${skill.color}, ${skill.glow})`,
                  boxShadow: `0 0 10px ${skill.glow}, 0 0 20px ${skill.glow}`,
                }}
                initial={{ width: "0%" }}
                animate={inView ? { width: `${skill.level}%` } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(100,200,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,200,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }} />
      </div>
    </motion.section>
  );
};

export default SkillBars;
