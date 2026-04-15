import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Grid Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Synthwave Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Cyberpunk Delta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div id="music-player" className="w-full flex flex-col gap-8">
      <audio
        id="audio-element"
        ref={audioRef}
        src={currentTrack.url}
        onEnded={skipForward}
        loop={false}
      />
      
      <div id="track-info" className="flex items-center space-x-4">
        <div id="volume-icon-container" className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/30 shrink-0">
          <Volume2 className="w-5 h-5 text-fuchsia-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="track-title" className="text-white font-display font-medium text-base truncate">
            {currentTrack.title}
          </h3>
          <p id="track-meta" className="text-gray-400 font-mono text-xs mt-1 tracking-wider">
            TRACK {currentTrackIndex + 1} / {TRACKS.length}
          </p>
        </div>
      </div>

      <div id="player-controls" className="flex items-center justify-center space-x-6">
        <button
          id="btn-skip-back"
          onClick={skipBack}
          className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Skip Back"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <motion.button
          id="btn-play-pause"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="w-14 h-14 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center justify-center transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </motion.button>
        
        <button
          id="btn-skip-forward"
          onClick={skipForward}
          className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Skip Forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
