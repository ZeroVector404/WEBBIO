import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Repeat } from "lucide-react";

// === Add your songs here ===
// Use full YouTube URLs (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)
const songs = [
  { title: "Photograph", artist: "Ed Sheeran", url: "https://youtu.be/SlbfAYvA_gI?si=CgJrT4EkLpaUnQhy", banner: "https://www.siamzone.com/music/yt/KKQl-pIRQMY.jpg" },
  { title: "Falling", artist: "Harry Styles", url: "https://youtu.be/olGSAVOkkTI?si=c0EY0wiHGqlzPoK3", banner: "https://i.ytimg.com/vi/olGSAVOkkTI/maxresdefault.jpg" },
  { title: "About You", artist: "The 1975", url: "https://youtu.be/tGv7CUutzqU?si=pvAtfYuLimWzBDSW", banner: "https://i.ytimg.com/vi/tGv7CUutzqU/hq720.jpg" },
  { title: "A Moment", artist: "ZWEED N' ROLL", url: "https://youtu.be/7grezzVb-AU?si=DRafqKaNMi0OJY9D", banner: "https://i.scdn.co/image/ab67616d0000b2731e228e68d82866f9a2a19265" },
  { title: "Multo", artist: "Cup of Joe", url: "https://youtu.be/Rht8rS4cR1s?si=rRO5-4a45hlD8dtN", banner: "https://image.joox.com/JOOXcover/0/789c62820fe30d18/300" },
  // { title: "Song Name", artist: "Artist", url: "https://www.youtube.com/watch?v=XXXXX", banner: "https://..." },
];

// Extract video ID from any YouTube URL format
const getVideoId = (url: string): string => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : url;
};

