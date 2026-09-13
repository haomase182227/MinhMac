import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof document !== 'undefined') {
      const audio = document.getElementById('global-bg-music');
      return audio ? !audio.paused : false;
    }
    return false;
  });
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // Connect to global audio element in index.html (Strictly WENDY - Daydream)
  useEffect(() => {
    const audio = document.getElementById('global-bg-music');
    if (!audio) return;
    audioRef.current = audio;

    // Ensure it strictly plays the default song WENDY - Daydream
    if (audio.src !== window.location.origin + '/music.mp3' && !audio.src.endsWith('/music.mp3')) {
      audio.src = '/music.mp3';
      audio.play().catch(() => {});
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Update audio element volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Toggle play / pause
  const togglePlay = () => {
    playPopSound();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.debug('Play error:', e);
      });
    }
  };

  return (
    <div className="cute-music-dock" style={{ cursor: 'default' }}>
      {/* Spinning Vinyl Record Icon */}
      <div
        className={`mini-vinyl ${isPlaying ? 'spinning' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        <div className="vinyl-center">💖</div>
      </div>

      {/* Fixed Song Title */}
      <div className="dock-info" style={{ cursor: 'default' }}>
        <div className="song-title-marquee">
          <span className="song-title">WENDY - Daydream 🌸</span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        className="dock-btn play-btn"
        onClick={togglePlay}
        title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
      </button>

      {/* Mute/Unmute Button */}
      <button
        className="dock-btn"
        onClick={() => {
          playPopSound();
          setIsMuted(!isMuted);
        }}
        title={isMuted ? 'Bật âm lượng' : 'Tắt tiếng'}
      >
        {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
    </div>
  );
}
