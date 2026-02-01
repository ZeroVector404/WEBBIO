import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

const ProjectsSection = () => {
  const projects = [
    {
      title: "Lua Security Bypass",
      description: "Lua exploit development and security research. Bypassing nearly all protections including hook, metahook, hookfunc, and rollback systems. Deep understanding of Metatables, OOP patterns, and Roblox Server/Client architecture.",
      image: "/image.webp",
      tags: ["Lua", "Security", "Exploit", "Bypass"],
      liveUrl: "https://discord.gg/EevePuhaDp",
    },
    {
      title: "C++ System Hacker",
      description: "Low-level systems programming with deep understanding of pointers, dynamic memory, structs in RAM. Using Windows API (FindWindow, OpenProcess, ReadProcessMemory, WriteProcessMemory) for cross-process memory manipulation.",
      image: "https://dl.flathub.org/media/org/ghidra_sre/Ghidra/4ad91682b4765e3477e703c9cacbeac9/screenshots/image-2_orig.png",
      tags: ["C++", "Windows API", "Memory", "Low-level"],
      liveUrl: "https://discord.gg/EevePuhaDp",
    },
    {
      title: "Reverse Engineering",
      description: "Analyzing and understanding software at the binary level. Memory scanning, pointer chains, bitwise operations (GetAsyncKeyState & 0x8000), and RNG logic (srand/rand seed manipulation).",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format",
      tags: ["Reverse Engineering", "Memory", "Bitwise"],
      liveUrl: "https://discord.gg/EevePuhaDp",
    },
    {
      title: "Web Development",
      description: "Building modern web applications with React, TypeScript, and Node.js. Clean UI/UX design with responsive layouts and smooth animations.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format",
      tags: ["React", "TypeScript", "Node.js", "JavaScript"],
      liveUrl: "https://discord.gg/EevePuhaDp",
      githubUrl: "https://discord.gg/EevePuhaDp",
    },
  ];

  return (
    <section className="w-full">
      <motion.h2
        className="text-2xl font-bold mb-8 text-center"
        style={{
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Skills & Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
