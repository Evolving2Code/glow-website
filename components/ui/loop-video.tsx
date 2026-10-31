"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type LoopVideoProps = {
  mp4: string;
  webm?: string;
  poster?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

type NetworkInformation = { saveData?: boolean };

/**
 * Muted, looping background video.
 * - The poster renders first through next/image (good LCP); the video fades in once it can play.
 * - Plays only while on screen; pauses when scrolled away.
 * - Respects prefers-reduced-motion and Save-Data: shows the poster (or the paused first frame if none).
 * - Exposes a pause/play control (WCAG 2.2.2 for motion longer than 5s).
 */
export function LoopVideo({ mp4, webm, poster, alt, priority, sizes = "100vw", className }: LoopVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [saveData, setSaveData] = React.useState(false);
  // Motion preference and Save-Data are only known in the browser; mount the video after hydration.
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (conn?.saveData) setSaveData(true);
  }, []);

  const motionAllowed = mounted && !reduce && !saveData && !failed;
  // Without a poster, a paused video still shows its first frame, so keep it mounted.
  const renderVideo = mounted && !failed && (motionAllowed || !poster);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || !motionAllowed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused) {
          video.play().catch(() => setPlaying(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [motionAllowed, userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => setPlaying(false));
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <div className={cn("absolute inset-0", className)}>
      {poster && <Image src={poster} alt="" fill priority={priority} sizes={sizes} className="object-cover" />}
      {renderVideo && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}
      <span className="sr-only">{alt}</span>
      {motionAllowed && ready && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="glass absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border-[0.5px] border-white/15 text-ink/80 transition-colors hover:text-ink"
        >
          {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
        </button>
      )}
    </div>
  );
}
