import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// === Banner image/gif for the profile card ===
// Put image/gif in public/banners/ then set the path here
const PROFILE_BANNER = ""; // e.g. "/banners/profile-banner.gif"

const ProfileCard = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="relative rounded-2xl overflow-hidden glass-glow glow-border">
        {/* Top edge glow line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.6), transparent)" }}
        />

        {/* Banner with animated mesh gradient or custom image/gif */}
        <div className="h-32 relative overflow-hidden">
          {PROFILE_BANNER ? (
            <img src={PROFILE_BANNER} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/60" />
          )}
          <div className="absolute inset-0" style={{ background: "rgba(10,10,20,0.3)" }} />
          {/* Animated moving gradient overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 40%, rgba(100,200,255,0.3) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 40%),
                radial-gradient(circle at 50% 80%, rgba(139,92,246,0.3) 0%, transparent 50%)
              `,
              backgroundSize: "200% 200%",
            }}
          />
          {/* Grid overlay on banner */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
          {/* Animated sparkles */}
          {[
            { top: "15%", left: "75%", size: 3, delay: 0 },
            { top: "60%", left: "85%", size: 2, delay: 0.5 },
            { top: "30%", left: "15%", size: 2.5, delay: 1 },
            { top: "70%", left: "40%", size: 2, delay: 1.5 },
            { top: "20%", left: "55%", size: 1.5, delay: 2 },
          ].map((spark, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: spark.top,
                left: spark.left,
                width: spark.size,
                height: spark.size,
                boxShadow: `0 0 ${spark.size * 4}px rgba(255,255,255,0.8)`,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: spark.delay }}
            />
          ))}
          {/* Scan line effect */}
          <motion.div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.4), transparent)",
              boxShadow: "0 0 10px rgba(100,200,255,0.3)",
            }}
            animate={{ top: ["-2px", "128px"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          {/* View count badge */}
          <motion.div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span style={{ textShadow: "0 0 6px rgba(255,255,255,0.3)" }}>4.8K</span>
          </motion.div>
        </div>

        {/* Avatar overlapping banner */}
        <div className="px-5 pb-5">
          <div className="relative -mt-14 mb-3 flex items-end justify-between">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full blur-xl opacity-60"
                style={{ background: "radial-gradient(circle, rgba(100,200,255,0.3), rgba(139,92,246,0.3), transparent)" }}
              />
              <div className="p-1 rounded-full bg-[#0a0a14] relative">
                <Avatar className="h-24 w-24 border-2 border-cyan-400/30 shadow-[0_0_25px_rgba(100,200,255,0.2),0_0_50px_rgba(139,92,246,0.15)]">
                  <AvatarImage
                    src="/S__9437189.jpg"
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-white/10 text-white text-2xl">U</AvatarFallback>
                </Avatar>
              </div>
              {/* Animated ring around avatar */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1px solid rgba(100,200,255,0.2)",
                  margin: "-2px",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-[#0a0a14]"
                style={{ background: "#3ba55d", boxShadow: "0 0 12px rgba(59,165,93,0.6), 0 0 24px rgba(59,165,93,0.3)" }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex gap-2 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: isFollowing ? "rgba(255,255,255,0.08)" : "rgba(100,200,255,0.15)",
                  color: isFollowing ? "rgba(255,255,255,0.5)" : "rgb(100,200,255)",
                  border: isFollowing ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(100,200,255,0.3)",
                  boxShadow: isFollowing ? "none" : "0 0 10px rgba(100,200,255,0.15)",
                  textShadow: isFollowing ? "none" : "0 0 6px rgba(100,200,255,0.4)",
                }}
                onClick={() => setIsFollowing(!isFollowing)}
                whileTap={{ scale: 0.9 }}
              >
                {isFollowing ? "Following" : "Follow"}
              </motion.button>
              <div className="relative">
                <motion.button
                  className="px-2 py-1 rounded-lg text-xs transition-all"
                  style={{
                    background: showMenu ? "rgba(100,200,255,0.1)" : "rgba(255,255,255,0.05)",
                    color: showMenu ? "rgb(100,200,255)" : "rgba(255,255,255,0.5)",
                    border: showMenu ? "1px solid rgba(100,200,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                  onClick={() => setShowMenu(!showMenu)}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </motion.button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 rounded-xl py-1 z-30 min-w-[140px]"
                      style={{
                        background: "rgba(15,15,25,0.95)",
                        border: "1px solid rgba(100,200,255,0.2)",
                        boxShadow: "0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(100,200,255,0.1)",
                        backdropFilter: "blur(20px)",
                      }}
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {["Share Profile", "Copy Link", "Block", "Report"].map((item) => (
                        <button
                          key={item}
                          className="w-full text-left px-3 py-1.5 text-xs transition-all hover:bg-white/5"
                          style={{
                            color: item === "Block" || item === "Report" ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.6)",
                          }}
                          onClick={() => setShowMenu(false)}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="space-y-3">
            <div>
              <motion.h1
                className="text-2xl font-bold flex items-center gap-2"
                style={{ color: "#fff", textShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(100,200,255,0.2)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Tinnapat Saelee
                <motion.svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0"
                  style={{ filter: "drop-shadow(0 0 6px rgba(100,200,255,0.8))" }}
                  whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="rgb(100,200,255)" strokeWidth="2" />
                </motion.svg>
              </motion.h1>
              <motion.p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                @tinnapat
              </motion.p>
            </div>

            {/* Glowing divider */}
            <div className="h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.2), transparent)" }} />

            {/* About me */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(100,200,255,0.7)", textShadow: "0 0 10px rgba(100,200,255,0.3)" }}>
                About Me
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                Developer passionate about C++, Lua & JavaScript.
                Building cool projects and crafting digital experiences.
              </p>
            </motion.div>

            {/* Status bar - like Discord activity */}
            <motion.div
              className="rounded-xl p-3 relative overflow-hidden"
              style={{
                background: "rgba(100,200,255,0.04)",
                border: "1px solid rgba(100,200,255,0.1)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(100,200,255,0.1)", boxShadow: "0 0 10px rgba(100,200,255,0.15)" }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: "rgb(100,200,255)" }} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Coding</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Visual Studio Code - for 3h 24m</p>
                </div>
              </div>
              {/* Animated progress bar */}
              <div className="mt-2 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, rgba(100,200,255,0.8), rgba(139,92,246,0.8))", boxShadow: "0 0 6px rgba(100,200,255,0.5)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Role badges with glow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "rgba(100,200,255,0.7)", textShadow: "0 0 10px rgba(100,200,255,0.3)" }}>
                Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "C++", glow: "rgba(100,200,255,0.5)", border: "rgba(100,200,255,0.3)", text: "rgb(100,200,255)" },
                  { name: "Lua", glow: "rgba(74,222,128,0.5)", border: "rgba(74,222,128,0.3)", text: "rgb(74,222,128)" },
                  { name: "JavaScript", glow: "rgba(250,204,21,0.5)", border: "rgba(250,204,21,0.3)", text: "rgb(250,204,21)" },
                ].map((role) => (
                  <motion.span
                    key={role.name}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      color: role.text,
                      border: `1px solid ${role.border}`,
                      boxShadow: `0 0 10px ${role.glow}, inset 0 0 10px rgba(255,255,255,0.02)`,
                      background: "rgba(255,255,255,0.03)",
                      textShadow: `0 0 8px ${role.glow}`,
                    }}
                    whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${role.glow}` }}
                  >
                    {role.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex gap-4 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: "Friends", value: "72" },
                { label: "Followers", value: isFollowing ? "847" : "846" },
                { label: "Projects", value: "15" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.8)", textShadow: "0 0 8px rgba(100,200,255,0.3)" }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
