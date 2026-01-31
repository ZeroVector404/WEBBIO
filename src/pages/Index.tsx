import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard";
import SocialLinks from "@/components/SocialLinks";
import MusicPlayer from "@/components/MusicPlayer";
import ProjectsSection from "@/components/ProjectsSection";
import BackgroundEffects from "@/components/BackgroundEffects";
import MouseFollower from "@/components/MouseFollower";
import TypingIntro from "@/components/TypingIntro";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";

const Index = () => {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen relative cursor-none">
      <BackgroundEffects />
      <MouseFollower />

      {/* Splash overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-none"
            style={{
              background: "rgba(5,5,15,0.85)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => setEntered(true)}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pulsing ring */}
            <motion.div
              className="w-28 h-28 rounded-full flex items-center justify-center relative"
              style={{
                border: "2px solid rgba(100,200,255,0.4)",
                boxShadow: "0 0 30px rgba(100,200,255,0.15), inset 0 0 20px rgba(100,200,255,0.05)",
              }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(100,200,255,0.15), inset 0 0 20px rgba(100,200,255,0.05)",
                  "0 0 50px rgba(100,200,255,0.3), inset 0 0 30px rgba(100,200,255,0.1)",
                  "0 0 30px rgba(100,200,255,0.15), inset 0 0 20px rgba(100,200,255,0.05)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Play triangle */}
              <div
                className="w-0 h-0 ml-2"
                style={{
                  borderLeft: "22px solid rgba(100,200,255,0.9)",
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  filter: "drop-shadow(0 0 10px rgba(100,200,255,0.6))",
                }}
              />
              {/* Outer pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(100,200,255,0.2)" }}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              />
            </motion.div>

            <motion.p
              className="mt-6 text-sm font-mono tracking-widest"
              style={{
                color: "rgba(100,200,255,0.7)",
                textShadow: "0 0 10px rgba(100,200,255,0.3)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              CLICK TO ENTER
            </motion.p>

            <p
              className="mt-2 text-[10px] font-mono"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Music will start playing
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-16 max-w-5xl relative z-10">
        {/* Hero Section */}
        <motion.section
          className="flex flex-col items-center gap-10 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TypingIntro />
          <ProfileCard />
          <SocialLinks />
          <div className="w-full max-w-lg">
            <MusicPlayer />
          </div>
        </motion.section>

        {/* Projects Section */}
        <ProjectsSection />

        {/* Easter Egg */}
        <KonamiEasterEgg />
      </main>
    </div>
  );
};

export default Index;
