import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Upload, Music, X, RotateCcw } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';
import { startMusicBox, stopMusicBox } from '../utils/musicBox';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof document !== 'undefined') {
      const audio = document.getElementById('global-bg-music');
      return audio ? !audio.paused : false;
    }
    return false;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioSourceType, setAudioSourceType] = useState(() => {
    return localStorage.getItem('user_bg_music_url') ? 'custom' : 'file';
  });
  const [songTitle, setSongTitle] = useState(() => {
    return localStorage.getItem('user_bg_music_title') || 'WENDY - Daydream (OST) 🌸';
  });
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [audioError, setAudioError] = useState('');

  const audioRef = useRef(null);

  // Connect to global audio element in index.html
  useEffect(() => {
    const audio = document.getElementById('global-bg-music');
    if (!audio) return;
    audioRef.current = audio;

    const savedAudio = localStorage.getItem('user_bg_music_url');
    if (savedAudio && audio.src !== savedAudio) {
      audio.src = savedAudio;
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

  // Update audio element volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Toggle play / pause
  const togglePlay = () => {
    playPopSound();

    if (isPlaying) {
      if (audioSourceType === 'synth') {
        stopMusicBox();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioSourceType === 'synth') {
        startMusicBox();
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setAudioError('');
          })
          .catch((err) => {
            console.warn('Autoplay block or audio load error:', err);
            startMusicBox();
            setAudioSourceType('synth');
            setSongTitle('Hộp nhạc ru tình yêu (Tự động chuyển)');
            setIsPlaying(true);
          });
      }
    }
  };

  // Handle uploading custom MP3 file from computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playPopSound();
    const objectUrl = URL.createObjectURL(file);
    const title = file.name.replace(/\.[^/.]+$/, '');

    if (audioRef.current) {
      stopMusicBox();
      audioRef.current.src = objectUrl;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    setAudioSourceType('file');
    setSongTitle(`🎵 ${title}`);
    setIsModalOpen(false);
  };

  // Handle setting music by direct URL
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    playPopSound();
    const url = customUrlInput.trim();
    if (audioRef.current) {
      stopMusicBox();
      audioRef.current.src = url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioError('');
      }).catch(() => {
        setAudioError('Không thể mở link nhạc này (kiểm tra lại URL direct .mp3).');
      });
    }

    localStorage.setItem('user_bg_music_url', url);
    localStorage.setItem('user_bg_music_title', 'Nhạc tải từ link trực tuyến 🎵');
    setAudioSourceType('custom');
    setSongTitle('Nhạc tải từ link trực tuyến 🎵');
    setIsModalOpen(false);
  };

  // Reset to default music box
  const handleResetToDefault = () => {
    playPopSound();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    localStorage.removeItem('user_bg_music_url');
    localStorage.removeItem('user_bg_music_title');

    setAudioSourceType('synth');
    setSongTitle('Hộp nhạc ru tình yêu (Mặc định)');
    if (isPlaying) {
      startMusicBox();
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Floating Cute Music Player Widget */}
      <div className="cute-music-dock">
        {/* Spinning Vinyl Record Icon */}
        <div
          className={`mini-vinyl ${isPlaying ? 'spinning' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Bấm để tạm dừng nhạc' : 'Bấm để phát nhạc'}
        >
          <div className="vinyl-center">💖</div>
        </div>

        {/* Info & Controls */}
        <div className="dock-info" onClick={() => setIsModalOpen(true)} title="Bấm để đổi bài hát yêu thích">
          <div className="song-title-marquee">
            <span className="song-title">{songTitle}</span>
          </div>
          <span className="change-hint">Chạm để đổi nhạc 🎶</span>
        </div>

        {/* Play/Pause Button */}
        <button className="dock-btn play-btn" onClick={togglePlay}>
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

        {/* Open Settings Modal Button */}
        <button
          className="dock-btn"
          onClick={() => {
            playPopSound();
            setIsModalOpen(true);
          }}
          title="Ghép nhạc của bạn"
        >
          <Upload size={17} />
        </button>
      </div>

      {/* Music Selector Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h3>
                <Music size={22} /> Ghép Bài Hát Của Bạn 🎵
              </h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)} style={{ width: 36, height: 36 }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-secondary)', marginBottom: 18, lineHeight: 1.5 }}>
                Bạn có thể tự chọn bất kỳ bài hát ngọt ngào nào để phát trong lúc lật xem nhật ký nhé!
              </p>

              {audioError && (
                <div style={{ padding: '8px 12px', background: '#FFEBEE', color: '#C62828', borderRadius: 10, fontSize: '0.85rem', marginBottom: 14 }}>
                  {audioError}
                </div>
              )}

              {/* Volume Slider */}
              <div style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: '#FFF9FA',
                borderRadius: 14,
                border: '1px solid #FFE0E6',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--ink-primary)', fontWeight: 600 }}>Âm lượng:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  style={{ flex: 1, accentColor: 'var(--accent-pink)' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: 'bold', width: 36 }}>
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              {/* Option 1: Upload MP3 from device */}
              <div className="music-opt-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div className="opt-icon-badge">📁</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--ink-primary)' }}>Chọn file nhạc từ máy tính / điện thoại</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Hỗ trợ file .mp3, .m4a, .wav</p>
                  </div>
                </div>

                <label className="nav-btn primary" style={{ display: 'inline-flex', cursor: 'pointer', fontSize: '0.95rem', padding: '8px 18px', width: '100%', justifyContent: 'center' }}>
                  <Upload size={16} /> Chọn File Nhạc MP3 Của Bạn
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Option 2: Paste direct MP3 link */}
              <div className="music-opt-card" style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div className="opt-icon-badge">🔗</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--ink-primary)' }}>Dán link bài hát online</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Đường dẫn file trực tiếp (.mp3 URL)</p>
                  </div>
                </div>

                <form onSubmit={handleUrlSubmit} style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="url"
                    placeholder="https://example.com/bai-hat-cua-ban.mp3"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 12,
                      border: '1.5px solid #E0D4DC',
                      outline: 'none',
                      fontSize: '0.88rem',
                    }}
                  />
                  <button type="submit" className="nav-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Phát
                  </button>
                </form>
              </div>

              {/* Reset to default synth */}
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--accent-pink)',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 600,
                  }}
                >
                  <RotateCcw size={15} /> Dùng lại nhạc hộp quà lofi mặc định
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
