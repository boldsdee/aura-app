import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Settings, Play, Pause, Square, Minus, Maximize2, X, ChevronUp } from 'lucide-react';

export default function App() {
  const [isFocusing, setIsFocusing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [bgTheme, setBgTheme] = useState('glass'); 
  const [orbTheme, setOrbTheme] = useState('glass'); 
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval = null;
    if (isFocusing && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(time => time - 1), 1000);
    } else if (timeLeft === 0) {
      setIsFocusing(false);
    }
    return () => clearInterval(interval);
  }, [isFocusing, timeLeft]);

  const isWeb = !window.electronAPI;
  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  const backgrounds = {
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
    dark: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
    blur: 'rgba(255, 255, 255, 0.05)'
  };
  const borders = { glass: 'border-white/20', dark: 'border-slate-700/50', blur: 'border-white/10' };
  const textColors = { glass: 'text-slate-700', dark: 'text-slate-200', blur: 'text-slate-800' };

  // 3D Textures
  const earthTexture = 'url(/earth.jpg)';
  const moonTexture = 'url(/moon.jpg)';
  
  // Generic beautiful coin placeholder
  const coinTexture = 'url(/coin.jpg)';
  const gearsTexture = 'url(/gears.jpg)';

  const renderOrb = () => {
    if (orbTheme === 'glass') {
      return (
        <motion.div
          className="w-48 h-48 rounded-full flex items-center justify-center shadow-lg relative"
          animate={{
            scale: isFocusing ? [1, 1.05, 1] : 1,
            boxShadow: isFocusing ? '0 0 40px rgba(234, 179, 8, 0.4), inset 0 0 20px rgba(255,255,255,0.5)' : '0 0 20px rgba(255, 255, 255, 0.2)'
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: isFocusing 
              ? 'linear-gradient(135deg, rgba(250,204,21,0.8) 0%, rgba(217,119,6,0.9) 100%)' 
              : 'linear-gradient(135deg, rgba(148,163,184,0.3) 0%, rgba(71,85,105,0.4) 100%)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent"></div>
        </motion.div>
      );
    }

    if (orbTheme === 'earth' || orbTheme === 'moon') {
      return (
        <div 
          className="w-48 h-48 sphere-3d relative flex items-center justify-center" 
          style={{ 
            backgroundImage: orbTheme === 'earth' ? earthTexture : moonTexture,
            animationPlayState: isFocusing ? 'running' : 'paused' 
          }}
        />
      );
    }

    if (orbTheme === 'gears') {
      return (
        <div className="w-48 h-48 relative flex items-center justify-center">
          <div 
            className="w-48 h-48 gears-3d bg-cover bg-center"
            style={{ 
              backgroundImage: gearsTexture,
              animationPlayState: isFocusing ? 'running' : 'paused'
            }}
          />
        </div>
      );
    }

    if (orbTheme === 'coin') {
      return (
        <div className="w-48 h-48 relative flex items-center justify-center perspective-[1000px]">
          <div 
            className="w-44 h-44 coin-3d bg-cover bg-center" 
            style={{ 
              backgroundImage: coinTexture,
              animationPlayState: isFocusing ? 'running' : 'paused'
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className={`w-screen h-screen flex flex-col items-center p-6 ${isWeb ? 'justify-start pt-20 overflow-y-auto' : 'justify-center'}`} style={{ WebkitAppRegion: 'drag' }}>
      
      {/* Web-only Landing Header */}
      {isWeb && (
        <div className="flex flex-col items-center gap-3 mb-12 text-center" style={{ WebkitAppRegion: 'no-drag' }}>
          <h1 className={`text-5xl md:text-6xl font-bold tracking-tight ${textColors[bgTheme]}`}>Introducing Aura.</h1>
          <p className={`text-xl md:text-2xl font-medium opacity-70 ${textColors[bgTheme]} max-w-md mb-2`}>
            Hello, this is Aura.<br/>Try this today.
          </p>
          <div className="flex gap-4 mt-3">
            <a href="https://github.com/boldsdee/aura-app/releases/latest/download/Aura-1.0.0-arm64.dmg" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ED] transition text-white" title="Download for Mac" target="_blank" rel="noopener noreferrer">
              <Download size={16} /><span className="text-[15px] font-medium">Mac OS</span>
            </a>
            <a href="https://github.com/boldsdee/aura-app/releases/latest/download/Aura%20Setup%201.0.0.exe" className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white transition`} title="Download for Windows" target="_blank" rel="noopener noreferrer">
              <Download size={16} /><span className="text-[15px] font-medium">Windows</span>
            </a>
          </div>
        </div>
      )}

      {/* Widget Container with Ambient Smoke/Mist Effect */}
      <div className="relative z-10 w-full max-w-sm">
        {isWeb && (
          <div className="absolute inset-0 pointer-events-none -z-10">
            {/* Soft misty glows to highlight glassmorphism */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[60px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -bottom-16 -right-12 w-72 h-72 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-[70px] opacity-70 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
          </div>
        )}
        
        <div 
          className={`relative w-full rounded-[32px] overflow-visible shadow-2xl border ${borders[bgTheme]} transition-all duration-500`}
          style={{
          background: backgrounds[bgTheme],
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
        }}
      >
        <div className={`flex justify-between items-center p-4 ${textColors[bgTheme]} opacity-80`} style={{ WebkitAppRegion: 'drag' }}>
          <span className="font-semibold text-sm tracking-wide ml-2">Aura</span>
          <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' }}>
            <button onClick={handleMinimize} className="hover:opacity-60 transition"><Minus size={16} /></button>
            <button onClick={handleMaximize} className="hover:opacity-60 transition"><Maximize2 size={14} /></button>
            <button onClick={handleClose} className="hover:opacity-60 transition"><X size={18} /></button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 relative">
          {renderOrb()}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className={`text-4xl font-light tracking-wider font-mono drop-shadow-lg ${orbTheme !== 'glass' ? 'text-white font-bold' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`text-xs uppercase tracking-[0.2em] mt-1 opacity-90 font-bold drop-shadow-md ${orbTheme !== 'glass' ? 'text-white' : 'text-white'}`}>
              {isFocusing ? 'Focusing' : 'Idle'}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-8 pb-8 pt-2 relative" style={{ WebkitAppRegion: 'no-drag' }}>
          
          {/* Settings Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`p-2 rounded-full hover:bg-white/20 transition ${textColors[bgTheme]}`}
            >
              <Settings size={18} />
            </button>
            
            
            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-12 left-0 w-48 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-slate-200 z-50 text-sm text-slate-700"
                >
                  <div className="font-semibold mb-2">Background</div>
                  <div className="flex gap-2 mb-4">
                    {['glass', 'dark', 'blur'].map(t => (
                      <button key={t} onClick={() => setBgTheme(t)} className={`px-2 py-1 rounded-md text-xs capitalize ${bgTheme === t ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="font-semibold mb-2">Orb Style</div>
                  <div className="flex flex-wrap gap-2">
                    {['glass', 'earth', 'moon', 'coin', 'gears'].map(t => (
                      <button key={t} onClick={() => setOrbTheme(t)} className={`px-2 py-1 rounded-md text-xs capitalize ${orbTheme === t ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>{t}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => { setIsFocusing(false); setTimeLeft(25 * 60); }}
              className={`w-12 h-12 rounded-full ${bgTheme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/30 text-slate-700 hover:bg-white/50'} flex items-center justify-center transition shadow-sm border border-white/20`}
            >
              <Square size={16} fill="currentColor" />
            </button>
            
            <button 
              onClick={() => setIsFocusing(!isFocusing)}
              className={`w-12 h-12 rounded-full ${bgTheme === 'dark' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/40 text-slate-800 hover:bg-white/60'} flex items-center justify-center transition shadow-md border border-white/30`}
            >
              {isFocusing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          </div>
          
          {/* Spacer to balance the layout */}
          <div className="w-9 h-9" />
        </div>
      </div>
      </div>

    </div>
  );
}
