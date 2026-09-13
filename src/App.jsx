import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart } from 'lucide-react';
import AmbientBackground from './components/AmbientBackground';
import SpiralBinder from './components/SpiralBinder';
import PageContent from './components/PageContent';
import MusicPlayer from './components/MusicPlayer';
import { playPageFlipSound, playPopSound } from './utils/soundEffects';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1); // 1..5 = 5 Trang nội dung
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pageAnimKey, setPageAnimKey] = useState(0);

  // Turn to a specific page with sound
  const goToPage = (pageNumber) => {
    if (pageNumber === currentPage) return;
    if (soundEnabled) {
      playPageFlipSound();
    }
    setCurrentPage(pageNumber);
    setPageAnimKey((prev) => prev + 1);
  };

  const nextPage = () => {
    if (currentPage < 5) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const resetToFirstPage = () => {
    goToPage(1);
  };

  // Sound FX toggle
  const handleSoundToggle = () => {
    playPopSound();
    setSoundEnabled(!soundEnabled);
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentPage < 5) {
        if (soundEnabled) playPageFlipSound();
        setCurrentPage((p) => Math.min(p + 1, 5));
        setPageAnimKey((k) => k + 1);
      }
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        if (soundEnabled) playPageFlipSound();
        setCurrentPage((p) => Math.max(p - 1, 1));
        setPageAnimKey((k) => k + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, soundEnabled]);

  return (
    <div className="app-wrapper">
      {/* Gentle floating ambient background items */}
      <AmbientBackground />

      {/* Top Floating Controls */}
      <header className="top-nav">
        {/* Left: Cute Mini Vinyl Player */}
        <div className="top-nav-group">
          <MusicPlayer />
        </div>

        {/* Right: Sound FX & Romantic badge */}
        <div className="top-nav-group">
          <button
            className="icon-btn"
            onClick={handleSoundToggle}
            title={soundEnabled ? 'Tắt tiếng lật trang' : 'Bật tiếng lật trang'}
            style={{ color: soundEnabled ? 'var(--accent-pink)' : '#888' }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <div className="music-tag" style={{ cursor: 'default' }}>
            <Heart size={16} fill="var(--accent-pink)" color="var(--accent-pink)" />
            <span>🌸</span>
          </div>
        </div>
      </header>

      {/* Main Notebook Presentation */}
      <main className="notebook-container">
        <div className="notebook">
          {/* Ribbon Bookmark - Clicking it jumps to the final promise page */}
          <div
            className="ribbon-bookmark"
            title="Đánh dấu trang - Nhảy đến câu hỏi quan trọng nhất"
            onClick={() => goToPage(5)}
          />

          {/* Metal Spiral Rings */}
          <SpiralBinder ringCount={10} />

          {/* Dynamic Page Sheet */}
          <div key={pageAnimKey} style={{ display: 'contents' }}>
            <PageContent
              pageIndex={currentPage}
              onNext={nextPage}
              onPrev={prevPage}
              onReset={resetToFirstPage}
            />
          </div>
        </div>
      </main>

      {/* Bottom Floating Page Indicator Pills - 5 Pages Only */}
      <nav className="page-indicator-pills" style={{ marginTop: 20, zIndex: 10 }}>
        {[1, 2, 3, 4, 5].map((idx) => (
          <button
            key={idx}
            className={`indicator-dot ${currentPage === idx ? 'active' : ''}`}
            onClick={() => goToPage(idx)}
            title={`Trang 0${idx}`}
            aria-label={`Đi tới trang ${idx}`}
            style={{ border: 'none' }}
          />
        ))}
      </nav>
    </div>
  );
}