// TypeScript declarations for YouTube IFrame API
declare global {
  interface Window {
    // eslint-disable-next-line
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isDraggingVol, setIsDraggingVol] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // eslint-disable-next-line
  const playerRef = useRef<any>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const song = songs[currentSong];

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPlayer = () => {
    if (playerRef.current) return;
    playerRef.current = new window.YT.Player("yt-player-hidden", {
      height: "0",
      width: "0",
      videoId: getVideoId(songs[0].url),
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        // eslint-disable-next-line
        onReady: (e: any) => {
          setPlayerReady(true);
          // Don't autoplay — wait for user interaction (splash screen click)
          let started = false;
          const tryStart = () => {
            if (started) return;
            started = true;
            e.target.unMute();
            e.target.setVolume(50);
            e.target.playVideo();
            document.removeEventListener("click", tryStart);
            document.removeEventListener("keydown", tryStart);
            document.removeEventListener("touchstart", tryStart);
          };
          document.addEventListener("click", tryStart);
          document.addEventListener("keydown", tryStart);
          document.addEventListener("touchstart", tryStart);
        },
        // eslint-disable-next-line
        onStateChange: (e: any) => {
          const state = e.data;
          // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0, BUFFERING=3
          if (state === 1) {
            setIsPlaying(true);
            setDuration(e.target.getDuration());
            startProgressTimer();
          } else if (state === 2) {
            setIsPlaying(false);
            stopProgressTimer();
          } else if (state === 0) {
            // Song ended
            stopProgressTimer();
            if (songs.length > 1) {
              setCurrentSong((prev) => (prev + 1) % songs.length);
            } else if (isLooping) {
              e.target.seekTo(0);
              e.target.playVideo();
            } else {
              setIsPlaying(false);
            }
          }
        },
      },
    });
  };

  const startProgressTimer = () => {
    stopProgressTimer();
    intervalRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (p && p.getCurrentTime && p.getDuration) {
        const ct = p.getCurrentTime();
        const dur = p.getDuration();
        if (dur > 0) {
          setCurrentTime(ct);
          setDuration(dur);
          setProgress((ct / dur) * 100);
        }
      }
    }, 250);
  };

  const stopProgressTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle song changes
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    const p = playerRef.current;
    p.loadVideoById(getVideoId(songs[currentSong].url));
    setProgress(0);
    setCurrentTime(0);
  }, [currentSong, playerReady]);

  // Volume sync
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    }
  }, [volume, isMuted, playerReady]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  };

  const nextSong = () => setCurrentSong((prev) => (prev + 1) % songs.length);
  const prevSong = () => {
    const p = playerRef.current;
    if (p && p.getCurrentTime && p.getCurrentTime() > 3) {
      p.seekTo(0);
    } else {
      setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    }
  };

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && playerRef.current && playerRef.current.getDuration) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const dur = playerRef.current.getDuration();
      playerRef.current.seekTo(x * dur, true);
    }
  }, []);

  // Volume drag
  const updateVolFromEvent = useCallback((clientX: number) => {
    if (volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setVolume(Math.round(x * 100));
      setIsMuted(false);
    }
  }, []);

  const handleVolMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVol(true);
    updateVolFromEvent(e.clientX);
  }, [updateVolFromEvent]);

  useEffect(() => {
    if (!isDraggingVol) return;
    const onMove = (e: MouseEvent) => updateVolFromEvent(e.clientX);
    const onUp = () => setIsDraggingVol(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingVol, updateVolFromEvent]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const volPercent = isMuted ? 0 : volume;

  return (
    <motion.div
      className="glass-glow glow-border rounded-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Hidden YouTube player */}
      <div className="absolute" style={{ width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div id="yt-player-hidden" />
      </div>

      {/* Top edge glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.5), transparent)" }}
      />

      {/* Album art / visualizer area with per-song banner */}
      <div className="relative h-44 overflow-hidden rounded-t-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSong}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {song.banner ? (
              <img src={song.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-blue-500/20" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: "rgba(10,10,20,0.5)" }} />
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(100,200,255,0.25) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(139,92,246,0.25) 0%, transparent 50%)
            `,
            backgroundSize: "200% 200%",
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `
            linear-gradient(rgba(100,200,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,200,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "15px 15px",
        }} />

        {/* Visualizer bars */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] px-4 h-20">
          {[...Array(32)].map((_, i) => (
            <motion.div
              key={i}
              className="rounded-t-sm"
              style={{
                width: 3,
                background: `linear-gradient(to top, rgba(100,200,255,${isPlaying ? 0.6 : 0.15}), rgba(139,92,246,${isPlaying ? 0.4 : 0.1}))`,
                boxShadow: isPlaying ? "0 0 4px rgba(100,200,255,0.3)" : "none",
              }}
              animate={isPlaying ? { height: [4, Math.random() * 50 + 10, 4] } : { height: 4 }}
              transition={isPlaying ? { repeat: Infinity, duration: 0.4 + Math.random() * 0.6, delay: i * 0.03, ease: "easeInOut" } : {}}
            />
          ))}
        </div>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(100,200,255,0.3), transparent)" }}
          animate={{ top: ["-1px", "176px"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />

        {/* Song info with CD disc */}
        <div className="absolute top-3 left-4 flex items-center gap-4 z-10">
          {/* Spinning CD */}
          <motion.div
            className="w-20 h-20 rounded-full relative flex-shrink-0"
            style={{
              background: "conic-gradient(rgba(30,30,40,1) 0deg, rgba(60,60,80,0.8) 60deg, rgba(30,30,40,1) 120deg, rgba(60,60,80,0.8) 180deg, rgba(30,30,40,1) 240deg, rgba(60,60,80,0.8) 300deg, rgba(30,30,40,1) 360deg)",
              border: "2px solid rgba(100,200,255,0.3)",
              boxShadow: "0 0 20px rgba(100,200,255,0.25), 0 0 40px rgba(139,92,246,0.15), inset 0 0 15px rgba(0,0,0,0.5)",
            }}
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
          >
            <div className="absolute inset-[3px] rounded-full" style={{
              background: "conic-gradient(transparent 0deg, rgba(100,200,255,0.06) 10deg, transparent 20deg, rgba(139,92,246,0.06) 30deg, transparent 40deg)",
              border: "1px solid rgba(255,255,255,0.05)",
            }} />
            <div className="absolute inset-[8px] rounded-full" style={{ border: "1px solid rgba(255,255,255,0.04)" }} />
            <div className="absolute inset-[13px] rounded-full" style={{ border: "1px solid rgba(255,255,255,0.03)" }} />
            <div className="absolute inset-[16px] rounded-full overflow-hidden" style={{
              border: "2px solid rgba(100,200,255,0.2)",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.6)",
            }}>
              {song.banner ? (
                <img src={song.banner} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{
                  background: "radial-gradient(circle, rgba(100,200,255,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(20,20,30,1) 100%)",
                }} />
              )}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{
              background: "rgba(10,10,20,0.95)",
              border: "1.5px solid rgba(100,200,255,0.4)",
              boxShadow: "0 0 6px rgba(100,200,255,0.3)",
            }} />
            <div className="absolute inset-0 rounded-full opacity-20" style={{
              background: "conic-gradient(transparent 0deg, rgba(255,100,100,0.3) 60deg, rgba(255,255,100,0.3) 120deg, rgba(100,255,100,0.3) 180deg, rgba(100,100,255,0.3) 240deg, rgba(255,100,255,0.3) 300deg, transparent 360deg)",
            }} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-bold" style={{ color: "#fff", textShadow: "0 0 10px rgba(100,200,255,0.4)" }}>
                {song.title}
              </p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{song.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loop toggle */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setIsLooping(!isLooping)}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: isLooping ? "rgba(100,200,255,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isLooping ? "rgba(100,200,255,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: isLooping ? "rgb(100,200,255)" : "rgba(255,255,255,0.3)",
            }}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Controls area */}
      <div className="px-5 pb-4 pt-3 space-y-3">
        {/* Progress bar */}
        <div className="space-y-1">
          <div
            ref={progressRef}
            className="h-1.5 rounded-full overflow-hidden relative group"
            style={{ background: "rgba(255,255,255,0.08)", cursor: "pointer" }}
            onClick={handleProgressClick}
          >
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: "linear-gradient(90deg, rgba(100,200,255,0.9), rgba(139,92,246,0.9))",
                boxShadow: "0 0 8px rgba(100,200,255,0.5), 0 0 16px rgba(139,92,246,0.3)",
                width: `${progress}%`,
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgb(100,200,255)", boxShadow: "0 0 8px rgba(100,200,255,0.8)", transform: "translateY(-50%) translateX(50%)" }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{fmt(currentTime)}</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{fmt(duration)}</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-between">
          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setIsMuted(!isMuted)} className="p-1 rounded-lg transition-all"
              style={{ color: isMuted ? "rgba(255,80,80,0.6)" : "rgba(255,255,255,0.4)" }}>
              <VolumeIcon className="w-4 h-4" />
            </button>
            <div
              ref={volumeRef}
              className="w-20 h-2 rounded-full relative group"
              style={{ background: "rgba(255,255,255,0.08)", cursor: "pointer" }}
              onMouseDown={handleVolMouseDown}
            >
              <motion.div
                className="h-full rounded-full absolute left-0 top-0"
                style={{
                  width: `${volPercent}%`,
                  background: "linear-gradient(90deg, rgba(100,200,255,0.7), rgba(139,92,246,0.7))",
                  boxShadow: "0 0 6px rgba(100,200,255,0.3)",
                }}
                animate={{ width: `${volPercent}%` }}
                transition={{ duration: isDraggingVol ? 0 : 0.15 }}
              />
              <motion.div
                className="absolute top-1/2 rounded-full"
                style={{
                  left: `${volPercent}%`,
                  width: 14,
                  height: 14,
                  marginLeft: -7,
                  marginTop: -7,
                  background: "rgb(100,200,255)",
                  boxShadow: "0 0 10px rgba(100,200,255,0.8), 0 0 20px rgba(100,200,255,0.4)",
                  border: "2px solid rgba(255,255,255,0.9)",
                }}
                animate={{
                  scale: isDraggingVol ? 1.3 : 1,
                  boxShadow: isDraggingVol
                    ? "0 0 15px rgba(100,200,255,1), 0 0 30px rgba(100,200,255,0.6)"
                    : "0 0 10px rgba(100,200,255,0.8), 0 0 20px rgba(100,200,255,0.4)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button onClick={prevSong} className="p-2 rounded-full transition-all"
              style={{ color: "rgba(255,255,255,0.5)" }}
              whileHover={{ scale: 1.1, color: "rgb(100,200,255)" }} whileTap={{ scale: 0.9 }}>
              <SkipBack className="w-4 h-4" />
            </motion.button>

            <motion.button onClick={togglePlay} className="p-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(100,200,255,0.9), rgba(139,92,246,0.9))",
                boxShadow: "0 0 20px rgba(100,200,255,0.4), 0 0 40px rgba(139,92,246,0.2)",
                color: "#fff",
              }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(100,200,255,0.6), 0 0 60px rgba(139,92,246,0.3)" }}
              whileTap={{ scale: 0.9 }}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </motion.button>

            <motion.button onClick={nextSong} className="p-2 rounded-full transition-all"
              style={{ color: "rgba(255,255,255,0.5)" }}
              whileHover={{ scale: 1.1, color: "rgb(100,200,255)" }} whileTap={{ scale: 0.9 }}>
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="w-[88px]" />
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
