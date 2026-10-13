'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function FullscreenVideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Safely swallow AbortError caused by React unmounting or fast-refreshing during media play
        if (isMounted && error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
          console.warn('Media play request interrupted or blocked:', error);
        }
      });
    }

    return () => {
      isMounted = false;
      if (video) {
        video.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            if (error.name !== 'AbortError') {
              console.warn('Video play interrupted:', error);
            }
          });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[85vh] bg-black text-white flex flex-col justify-center items-center overflow-hidden py-12 border-b border-white/15">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/10 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <Badge icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              CINEMATIC PRODUCT SHOWCASE
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              GuardianTag Hardware In Action
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-sm">
            High-speed helmet impact testing, 3M adhesive strength &amp; instant bystander scan routing.
          </p>
        </div>

        {/* FULLSCREEN VIDEO CONTAINER */}
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-950 group aspect-video">
          
          {/* HTML5 Video Player with AbortError-safe autoplay & cleanup */}
          <video
            ref={videoRef}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            poster="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Dark Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Video Controls & Status Overlay Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
            
            {/* Play/Pause Main Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl hover:bg-neutral-200 transition cursor-pointer transform hover:scale-105"
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
              </button>

              <div className="hidden sm:flex flex-col font-mono text-white">
                <span className="text-xs font-extrabold">GUARDIAN HARDWARE REEL</span>
                <span className="text-[10px] text-neutral-400">4K Ultra HD • Weather Testing</span>
              </div>
            </div>

            {/* Mute/Unmute & Audio Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-3 rounded-xl bg-black/70 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
