import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  index: number;
}

const ProjectCard = ({ title, description, image, tags, liveUrl, githubUrl, index }: ProjectCardProps) => {
  return (
    <motion.a
      href={liveUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
      whileHover={{ y: -6 }}
      className="group block"
      style={{ textDecoration: "none" }}
    >
      <div
        className="rounded-2xl overflow-hidden relative glass-glow glow-border"
        style={{ minHeight: 360 }}
      >
        {/* Top edge glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.5), transparent)" }}
        />

        {/* Image section */}
        <div className="relative h-52 overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(10,10,20,1) 0%, rgba(10,10,20,0.6) 40%, rgba(10,10,20,0.2) 100%)"
          }} />
          {/* Grid overlay on image */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(rgba(100,200,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,200,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }} />
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.3), transparent)",
              boxShadow: "0 0 8px rgba(100,200,255,0.2)",
            }}
            animate={{ top: ["-1px", "208px"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />

          {/* Hover action buttons */}
          <motion.div
            className="absolute bottom-3 right-3 flex gap-2 z-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: "rgba(100,200,255,0.15)",
                  color: "rgb(100,200,255)",
                  border: "1px solid rgba(100,200,255,0.3)",
                  boxShadow: "0 0 10px rgba(100,200,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <ExternalLink className="h-3 w-3" /> Live
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Github className="h-3 w-3" /> Code
              </a>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold"
            style={{
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 0 15px rgba(100,200,255,0.3)",
            }}>
            {title}
          </h3>

          {/* Divider */}
          <div className="h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.2), transparent)" }} />

          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                className="px-2.5 py-0.5 text-[11px] rounded-full font-medium"
                style={{
                  background: "rgba(100,200,255,0.08)",
                  color: "rgb(100,200,255)",
                  border: "1px solid rgba(100,200,255,0.2)",
                  boxShadow: "0 0 8px rgba(100,200,255,0.1)",
                  textShadow: "0 0 6px rgba(100,200,255,0.4)",
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(100,200,255,0.3)" }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default ProjectCard;
