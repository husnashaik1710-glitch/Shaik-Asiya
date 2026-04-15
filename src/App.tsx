import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans selection:bg-fuchsia-500/30">
      {/* Background Effects */}
      <div id="bg-effects" className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header id="app-header" className="relative z-10 w-full p-6 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div id="logo-icon" className="w-8 h-8 bg-cyan-400 rounded shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
            <h1 id="app-title" className="text-2xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Neon Snake & Synth
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-6 max-w-7xl mx-auto w-full">
        {/* Game Area */}
        <motion.div 
          id="game-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full flex items-center justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          id="sidebar-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6"
        >
          <div id="audio-panel" className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <h2 id="audio-header" className="text-cyan-400 font-display font-medium tracking-wide mb-6 flex items-center text-lg">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              Audio Interface
            </h2>
            <MusicPlayer />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
