import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { playCuteBoing, playSuccessChime } from '../utils/soundEffects';

export default function PageContent({ pageIndex, onNext, onPrev, onReset }) {
  // Page 5 interaction states
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [persuasionText, setPersuasionText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const PERSUASION_MESSAGES = [
    'Hong cho bấm đâu nè! 🥺',
    'Suy nghĩ lại xíu điii mà 💕',
    'Anh nỡ lòng nào từ chối em sao? 😭',
    'Nút này bị khóa rồi nhen! 🔒',
    'Chỉ được chọn Dạ được thuii! 🎀',
    'Bấm Dạ được đi mò 🥰',
  ];

  // Playful runaway when hovering or clicking "No"
  const handleNoInteraction = () => {
    playCuteBoing();
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    const maxOffset = Math.min(90, 35 + nextCount * 10);
    const randomX = (Math.random() * 2 - 1) * maxOffset;
    const randomY = (Math.random() * 2 - 1) * (maxOffset * 0.5);

    setNoPosition({ x: randomX, y: randomY });
    setPersuasionText(PERSUASION_MESSAGES[Math.min(nextCount - 1, PERSUASION_MESSAGES.length - 1)]);
  };

  // When clicking YES
  const handleYesClick = () => {
    playSuccessChime();

    // Blast colorful confetti hearts
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF6584', '#FF8DA1', '#FFD166', '#D8B4E2', '#FFF'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);

    setIsSubmitted(true);
  };

  // Render content based on page index (1 to 5)
  switch (pageIndex) {
    case 1:
      // Trang 1: "Em không thích thế giới này"
      return (
        <div className="page-sheet">
          <div className="washi-tape top-center">🌸 Nhật Ký Nhỏ 🌸</div>

          <div className="page-meta">
            <div className="note-badge">Trang 01</div>
            <div className="page-date">✨</div>
          </div>

          <div className="page-center">
            {/* Tấm ảnh phong cách polaroid tinh tế kẹp washi tape */}
            <div className="polaroid-frame" title="Kỷ niệm đẹp ✨">
              <div className="polaroid-tape" />
              <img
                src="/photo.jpg"
                alt="Em không thích thế giới này"
                className="polaroid-img"
              />
            </div>

            <h2 className="page-main-text" style={{ marginTop: 12 }}>
              Em không thích thế giới này
            </h2>
          </div>

          <div className="page-footer" style={{ justifyContent: 'flex-end' }}>
            <button className="nav-btn primary" onClick={onNext}>
              Trang tiếp theo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      );

    case 2:
      // Trang 2: "Em chỉ thích anh"
      return (
        <div className="page-sheet">
          <div className="page-meta">
            <div className="note-badge">Trang 02</div>
            <div className="page-date">🐱💖</div>
          </div>

          <div className="page-center">
            <div className="illustration-box">
              <div className="doodle-avatar">🐱💖</div>
            </div>

            <h2 className="page-main-text" style={{ color: 'var(--accent-rose)' }}>
              Em chỉ thích anh
            </h2>
          </div>

          <div className="page-footer">
            <button className="nav-btn" onClick={onPrev}>
              <ArrowLeft size={18} /> Trang trước
            </button>
            <button className="nav-btn primary" onClick={onNext}>
              Lật tiếp nè <ArrowRight size={18} />
            </button>
          </div>
        </div>
      );

    case 3:
      // Trang 3: "Anh có thể"
      return (
        <div className="page-sheet">
          <div className="page-meta">
            <div className="note-badge">Trang 03</div>
            <div className="page-date">🌙⭐</div>
          </div>

          <div className="page-center">
            <div className="illustration-box">
              <div className="doodle-avatar">🌙⭐</div>
            </div>

            <h2 className="page-main-text">
              Anh có thể
            </h2>
          </div>

          <div className="page-footer">
            <button className="nav-btn" onClick={onPrev}>
              <ArrowLeft size={18} /> Trang trước
            </button>
            <button className="nav-btn primary" onClick={onNext}>
              Sang trang tiếp <ArrowRight size={18} />
            </button>
          </div>
        </div>
      );

    case 4:
      // Trang 4: "Trên thế giới này"
      return (
        <div className="page-sheet">
          <div className="page-meta">
            <div className="note-badge">Trang 04</div>
            <div className="page-date">🌍✨</div>
          </div>

          <div className="page-center">
            <div className="illustration-box">
              <div className="doodle-avatar">🌍✨</div>
            </div>

            <h2 className="page-main-text">
              Trên thế giới này
            </h2>
          </div>

          <div className="page-footer">
            <button className="nav-btn" onClick={onPrev}>
              <ArrowLeft size={18} /> Trang trước
            </button>
            <button className="nav-btn primary" onClick={onNext}>
              Trang cuối nè ➜
            </button>
          </div>
        </div>
      );

    case 5:
      // Trang 5: "chỉ thích mình em được không?" + Lựa chọn Yes / No
      return (
        <div className="page-sheet" style={{ background: 'linear-gradient(180deg, #FFF9FA 0%, #FFF0F5 100%)' }}>
          <div className="page-meta">
            <div className="note-badge" style={{ borderColor: 'var(--accent-rose)' }}>
              Trang 05
            </div>
            <div className="page-date">🎀</div>
          </div>

          <div className="page-center">
            {!isSubmitted ? (
              <>
                <div className="illustration-box" style={{ minHeight: 90 }}>
                  <div className="doodle-avatar">🐰🍓🐰</div>
                </div>

                <h2 className="page-main-text" style={{ color: 'var(--accent-rose)', fontSize: '2.5rem' }}>
                  chỉ thích mình em được không?
                </h2>

                {/* Persuasion message if user tried clicking No */}
                {persuasionText && (
                  <div className="persuasion-tip">
                    <span>{persuasionText}</span>
                  </div>
                )}

                {/* Interactive Decision Buttons */}
                <div className="interactive-decision-box" style={{ marginTop: 24 }}>
                  <div className="decision-buttons">
                    {/* YES BUTTON - Grows bigger as No is pressed/hovered */}
                    <button
                      className="btn-yes"
                      onClick={handleYesClick}
                      style={{
                        transform: `scale(${1 + Math.min(noCount * 0.12, 0.45)})`,
                      }}
                    >
                      <Heart size={22} fill="#FFF" />
                      Dạ được 💕
                    </button>

                    {/* NO BUTTON - Playfully runs away or prompts */}
                    <button
                      className="btn-no"
                      onMouseEnter={handleNoInteraction}
                      onClick={handleNoInteraction}
                      style={{
                        transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                      }}
                    >
                      <span>Hổng chịu 🥺</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Short, cute celebration card when YES is selected */
              <div className="success-celebration-card" style={{ padding: '32px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: 12 }}>🥰🎉💖</div>
                <h3 className="success-title" style={{ fontSize: '2.4rem', marginBottom: 12 }}>
                  Yayyy! Hứa rồi đó nha!
                </h3>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                  <button className="nav-btn" onClick={onReset} style={{ fontSize: '1.05rem', padding: '10px 24px' }}>
                    <RefreshCw size={16} /> Đọc lại từ đầu
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="page-footer">
            <button className="nav-btn" onClick={onPrev}>
              <ArrowLeft size={18} /> Trang 04
            </button>
            <div className="page-date">🌸</div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
