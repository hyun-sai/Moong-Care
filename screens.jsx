// screens.jsx — 뭉케어 모든 화면

const { useState, useEffect, useRef, useCallback } = React;

// ═══════════════════════════════════════════════════════════════════
// 0. LOCK SCREEN  (푸시 알림 진입점)
// ═══════════════════════════════════════════════════════════════════
function LockScreen({ navigate }) {
  const now = new Date();
  const timeStr = '9:41';
  const dateStr = '3월 12일 화요일';

  return (
    <Phone dark bg="#1a1714">
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '28px 0 0',
        color: '#fff',
      }}>
        {/* Clock */}
        <div style={{
          fontFamily: S.hand, fontWeight: 700, fontSize: 72,
          color: '#fff', lineHeight: 1, letterSpacing: -2, marginBottom: 6,
        }}>{timeStr}</div>
        <div style={{ fontFamily: S.pen, fontSize: 17, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
          {dateStr}
        </div>

        {/* Push notification — interactive */}
        <div className="screen-enter" onClick={() => navigate('home')} style={{
          width: 280, background: 'rgba(255,255,255,0.92)',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          cursor: 'pointer', marginBottom: 10,
        }}>
          {/* Notif header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 14px 8px',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: S.peachSoft, border: `1.5px solid ${S.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Mascot size={26} mood="worried" fill={S.peachFaint} cheek={false} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 13, color: S.ink }}>
                뭉케어 · 뭉이
              </div>
              <div style={{ fontFamily: S.body, fontSize: 10, color: S.inkFaint }}>지금</div>
            </div>
          </div>
          {/* Notif body */}
          <div style={{ padding: '0 14px 10px', fontFamily: S.pen, fontSize: 14, color: S.ink, lineHeight: 1.45 }}>
            오늘 너 좀 무거워 보여 ㅠ<br/>잠깐 얘기할래?
          </div>
          {/* Action buttons */}
          <div style={{
            display: 'flex', borderTop: `1px solid rgba(42,39,36,0.1)`,
          }}>
            <div onClick={e => { e.stopPropagation(); navigate('voice_chat'); }} style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              fontFamily: S.hand, fontWeight: 700, fontSize: 13, color: S.peach,
              borderRight: `1px solid rgba(42,39,36,0.1)`,
              cursor: 'pointer',
            }}>그래, 얘기하자</div>
            <div onClick={e => e.stopPropagation()} style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              fontFamily: S.hand, fontSize: 13, color: S.inkSoft,
              cursor: 'pointer',
            }}>나중에</div>
          </div>
        </div>

        {/* Second notification — passive */}
        <div style={{
          width: 280, background: 'rgba(255,255,255,0.18)',
          borderRadius: 18, padding: '10px 14px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>뭉케어</div>
            <div style={{ fontFamily: S.body, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>2시간 전</div>
          </div>
          <div style={{ fontFamily: S.pen, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            오늘 30초 녹음, 아직 안 했네...
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Swipe hint */}
        <div style={{
          marginBottom: 16, fontFamily: S.pen, fontSize: 13,
          color: 'rgba(255,255,255,0.45)', letterSpacing: 1,
        }}>밀어서 열기</div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 1. SPLASH
// ═══════════════════════════════════════════════════════════════════
function SplashScreen({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('onboarding'), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Phone>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div className="bounce">
          <Mascot size={110} mood="happy" />
        </div>
        <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 30, color: S.ink, letterSpacing: -0.5 }}>
          뭉케어
        </div>
        <div style={{ fontFamily: S.pen, fontSize: 17, color: S.inkSoft }}>
          목소리로 기록하는 마음
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: 4,
              background: i === 0 ? S.peach : S.inkVeryFaint,
              animation: `waveBar ${0.9 + i * 0.25}s ${i * 0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. ONBOARDING  (3-step)
// ═══════════════════════════════════════════════════════════════════
function OnboardingScreen({ navigate }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      mascotMood: 'happy',
      speech: '반가워! 👋',
      title: <>안녕, 나는 <span style={{ color: S.peach }}>뭉이</span>야</>,
      sub: '하루 30초, 너의 목소리로\n오늘 하루를 들려줘',
    },
    {
      mascotMood: 'talking',
      title: '말하면, AI가 일기로',
      sub: '편하게 말하면 뭉이가\n예쁜 일기로 정리해줄게',
      illustration: 'diary',
    },
    {
      mascotMood: 'excited',
      title: '목소리로 마음을 읽어',
      sub: '떨림·속도·높낮이로\n너의 진짜 감정을 알아가',
      illustration: 'voice',
    },
  ];

  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <Phone>
      <div className="screen-enter" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '16px 28px 20px', alignItems: 'center', textAlign: 'center',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 6, height: 6, borderRadius: 3,
              background: i <= step ? S.ink : S.inkVeryFaint,
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Mascot + illustration */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Mascot size={100} mood={s.mascotMood} />
          {s.speech && (
            <div style={{
              position: 'absolute', top: -10, right: -56,
              background: '#fff', border: `1.5px solid ${S.ink}`,
              borderRadius: 14, padding: '6px 10px',
              fontFamily: S.pen, fontSize: 14,
              transform: 'rotate(6deg)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
            }}>
              {s.speech}
            </div>
          )}
        </div>

        {/* Illustration */}
        {s.illustration === 'diary' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Waveform width={120} height={32} bars={18} seed={2.3} color={S.peach} />
              <span style={{ fontSize: 18, color: S.inkSoft }}>→</span>
            </div>
            <div style={{
              background: '#fffdf8', border: `1.5px solid ${S.ink}`,
              borderRadius: 10, padding: '10px 14px',
              fontFamily: S.pen, fontSize: 13, lineHeight: 1.5, textAlign: 'left',
            }}>
              <div style={{ fontFamily: S.hand, fontSize: 10, color: S.peach, marginBottom: 3 }}>3월 12일 · 화요일</div>
              시험 끝나고 친구랑 떡볶이를<br/>먹었다. 마음이 가벼워졌다.
            </div>
          </div>
        )}

        {s.illustration === 'voice' && (
          <div style={{ marginBottom: 16, width: '100%' }}>
            <Waveform width={220} height={40} bars={28} seed={4.1} color={S.peach} />
            <div style={{
              display: 'flex', justifyContent: 'space-around', marginTop: 10,
              fontFamily: S.hand, fontSize: 11, color: S.inkSoft,
            }}>
              <span>🎵 피치</span><span>⚡ 에너지</span><span>💧 떨림</span><span>⏱ 속도</span>
            </div>
          </div>
        )}

        <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 22, lineHeight: 1.25, marginBottom: 10 }}>
          {s.title}
        </div>
        <div style={{
          fontFamily: S.body, fontSize: 13, color: S.inkSoft,
          lineHeight: 1.7, whiteSpace: 'pre-line',
        }}>
          {s.sub}
        </div>

        <div style={{ flex: 1 }} />

        {/* Mic permission step (last) */}
        {isLast && (
          <div style={{
            width: '100%', marginBottom: 16,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {[
              { icon: '🎙', t: '마이크 사용', d: '30초 동안 너의 하루를 들어요' },
              { icon: '🔒', t: '안전한 저장', d: '암호화하여 너의 기기에만' },
              { icon: '🔔', t: '부드러운 알림', d: '하루 한 번, 뭉이가 안부 인사' },
            ].map((it, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 12px',
                background: S.peachFaint, border: `1px solid ${S.inkVeryFaint}`,
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 22 }}>{it.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 13 }}>{it.t}</div>
                  <div style={{ fontFamily: S.body, fontSize: 10, color: S.inkSoft, marginTop: 1 }}>{it.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => navigate('home')} style={{
            fontFamily: S.hand, fontSize: 13, color: S.inkFaint, cursor: 'pointer',
          }}>건너뛰기</div>
          <Btn primary onClick={() => isLast ? navigate('home') : setStep(p => p + 1)}>
            {isLast ? '시작하기 🎙' : '다음 →'}
          </Btn>
        </div>
      </div>
    </Phone>
  );
}

// 이번 주 컨디션 모달 데이터
const WEEK_VOICE_DATA = [
  { day: '월', pitch: 182, energy: 62, accuracy: 91, duration: 3.2, mood: '😌', score: 55 },
  { day: '화', pitch: 168, energy: 48, accuracy: 87, duration: 2.8, mood: '😔', score: 42 },
  { day: '수', pitch: 195, energy: 71, accuracy: 94, duration: 4.1, mood: '😊', score: 58 },
  { day: '목', pitch: 204, energy: 80, accuracy: 96, duration: 5.3, mood: '😄', score: 62 },
  { day: '금', pitch: null, energy: null, accuracy: null, duration: null, mood: null, score: null },
  { day: '토', pitch: null, energy: null, accuracy: null, duration: null, mood: null, score: null },
  { day: '일', pitch: null, energy: null, accuracy: null, duration: null, mood: null, score: null },
];

function WeekConditionModal({ onClose }) {
  const [selectedDay, setSelectedDay] = useState('목');
  const days = WEEK_VOICE_DATA.filter(d => d.pitch !== null);
  const sel = WEEK_VOICE_DATA.find(d => d.day === selectedDay) || days[0];
  const avgDur = (days.reduce((s, d) => s + d.duration, 0) / days.length).toFixed(1);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(42,39,36,0.55)',
      zIndex: 100, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div className="slide-up" onClick={e => e.stopPropagation()} style={{
        background: S.paper, borderRadius: '22px 22px 0 0',
        padding: '20px 18px 28px', maxHeight: '82%', overflowY: 'auto',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: S.inkVeryFaint, margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 18 }}>이번 주 컨디션 분석</div>
          <div onClick={onClose} style={{ fontFamily: S.hand, fontSize: 20, color: S.inkSoft, cursor: 'pointer' }}>×</div>
        </div>

        {/* Day selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {WEEK_VOICE_DATA.map(d => (
            <div key={d.day} onClick={() => d.pitch && setSelectedDay(d.day)} style={{
              flex: 1, textAlign: 'center', padding: '8px 0',
              borderRadius: 10,
              background: selectedDay === d.day ? S.ink : d.pitch ? '#fff' : S.inkVeryFaint,
              border: `1.5px solid ${selectedDay === d.day ? S.ink : S.inkVeryFaint}`,
              cursor: d.pitch ? 'pointer' : 'default',
              opacity: d.pitch ? 1 : 0.4,
            }}>
              <div style={{ fontSize: 14 }}>{d.mood || '—'}</div>
              <div style={{ fontFamily: S.hand, fontSize: 12, fontWeight: 700, marginTop: 2,
                color: selectedDay === d.day ? S.paper : S.ink }}>{d.day}</div>
            </div>
          ))}
        </div>

        {/* Selected day detail */}
        {sel && (
          <div className="screen-enter">
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15, color: S.peach, marginBottom: 10 }}>
              {sel.day}요일 상세 데이터
            </div>

            {/* 4 metric cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { label: '음성 피치', value: `${sel.pitch} Hz`, icon: '🎵', sub: '평균 대비 ' + (sel.pitch > 185 ? '↑ 높음' : '↓ 낮음') },
                { label: '에너지', value: `${sel.energy}%`, icon: '⚡', sub: sel.energy >= 70 ? '활기찬 상태' : '차분한 상태' },
                { label: '정확도', value: `${sel.accuracy}%`, icon: '🎯', sub: '음성 인식 품질' },
                { label: '대화 시간', value: `${sel.duration}분`, icon: '⏱', sub: `평균 ${avgDur}분 대비 ${sel.duration > parseFloat(avgDur) ? '↑ 길었어' : '↓ 짧았어'}` },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '12px 12px', background: '#fff',
                  border: `1px solid ${S.inkVeryFaint}`, borderRadius: 12,
                }}>
                  <div style={{ fontFamily: S.body, fontSize: 11, color: S.inkFaint, marginBottom: 4 }}>
                    {m.icon} {m.label}
                  </div>
                  <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 20, color: S.ink }}>{m.value}</div>
                  <div style={{ fontFamily: S.body, fontSize: 10, color: S.peach, marginTop: 3 }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* 컨디션 바 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 13 }}>종합 컨디션 점수</div>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16, color: S.peach }}>{sel.score}점</div>
              </div>
              <div style={{ height: 12, background: S.inkVeryFaint, borderRadius: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${sel.score}%`,
                  background: `linear-gradient(90deg, ${S.peachSoft}, ${S.peach})`,
                  borderRadius: 6, transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            {/* 뭉이 코멘트 */}
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '10px 12px', background: S.peachFaint,
              border: `1.5px dashed ${S.peachSoft}`, borderRadius: 12,
            }}>
              <Mascot size={28} mood="happy" />
              <div style={{ fontFamily: S.pen, fontSize: 13, color: S.ink, lineHeight: 1.5 }}>
                평소에는 나랑 {avgDur}분씩 대화하는데,{' '}
                {sel.duration > parseFloat(avgDur)
                  ? `오늘 같은 경우에는 벌써 ${sel.duration}분이나 대화했어. 나와의 대화를 좋아해줘서 너무 고마워 💛`
                  : `오늘은 ${sel.duration}분 대화했네. 더 하고 싶으면 언제든지 말 걸어 줘 💛`
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 3. HOME  (HomeB variant — card stack)
// ═══════════════════════════════════════════════════════════════════
function HomeScreen({ navigate }) {
  const [showConditionModal, setShowConditionModal] = useState(false);

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ padding: '14px 20px 8px' }}>
          <div style={{ fontFamily: S.hand, fontSize: 14, color: S.inkSoft }}>안녕, 현성아 👋</div>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 24, marginTop: 2 }}>오늘도 만나서 반가워</div>
        </div>

        {/* Today CTA */}
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <Card fill={S.paper} stroke={S.inkVeryFaint} radius={16} shadow>
            <div onClick={() => navigate('voice_chat')} style={{
              padding: '18px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontFamily: S.hand, fontSize: 14, color: S.inkFaint }}>오늘 어떻게 지냈어?</div>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 22, color: S.ink, marginTop: 4 }}>뭉이랑 대화 시작</div>
                <div style={{ marginTop: 12 }}>
                  <Btn sm style={{ background: S.peach, border: 'none', color: '#fff' }}>🎙 대화 시작하기</Btn>
                </div>
              </div>
              <div className="bounce">
                <Mascot size={62} mood="happy" fill="#fff" />
              </div>
            </div>
          </Card>
        </div>

        {/* Yesterday diary card */}
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <Card stroke={S.ink} radius={12}>
            <div style={{ padding: '14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15 }}>어제의 일기</div>
                <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft }}>4.10 · 목</div>
              </div>
              <div style={{
                fontFamily: S.pen, fontSize: 14, marginTop: 8,
                color: S.ink, lineHeight: 1.55,
              }}>
                "과제 마감이라 정신없었지만, 다 끝내고 친구랑 산책한 게 좋았어."
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
                <MoodPill emoji="😊" label="홀가분" color={S.peachFaint} />
                <MoodPill emoji="😴" label="피곤" color="#fff" />
              </div>
            </div>
          </Card>
        </div>

        {/* Week trend card — 탭하면 모달 */}
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <Card stroke={S.ink} radius={12} onClick={() => setShowConditionModal(true)}>
            <div style={{ padding: '14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15 }}>이번 주 컨디션</div>
                <div style={{ fontFamily: S.hand, fontSize: 13, color: S.sage }}>↑ 좋아지는 중 →</div>
              </div>
              <LineChart
                width={262} height={48}
                data={[0.55, 0.42, 0.58, 0.62, 0.7, 0.7, 0.7]}
                color={S.peach} fill={S.peachSoft}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: S.hand, fontSize: 11, color: S.inkSoft, marginTop: 6,
              }}>
                {['월','화','수','목','금','토','일'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div style={{ fontFamily: S.body, fontSize: 11, color: S.peach, marginTop: 6, textAlign: 'right' }}>
                탭하여 날짜별 상세 보기 →
              </div>
            </div>
          </Card>
        </div>

      </div>

      <TabBar active="home" onNav={navigate} />

      {/* 컨디션 모달 */}
      {showConditionModal && <WeekConditionModal onClose={() => setShowConditionModal(false)} />}
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. RECORDING  (RecordingA variant)
// ═══════════════════════════════════════════════════════════════════
function RecordingScreen({ navigate }) {
  const [secs, setSecs] = useState(30);
  const [phase, setPhase] = useState('ready'); // ready | recording | done
  const timerRef = useRef(null);

  const startRecording = () => {
    setPhase('recording');
    timerRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setPhase('done');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(() => navigate('processing'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const progress = (30 - secs) / 30;

  return (
    <Phone>
      <div className="screen-enter" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '12px 24px 20px', alignItems: 'center',
      }}>
        {/* Top bar */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div onClick={() => { clearInterval(timerRef.current); navigate('home'); }}
            style={{ fontFamily: S.hand, fontSize: 20, cursor: 'pointer', color: S.inkSoft }}>×</div>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 13, color: S.inkSoft }}>
            {phase === 'ready' ? '준비됐어?' : phase === 'recording' ? '듣고 있어요' : '완료!'}
          </div>
          <div style={{ width: 24 }} />
        </div>

        <div style={{ fontFamily: S.pen, fontSize: 15, color: S.inkSoft, textAlign: 'center', marginBottom: 8 }}>
          {phase === 'ready' ? '탭해서 시작해봐' : phase === 'recording' ? '편하게 말해도 괜찮아요' : '잘했어! 정리할게 ✨'}
        </div>

        {/* Big breathing circle */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Pulse rings */}
            {phase === 'recording' && <>
              <div style={{
                position: 'absolute', width: 220, height: 220, borderRadius: '50%',
                border: `1px solid ${S.peachSoft}`,
                animation: 'pulse-ring 2s ease-out infinite',
              }} />
              <div style={{
                position: 'absolute', width: 190, height: 190, borderRadius: '50%',
                border: `1px dashed ${S.peach}`,
                animation: 'pulse-ring 2s 0.4s ease-out infinite',
              }} />
            </>}

            {/* SVG arc progress */}
            <svg width={220} height={220} style={{ position: 'absolute' }}>
              <circle cx={110} cy={110} r={98} fill="none" stroke={S.inkVeryFaint} strokeWidth="3" />
              {phase !== 'ready' && (
                <circle cx={110} cy={110} r={98} fill="none"
                  stroke={phase === 'done' ? S.sage : S.peach} strokeWidth="3.5"
                  strokeDasharray={`${progress * 615} 615`}
                  strokeLinecap="round"
                  transform="rotate(-90 110 110)"
                  style={{ transition: 'stroke-dasharray 0.5s' }}
                />
              )}
            </svg>

            {/* Center button */}
            <div onClick={phase === 'ready' ? startRecording : undefined} style={{
              width: 130, height: 130, borderRadius: '50%',
              background: phase === 'done' ? S.sage : S.peach,
              border: `2px solid ${S.ink}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: phase === 'ready' ? 'pointer' : 'default',
              boxShadow: '3px 3px 0 rgba(42,39,36,0.2)',
              transition: 'all 0.3s',
              WebkitTapHighlightColor: 'transparent',
            }}>
              {phase === 'ready' && (
                <>
                  <div style={{ fontSize: 28 }}>🎙</div>
                  <div style={{ fontFamily: S.hand, fontSize: 12, color: '#fff', marginTop: 4 }}>탭하여 시작</div>
                </>
              )}
              {phase === 'recording' && (
                <>
                  <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 30, color: '#fff', lineHeight: 1 }}>
                    {mm}:{ss}
                  </div>
                  <div style={{ fontFamily: S.body, fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                    남은 {secs}초
                  </div>
                </>
              )}
              {phase === 'done' && (
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16, color: '#fff', textAlign: 'center' }}>
                  완료!<br/>✓
                </div>
              )}
            </div>
          </div>

          {/* Waveform */}
          <div style={{ opacity: phase === 'recording' ? 1 : 0.25, transition: 'opacity 0.3s' }}>
            {phase === 'recording'
              ? <LiveWaveform width={230} height={40} color={S.ink} />
              : <Waveform width={230} height={40} bars={32} seed={3.1} color={S.ink} />
            }
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div onClick={() => { clearInterval(timerRef.current); navigate('home'); }}
            style={{
              width: 46, height: 46, borderRadius: '50%',
              border: `1.5px solid ${S.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 16,
            }}>↻</div>
          {phase === 'recording' && (
            <div onClick={() => { clearInterval(timerRef.current); navigate('processing'); }}
              style={{
                width: 58, height: 58, borderRadius: '50%',
                background: S.warn, border: `2px solid ${S.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16, color: '#fff',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.15)',
              }}>■</div>
          )}
          {phase === 'ready' && (
            <div style={{ width: 58, height: 58 }} />
          )}
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 5. PROCESSING  (AI 분석 중)
// ═══════════════════════════════════════════════════════════════════
function ProcessingScreen({ navigate }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = [
    '목소리 분석 중...',
    '감정 패턴 읽는 중...',
    '일기 생성 중...',
    '거의 다 됐어! ✨',
  ];

  useEffect(() => {
    const t1 = setInterval(() => setMsgIdx(i => Math.min(i + 1, msgs.length - 1)), 600);
    const t2 = setTimeout(() => navigate('diary'), 2600);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, []);

  return (
    <Phone>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        {/* Spinning mascot glow */}
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(circle, ${S.peachSoft} 0%, transparent 70%)`,
            filter: 'blur(12px)',
            animation: 'bounce 2s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mascot size={110} mood="talking" />
          </div>
          {/* Spinning ring */}
          <svg width={140} height={140} style={{ position: 'absolute', inset: 0, animation: 'spin 2s linear infinite' }}>
            <circle cx={70} cy={70} r={66} fill="none"
              stroke={S.peach} strokeWidth="2"
              strokeDasharray="40 20 20 80" strokeLinecap="round"
            />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 18, color: S.ink, marginBottom: 6 }}>
            뭉이가 정리하고 있어요
          </div>
          <div key={msgIdx} className="screen-enter" style={{ fontFamily: S.pen, fontSize: 15, color: S.peach }}>
            {msgs[msgIdx]}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: 200, height: 6, background: S.inkVeryFaint, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((msgIdx + 1) / msgs.length) * 100}%`,
            background: S.peach, borderRadius: 3,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 6. DIARY RESULT  (DiaryB variant)
// ═══════════════════════════════════════════════════════════════════
function DiaryScreen({ navigate }) {
  const [saved, setSaved] = useState(false);

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', paddingBottom: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div onClick={() => navigate('home')} style={{ fontFamily: S.hand, fontSize: 16, cursor: 'pointer' }}>←</div>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 14, color: S.peach }}>
            {saved ? '저장됐어! 🎉' : '일기 완성!'}
          </div>
          <div style={{ fontFamily: S.hand, fontSize: 14, color: S.inkFaint }}>↗</div>
        </div>

        {/* Date + title */}
        <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft }}>4월 11일 금요일 · 오후 8:24</div>
        <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 20, marginTop: 2, marginBottom: 10 }}>
          시험 끝, 떡볶이 한 그릇 🍜
        </div>

        {/* Mood pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <MoodPill emoji="😌" label="홀가분" color={S.peachFaint} />
          <MoodPill emoji="😴" label="피곤" color="#fff" />
          <MoodPill emoji="🫂" label="안정" color={S.sageSoft} />
        </div>

        {/* Diary body */}
        <div style={{
          fontFamily: S.pen, fontSize: 15, lineHeight: 1.6, color: S.ink, marginBottom: 16,
        }}>
          시험을 하나 더 끝냈다. 도서관 앞에서 친구를 만났고 즉흥적으로 떡볶이집에 갔다.{' '}
          매운 걸 먹으니 정신이 들었다.{' '}
          <Hl color={S.sageSoft}>친구가 농담하는데 진심으로 웃은 게 오랜만</Hl>
          이었다. 집에 와서는 좀 멍하니 있었다.
        </div>

        {/* Key moments */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft, marginBottom: 8 }}>오늘의 순간들</div>
          {[
            { t: '14:30', m: '시험 종료' },
            { t: '15:10', m: '친구와 떡볶이 🍢' },
            { t: '18:00', m: '집 도착, 멍 때리기' },
          ].map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: `0.5px dashed ${S.inkVeryFaint}`,
            }}>
              <div style={{ fontFamily: S.hand, fontSize: 11, color: S.peach, width: 40 }}>{it.t}</div>
              <div style={{ fontFamily: S.body, fontSize: 13 }}>{it.m}</div>
            </div>
          ))}
        </div>

        {/* Voice analysis mini */}
        <div style={{
          padding: '10px 12px', background: '#fff',
          border: `1px solid ${S.inkVeryFaint}`, borderRadius: 10, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft }}>음성 분석</div>
            <div onClick={() => navigate('dashboard')} style={{
              fontFamily: S.hand, fontSize: 11, color: S.peach, cursor: 'pointer',
            }}>자세히 →</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { l: '우울도', v: '24 ↓', c: S.peach },
              { l: '목소리 떨림', v: '안정', c: S.sage },
              { l: '어제 대비', v: '+12%', c: S.sage },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft }}>{m.l}</div>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15, color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn width={132} onClick={() => navigate('recording')}>다시 녹음</Btn>
          <Btn primary width={132} onClick={() => setSaved(true)}>
            {saved ? '✓ 저장됨' : '일기장에 저장'}
          </Btn>
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 7. CHAT  (FriendA variant — 뭉이와 대화)
// ═══════════════════════════════════════════════════════════════════
const CHAT_SCRIPT = [
  { from: 'mung', mood: 'happy', text: '오늘 어땠어? 뭉이한테 얘기해봐 😊', chips: ['좋았어', '힘들었어', '그냥 그랬어'] },
  { from: 'mung', mood: 'talking', text: '그렇구나... 좀 더 얘기해줄 수 있어?', chips: ['응 사실은 많이 지쳤어', '다 괜찮아', '말하기 어려워'] },
  { from: 'mung', mood: 'worried', text: '많이 지쳤구나. 어떤 부분이 제일 힘들었어?', chips: ['사람들 신경 쓰느라', '공부가 너무 많아', '그냥 다 버거워'] },
  { from: 'mung', mood: 'happy', text: '그 마음 충분히 이해해. 오늘 나한테 말해줘서 고마워 💛\n대화를 정리해볼까?', chips: ['응, 정리해줘', '조금 더 얘기할게'] },
];

function ChatScreen({ navigate }) {
  const [messages, setMessages] = useState([
    { id: 0, from: 'mung', mood: 'happy', text: '오늘 어땠어? 뭉이한테 얘기해봐 😊' },
  ]);
  const [scriptStep, setScriptStep] = useState(0);
  const [chips, setChips] = useState(CHAT_SCRIPT[0].chips);
  const [input, setInput] = useState('');
  const [showSummaryBtn, setShowSummaryBtn] = useState(false);
  const [tone, setTone] = useState('반말');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChips([]);

    const nextStep = scriptStep + 1;

    // Check for summary trigger
    if (text.includes('정리해줘') || text.includes('정리') || nextStep >= CHAT_SCRIPT.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1, from: 'mung', mood: 'happy',
          text: '알겠어! 오늘 대화를 일기로 정리해줄게 📝',
        }]);
        setChips([]);
        setShowSummaryBtn(true);
      }, 800);
      return;
    }

    // Next script response
    const next = CHAT_SCRIPT[nextStep];
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'mung', mood: next.mood, text: next.text,
      }]);
      setChips(next.chips);
      setScriptStep(nextStep);
    }, 800);
  }, [scriptStep]);

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '6px 16px 10px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: `1px dashed ${S.inkVeryFaint}`,
        }}>
          <div onClick={() => navigate('home')} style={{ fontFamily: S.hand, fontSize: 18, cursor: 'pointer' }}>←</div>
          <Mascot size={36} mood="happy" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15 }}>뭉이</div>
            <div style={{ fontFamily: S.body, fontSize: 10, color: S.sage }}>● 오늘도 옆에 있어</div>
          </div>
          {/* Tone toggle */}
          <div style={{
            display: 'flex', border: `1.5px solid ${S.ink}`, borderRadius: 16, overflow: 'hidden',
            fontFamily: S.hand, fontSize: 10,
          }}>
            {['반말', '존댓말'].map(t => (
              <div key={t} onClick={() => setTone(t)} style={{
                padding: '4px 8px',
                background: tone === t ? S.ink : 'transparent',
                color: tone === t ? S.paper : S.inkSoft,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ textAlign: 'center', fontFamily: S.hand, fontSize: 11, color: S.inkSoft, marginBottom: 4 }}>
            오늘 오후 8:30
          </div>

          {messages.map(msg => (
            <div key={msg.id} className="screen-enter" style={{
              display: 'flex',
              flexDirection: msg.from === 'mung' ? 'row' : 'row-reverse',
              alignItems: 'flex-end', gap: 6,
            }}>
              {msg.from === 'mung' && <Mascot size={26} mood={msg.mood || 'happy'} />}
              <div style={{
                maxWidth: 210,
                background: msg.from === 'mung' ? S.sageSoft : S.ink,
                color: msg.from === 'mung' ? S.ink : S.paper,
                padding: '9px 13px',
                borderRadius: msg.from === 'mung' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                fontFamily: S.pen, fontSize: 14, lineHeight: 1.45,
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Quick reply chips */}
          {chips.length > 0 && (
            <div className="screen-enter" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingLeft: 32, marginTop: 2 }}>
              {chips.map(c => (
                <div key={c} onClick={() => sendMessage(c)} style={{
                  padding: '6px 12px',
                  border: `1.5px solid ${S.ink}`, borderRadius: 999,
                  fontFamily: S.hand, fontSize: 12,
                  background: '#fff', cursor: 'pointer',
                  boxShadow: '1px 1px 0 rgba(42,39,36,0.1)',
                  WebkitTapHighlightColor: 'transparent',
                }}>{c}</div>
              ))}
            </div>
          )}

          {/* Summary button */}
          {showSummaryBtn && (
            <div className="screen-enter" style={{ marginTop: 8 }}>
              <Btn primary width="100%" onClick={() => navigate('conv_diary')} style={{ width: '100%' }}>
                📝 오늘 대화 일기로 정리하기 →
              </Btn>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center', borderTop: `1px solid ${S.inkVeryFaint}` }}>
          <div style={{
            flex: 1, height: 38,
            border: `1.5px solid ${S.ink}`, borderRadius: 19,
            display: 'flex', alignItems: 'center', padding: '0 12px',
            background: '#fff',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="뭉이에게 말 걸기..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: S.pen, fontSize: 13, color: S.ink,
              }}
            />
          </div>
          <div onClick={() => sendMessage(input)} style={{
            width: 38, height: 38, borderRadius: '50%',
            background: S.peach, border: `1.5px solid ${S.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16,
          }}>↑</div>
        </div>
      </div>

      <TabBar active="chat" onNav={navigate} />
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 8. CONVERSATION DIARY  ★ 새 기능 ★
//    뭉이와의 대화 → 일기 + 감정 상태 자동 생성
// ═══════════════════════════════════════════════════════════════════
function ConvDiaryScreen({ navigate }) {
  const [activeTab, setActiveTab] = useState('diary');
  const [saved, setSaved] = useState(false);

  // 실제 저장된 대화 데이터 읽기 (없으면 mock)
  const diary = window.__lastDiary || {
    date: '5월 29일 목요일',
    turns: [
      {
        userText: '괜찮아,,',
        ser: { anxiety: 62, stability: 30, energy: 20, insights: [
          { text: '목소리가 많이 가라앉아 있어', icon: '🌧' },
          { text: '말이 느려지고 있어', icon: '🌙' },
          { text: '우울감이 느껴져', icon: '💙' },
        ]},
      },
      {
        userText: '아.. 내 기분 어떻게 알았어..?',
        ser: { anxiety: 68, stability: 28, energy: 24, insights: [
          { text: '목소리에 무거움이 느껴져', icon: '🌧' },
          { text: '말끝이 흐려지고 있어', icon: '🌙' },
          { text: '감정을 숨기려는 것 같아', icon: '💙' },
        ]},
      },
      {
        userText: '오늘 사실.... 여자친구랑 헤어졌어.',
        ser: { anxiety: 88, stability: 14, energy: 22, insights: [
          { text: '목소리가 많이 떨리고 있어', icon: '🌊' },
          { text: '말이 끊기고 있어', icon: '💔' },
          { text: '깊은 슬픔이 느껴져', icon: '😢' },
        ]},
      },
      {
        userText: '웅 알았어... 오늘 여기까지만 말할게 안녕~',
        ser: { anxiety: 58, stability: 42, energy: 30, insights: [
          { text: '목소리가 조금 안정됐어', icon: '🌱' },
          { text: '마음을 내려놓으려는 것 같아', icon: '🌙' },
          { text: '오늘 잘 이야기해줬어', icon: '🤍' },
        ]},
      },
    ],
    avgAnxiety: 69, avgStability: 29, firstAnxiety: 62, lastAnxiety: 58,
  };

  const turns = diary.turns;
  const firstSer = turns[0]?.ser;
  const lastSer  = turns[turns.length - 1]?.ser;

  // 감정 태그 — SER 인사이트 + 이별 감지 태그
  const baseTags = turns.flatMap(t => t.ser.insights.map(i => i.text))
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
  const emotionTags = hasBreakup
    ? ['이별의 아픔', '깊은 슬픔', ...baseTags].slice(0, 4)
    : baseTags.slice(0, 4);

  // 감정 변화 계산
  const anxietyDrop = (firstSer?.anxiety ?? 50) - (lastSer?.anxiety ?? 50);
  const stabilityRise = (lastSer?.stability ?? 50) - (firstSer?.stability ?? 50);
  const recovered = anxietyDrop > 0;

  // 이별 대화 포함 여부 감지
  const hasBreakup = turns.some(t => t.userText?.includes('헤어') || t.userText?.includes('이별'));
  const breakupLine = turns.find(t => t.userText?.includes('헤어') || t.userText?.includes('이별'))?.userText || '';
  const firstLine = turns[0]?.userText || '';
  const lastLine = turns[turns.length - 1]?.userText || '';

  const diaryLetter = hasBreakup ? {
    intro: `오늘 많이 힘든 하루였어. 뭉이한테 겨우 꺼냈지.`,
    hl1: breakupLine,
    mid: `말하는 것도 쉽지 않았을 텐데, 용기 내줘서 고마워.`,
    hl2: `지금 이 감정은 당연한 거야. 슬픔도, 혼란스러움도 전부.`,
    end: `오늘 밤은 그냥 많이 울어도 돼. 뭉이는 항상 여기 있을게.`,
  } : {
    intro: `오늘 뭉이한테 솔직하게 털어놨어.`,
    hl1: firstLine,
    mid: recovered ? `말하면서 조금 가벼워졌던 거 느꼈어?` : `쉽지 않았을 텐데 용기 내줬어.`,
    hl2: lastLine,
    end: recovered
      ? `그냥 오늘 많이 버텼고, 그게 힘들었던 거야. 내일은 좀 쉬어가도 돼.`
      : `이상한 게 아니야. 지쳐있는 게 느껴지면 그냥 쉬어도 돼.`,
  };

  const emotionDimensions = [
    { label: '불안', before: firstSer?.anxiety ?? 60, after: Math.max(10, (firstSer?.anxiety ?? 60) - 20), color: S.peach },
    { label: '안정감', before: firstSer?.stability ?? 40, after: Math.min(90, (firstSer?.stability ?? 40) + 20), color: '#8ec6c5' },
    { label: '자기수용', before: 30, after: 60, color: S.sage },
    { label: '회복감', before: 20, after: Math.min(80, 20 + Math.abs(anxietyDrop) * 1.5), color: '#c4a8d8' },
  ];

  // 감정 강도 = 불안도 그대로 표시 (높을수록 격한 감정)
  const emotionArc = turns.map((t, i) => ({
    label: i === 0 ? '시작' : i === turns.length - 1 ? '마무리' : `${i+1}번째`,
    emoji: t.ser.anxiety > 75 ? '😢' : t.ser.anxiety > 55 ? '😟' : '😐',
    score: t.ser.anxiety,  // 불안도 높을수록 막대 높음
    color: t.ser.anxiety > 75 ? '#e07b7b' : t.ser.anxiety > 55 ? S.peach : S.sageSoft,
  }));

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '8px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => navigate('archive')} style={{ fontFamily: S.hand, fontSize: 16, cursor: 'pointer' }}>←</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 14 }}>뭉이와의 대화 일기</div>
            <div style={{ fontFamily: S.body, fontSize: 10, color: S.inkFaint }}>4월 11일 · 오후 8:30</div>
          </div>
          <div style={{ fontFamily: S.hand, fontSize: 13, color: S.inkFaint }}>···</div>
        </div>

        {/* Tab switcher */}
        <div style={{
          margin: '0 16px 12px',
          display: 'flex',
          border: `1.5px solid ${S.ink}`, borderRadius: 999, padding: 3, background: '#fff',
        }}>
          {['diary', 'emotion'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, textAlign: 'center', padding: '6px 0',
              fontFamily: S.hand, fontSize: 12, fontWeight: 700,
              background: activeTab === tab ? S.ink : 'transparent',
              color: activeTab === tab ? S.paper : S.inkSoft,
              borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {tab === 'diary' ? '📔 일기' : '💭 감정 분석'}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {activeTab === 'diary' ? (
            /* ─── DIARY TAB ─── */
            <div className="screen-enter">
              {/* Mascot + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Mascot size={42} mood="happy" />
                <div>
                  <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16 }}>뭉이가 정리한 오늘</div>
                  <div style={{ fontFamily: S.body, fontSize: 10, color: S.inkSoft }}>대화를 바탕으로 만들었어</div>
                </div>
              </div>

              {/* Diary text */}
              <div style={{
                background: '#fffdf8', border: `1.5px solid ${S.ink}`,
                borderRadius: 12, padding: '14px 14px', marginBottom: 14,
                fontFamily: S.pen, fontSize: 14, lineHeight: 1.65, color: S.ink,
              }}>
                <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 12, color: S.peach, marginBottom: 6 }}>
                  현성에게,
                </div>
                {diaryLetter.intro}{' '}
                <Hl color={S.peachSoft}>{diaryLetter.hl1}</Hl>
                {' '}{diaryLetter.mid}{' '}
                <br/><br/>
                <Hl color={S.sageSoft}>{diaryLetter.hl2}</Hl>
                {' '}{diaryLetter.end}
                <br/><br/>
                <span style={{ fontFamily: S.hand, fontSize: 12, color: S.peach }}>— 뭉이가</span>
              </div>

              {/* Emotion tags */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft, marginBottom: 6 }}>오늘의 감정 태그</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {emotionTags.map((tag, i) => {
                    const tagColors = [S.peachFaint, S.sageSoft, '#e8d4f0', '#d4eaf0'];
                    return (
                      <div key={i} style={{
                        padding: '4px 10px',
                        background: tagColors[i % tagColors.length], border: `1px solid ${S.inkVeryFaint}`, borderRadius: 999,
                        fontFamily: S.hand, fontSize: 12,
                      }}>#{tag}</div>
                    );
                  })}
                </div>
              </div>

              {/* Key sentences from conversation */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft, marginBottom: 6 }}>대화에서 나온 중요한 순간</div>
                {turns.map((t, i) => {
                  const noteLabels = ['처음 솔직하게 말한 순간', '감정을 더 꺼낸 것', '대화를 이어간 용기'];
                  return t.userText && t.userText !== '...' ? (
                    <div key={i} style={{
                      padding: '8px 12px', marginBottom: 6,
                      background: '#fff', border: `1px dashed ${S.inkVeryFaint}`, borderRadius: 8,
                    }}>
                      <div style={{ fontFamily: S.pen, fontSize: 14, color: S.ink }}>"{t.userText}"</div>
                      <div style={{ fontFamily: S.body, fontSize: 10, color: S.peach, marginTop: 2 }}>
                        {noteLabels[i] || `${i+1}번째 대화`}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : (
            /* ─── EMOTION TAB ─── */
            <div className="screen-enter">
              {/* Emotional arc */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft, marginBottom: 4 }}>대화 중 감정 강도</div>
                <div style={{ fontFamily: S.body, fontSize: 10, color: S.inkFaint, marginBottom: 10 }}>막대가 높을수록 감정이 격해진 상태</div>
                <div style={{
                  display: 'flex', alignItems: 'flex-end', gap: 4,
                  padding: '12px 0', justifyContent: 'space-between',
                }}>
                  {emotionArc.map((a, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 18 }}>{a.emoji}</div>
                      <div style={{
                        width: '100%', height: (a.score / 100) * 80,
                        background: a.color, border: `1px solid ${S.ink}`, borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease',
                        minHeight: 8,
                      }} />
                      <div style={{ fontFamily: S.hand, fontSize: 9, color: S.inkSoft, textAlign: 'center', lineHeight: 1.2 }}>
                        {a.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before / After dimensions */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: S.hand, fontSize: 12, color: S.inkSoft, marginBottom: 8,
                }}>
                  <span>감정 변화 (대화 전 → 후)</span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
                    <span>◻ 전</span><span>◼ 후</span>
                  </div>
                </div>
                {emotionDimensions.map((d, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontFamily: S.hand, fontSize: 12, marginBottom: 4,
                    }}>
                      <span>{d.label}</span>
                      <span style={{ color: d.before > d.after ? S.sage : S.peach, fontSize: 11 }}>
                        {d.before > d.after ? `↓ ${d.before - d.after}` : `↑ ${d.after - d.before}`}
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: 10, background: S.inkVeryFaint, borderRadius: 5 }}>
                      {/* Before bar */}
                      <div style={{
                        position: 'absolute', left: 0, top: 0,
                        width: `${d.before}%`, height: '100%',
                        background: `${d.color}66`, borderRadius: 5,
                      }} />
                      {/* After bar */}
                      <div style={{
                        position: 'absolute', left: 0, top: 0,
                        width: `${d.after}%`, height: '100%',
                        background: d.color, borderRadius: 5,
                        border: `1px solid ${S.ink}`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 뭉이's summary comment */}
              <div style={{
                padding: '12px 14px',
                background: S.peachFaint, border: `1.5px solid ${S.ink}`,
                borderRadius: 12, marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Mascot size={26} mood="happy" />
                  <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 12, color: S.peach }}>뭉이의 한마디</div>
                </div>
                <div style={{ fontFamily: S.pen, fontSize: 14, lineHeight: 1.5, color: S.ink }}>
                  {hasBreakup
                    ? `여자친구와 헤어진 게 많이 힘들었겠다. 그 말을 꺼내는 것만으로도 정말 용감했어. 오늘 밤은 푹 쉬어 💛`
                    : recovered
                      ? `대화 전보다 불안이 ${Math.abs(anxietyDrop)}pt 줄었어. 말로 꺼냈을 때 마음이 정리됐던 것 같아. 잘했어 💛`
                      : `오늘 많이 힘들었던 것 같아. 그래도 뭉이한테 말해줘서 고마워. 쉬어가도 돼 💛`
                  }
                </div>
              </div>

              {/* Overall score */}
              <div style={{
                display: 'flex', justifyContent: 'space-around',
                padding: '12px', background: '#fff',
                border: `1px solid ${S.inkVeryFaint}`, borderRadius: 10, marginBottom: 20,
              }}>
                {[
                  { l: '대화 전 감정점수', v: String(Math.round(100 - (firstSer?.anxiety ?? 60) * 0.6 + (firstSer?.stability ?? 40) * 0.4)), c: S.peach },
                  { l: '대화 후 감정점수', v: String(Math.round(100 - (lastSer?.anxiety ?? 60) * 0.6 + (lastSer?.stability ?? 40) * 0.4)), c: S.sage },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft }}>{m.l}</div>
                    <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 26, color: m.c }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div style={{ padding: '10px 16px', borderTop: `1px solid ${S.inkVeryFaint}` }}>
          <Btn primary width="100%" height={44} onClick={() => setSaved(true)} style={{ width: '100%' }}>
            {saved ? '✓ 일기장에 저장됨' : '📔 일기장에 저장하기'}
          </Btn>
        </div>
      </div>

      <TabBar active="chat" onNav={navigate} />
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 9. GARDEN PROFILE (마음 정원 — 출석 기반 식물 가꾸기)
// ═══════════════════════════════════════════════════════════════════
function DashboardScreen({ navigate }) {
  const streak = 12;
  const bestDay = '목요일';

  // stage: 0=완전 시들, 1=살짝 시들, 2=보통, 3=활짝 핌
  const weekData = [
    { day: '월', stage: 3, color: '#e8a087' },
    { day: '화', stage: 1, color: '#c8c090' },
    { day: '수', stage: 3, color: '#7aba78' },
    { day: '목', stage: 3, color: '#f9a8b0' },
    { day: '금', stage: 0, color: '#bbb' },
    { day: '토', stage: 2, color: '#b3c5a3' },
    { day: '일', stage: 0, color: '#bbb' },
  ];

  function Plant({ stage, color, x, day }) {
    // stage 0 — 완전 시들: 구부러진 줄기, 노란 잎
    if (stage === 0) return (
      <g transform={`translate(${x}, 0)`}>
        <ellipse cx="0" cy="89" rx="8" ry="3" fill="#b09070" opacity="0.4"/>
        {/* 구부러진 줄기 */}
        <path d="M0,88 Q3,75 1,65 Q-1,58 2,52" fill="none" stroke="#b0a070" strokeWidth="2.5" strokeLinecap="round"/>
        {/* 축 처진 잎 */}
        <ellipse cx="-4" cy="62" rx="8" ry="3.5" fill="#c8c080" opacity="0.55" transform="rotate(40,-4,62)"/>
        <ellipse cx="5" cy="68" rx="7" ry="3" fill="#c8c080" opacity="0.45" transform="rotate(-50,5,68)"/>
        {/* 시든 꽃봉오리 */}
        <ellipse cx="2" cy="50" rx="3.5" ry="2.5" fill="#c8b080" opacity="0.5" transform="rotate(-15,2,50)"/>
        <text x="0" y="100" textAnchor="middle" fontSize="7.5" fill="#bbb" fontFamily="Gaegu, cursive">{day}</text>
      </g>
    );

    // stage 1 — 살짝 시들: 약간 기운 없음
    if (stage === 1) return (
      <g transform={`translate(${x}, 0)`}>
        <ellipse cx="0" cy="89" rx="10" ry="4" fill="#a08060" opacity="0.4"/>
        <path d="M0,88 Q1,76 0,64 Q-1,58 0,52" fill="none" stroke="#7a9050" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="-8" cy="68" rx="9" ry="4" fill={color} opacity="0.6" transform="rotate(15,-8,68)"/>
        <ellipse cx="8" cy="70" rx="8" ry="3.5" fill={color} opacity="0.55" transform="rotate(-10,8,70)"/>
        <ellipse cx="0" cy="57" rx="6" ry="4" fill={color} opacity="0.65"/>
        {/* 작은 꽃 — 반쯤 닫힘 */}
        {[0,90,180,270].map((a,i) => (
          <ellipse key={i}
            cx={Math.round(Math.cos(a*Math.PI/180)*5)}
            cy={Math.round(50+Math.sin(a*Math.PI/180)*5)}
            rx="3.5" ry="2" fill={color} opacity="0.65"
            transform={`rotate(${a},${Math.round(Math.cos(a*Math.PI/180)*5)},${Math.round(50+Math.sin(a*Math.PI/180)*5)})`}
          />
        ))}
        <circle cx="0" cy="50" r="3" fill="#e8e0c0"/>
        <text x="0" y="100" textAnchor="middle" fontSize="7.5" fill="#999" fontFamily="Gaegu, cursive">{day}</text>
      </g>
    );

    // stage 2 — 보통: 건강하게 자람
    if (stage === 2) return (
      <g transform={`translate(${x}, 0)`}>
        <ellipse cx="0" cy="89" rx="13" ry="5" fill="#8B6914" opacity="0.4"/>
        <rect x="-2.5" y="50" width="5" height="39" rx="2.5" fill="#4a8a30"/>
        <ellipse cx="-12" cy="64" rx="11" ry="7" fill={color} opacity="0.82" transform="rotate(-20,-12,64)"/>
        <ellipse cx="12" cy="66" rx="10" ry="6" fill={color} opacity="0.75" transform="rotate(18,12,66)"/>
        <ellipse cx="0" cy="56" rx="9" ry="6.5" fill={color} opacity="0.88"/>
        {[0,72,144,216,288].map((a,i) => (
          <ellipse key={i}
            cx={Math.round(Math.cos(a*Math.PI/180)*8)}
            cy={Math.round(44+Math.sin(a*Math.PI/180)*8)}
            rx="5" ry="3" fill={color} opacity="0.8"
            transform={`rotate(${a},${Math.round(Math.cos(a*Math.PI/180)*8)},${Math.round(44+Math.sin(a*Math.PI/180)*8)})`}
          />
        ))}
        <circle cx="0" cy="44" r="4.5" fill="#fff" opacity="0.9"/>
        <circle cx="0" cy="44" r="2.5" fill={color}/>
        <text x="0" y="100" textAnchor="middle" fontSize="7.5" fill="#777" fontFamily="Gaegu, cursive">{day}</text>
      </g>
    );

    // stage 3 — 활짝: 크고 풍성한 꽃
    return (
      <g transform={`translate(${x}, 0)`}>
        <ellipse cx="0" cy="89" rx="17" ry="7" fill="#8B6914" opacity="0.5"/>
        {/* 굵은 줄기 */}
        <rect x="-3.5" y="30" width="7" height="59" rx="3.5" fill="#3d7020"/>
        {/* 풍성한 잎 */}
        <ellipse cx="-16" cy="52" rx="14" ry="9" fill="#5a9a30" opacity="0.75" transform="rotate(-35,-16,52)"/>
        <ellipse cx="16" cy="55" rx="13" ry="8" fill="#5a9a30" opacity="0.7" transform="rotate(30,16,55)"/>
        <ellipse cx="-10" cy="68" rx="10" ry="6" fill="#4a8a28" opacity="0.6" transform="rotate(-20,-10,68)"/>
        <ellipse cx="10" cy="70" rx="9" ry="5.5" fill="#4a8a28" opacity="0.55" transform="rotate(22,10,70)"/>
        {/* 큰 꽃잎 6장 */}
        {[0,60,120,180,240,300].map((a,i) => (
          <ellipse key={i}
            cx={Math.round(Math.cos(a*Math.PI/180)*12)}
            cy={Math.round(26+Math.sin(a*Math.PI/180)*12)}
            rx="8" ry="4.5" fill={color}
            transform={`rotate(${a},${Math.round(Math.cos(a*Math.PI/180)*12)},${Math.round(26+Math.sin(a*Math.PI/180)*12)})`}
            opacity="0.92"
          />
        ))}
        {/* 꽃 중심 */}
        <circle cx="0" cy="26" r="6.5" fill="#fff" opacity="0.95"/>
        <circle cx="0" cy="26" r="4" fill={color}/>
        <circle cx="0" cy="26" r="1.8" fill="#fff" opacity="0.8"/>
        <text x="0" y="100" textAnchor="middle" fontSize="7.5" fill="#555" fontFamily="Gaegu, cursive">{day}</text>
      </g>
    );
  }

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 24 }}>너의 마음 정원</div>
          <div style={{ fontFamily: S.hand, fontSize: 13, color: S.inkSoft }}>···</div>
        </div>
        <div style={{ fontFamily: S.hand, fontSize: 14, color: S.sage, marginBottom: 14 }}>
          {streak}일 동안 꾸준히 가꿔왔어요 🌿
        </div>

        {/* Garden scene — 더 큰 높이로 드라마틱하게 */}
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          border: `1.5px solid ${S.inkVeryFaint}`,
          marginBottom: 10,
          background: 'linear-gradient(180deg, #d8ecd0 0%, #c8e0b8 55%, #b8d4a0 80%, #c4a870 100%)',
        }}>
          <svg width="288" height="130" viewBox="0 0 288 130" style={{ display: 'block' }}>
            {/* 하늘 구름 */}
            <ellipse cx="50" cy="18" rx="22" ry="10" fill="#fff" opacity="0.35"/>
            <ellipse cx="220" cy="14" rx="18" ry="8" fill="#fff" opacity="0.25"/>
            {/* 땅 */}
            <rect x="0" y="108" width="288" height="22" fill="#c4a870"/>
            <path d="M0,106 Q72,102 144,107 Q216,112 288,106 L288,130 L0,130 Z" fill="#b89060" opacity="0.5"/>
            {/* Plants */}
            {weekData.map((d, i) => (
              <Plant key={i} stage={d.stage} color={d.color} x={22 + i * 36} day={d.day} />
            ))}
          </svg>
        </div>

        {/* 범례 */}
        <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft, textAlign: 'center', marginBottom: 14 }}>
          🌸 꽃 크기 = 컨디션 · 시든 꽃 = 힘든 날
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Card fill={S.paper} stroke={S.inkVeryFaint} radius={12} style={{ flex: 1 }}>
            <div style={{ padding: '12px 12px' }}>
              <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft, marginBottom: 4 }}>이번 주 평균</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 20 }}>🌿</span>
                <span style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15, color: S.sage }}>자라는 중</span>
              </div>
            </div>
          </Card>
          <Card fill={S.paper} stroke={S.inkVeryFaint} radius={12} style={{ flex: 1 }}>
            <div style={{ padding: '12px 12px' }}>
              <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft, marginBottom: 4 }}>가장 빛난 날</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 20 }}>🌸</span>
                <span style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15, color: S.peach }}>{bestDay}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 뭉이 코멘트 */}
        <Card fill={S.paper} stroke={S.inkVeryFaint} radius={12} shadow style={{ marginBottom: 16 }}>
          <div style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Mascot size={34} mood="happy" />
            <div style={{ fontFamily: S.hand, fontSize: 14, lineHeight: 1.6, color: S.ink }}>
              12일이나 꾸준히 왔어 🌱<br/>힘든 날도 있었지만 정원이 자라고 있어!
            </div>
          </div>
        </Card>

        {/* 내 정보 */}
        <Card fill={S.paper} stroke={S.inkVeryFaint} radius={12} style={{ marginBottom: 10 }}>
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 18 }}>현성</div>
              <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft, marginTop: 3 }}>2025년 4월 1일 가입</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6,
              background: S.peachFaint, border: `1px solid ${S.peachSoft}`,
              borderRadius: 999, padding: '5px 12px' }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 14, color: S.peach }}>{streak}일 연속</span>
            </div>
          </div>
        </Card>

        {/* 설정 */}
        {[
          { icon: '🔔', label: '알림 설정',        sub: '매일 뭉이가 말 걸기' },
          { icon: '🎙', label: '목소리 설정',       sub: '뭉이 TTS 속도·톤', screen: 'voice_settings' },
          { icon: '🌙', label: '다크모드',           sub: '화면 테마 변경' },
        ].map((item, i, arr) => (
          <div key={i} onClick={() => item.screen && navigate(item.screen)} style={{
            display: 'flex', alignItems: 'center', padding: '13px 16px',
            background: S.paper,
            borderBottom: i < arr.length - 1 ? `1px solid ${S.inkVeryFaint}` : 'none',
            borderRadius: i === 0 ? '12px 12px 0 0' : i === arr.length - 1 ? '0 0 12px 12px' : 0,
            border: `1px solid ${S.inkVeryFaint}`,
            marginBottom: i < arr.length - 1 ? -1 : 10,
            cursor: item.screen ? 'pointer' : 'default',
          }}>
            <span style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: S.hand, fontSize: 15, fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontFamily: S.hand, fontSize: 11, color: S.inkSoft }}>{item.sub}</div>
            </div>
            <span style={{ color: S.inkSoft, fontSize: 16 }}>›</span>
          </div>
        ))}

        {/* 기타 */}
        {[
          { icon: '📢', label: '공지사항' },
          { icon: '💬', label: '피드백 보내기' },
          { icon: '🔒', label: '개인정보 처리방침' },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', padding: '13px 16px',
            background: S.paper,
            borderBottom: i < arr.length - 1 ? `1px solid ${S.inkVeryFaint}` : 'none',
            borderRadius: i === 0 ? '12px 12px 0 0' : i === arr.length - 1 ? '0 0 12px 12px' : 0,
            border: `1px solid ${S.inkVeryFaint}`,
            marginBottom: i < arr.length - 1 ? -1 : 10,
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</span>
            <div style={{ flex: 1, fontFamily: S.hand, fontSize: 15, fontWeight: 700 }}>{item.label}</div>
            <span style={{ color: S.inkSoft, fontSize: 16 }}>›</span>
          </div>
        ))}

        {/* 로그아웃 / 탈퇴 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {[
            { label: '로그아웃', color: S.inkSoft },
            { label: '탈퇴하기', color: S.peach },
          ].map((btn, i) => (
            <div key={i} style={{
              flex: 1, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1.5px solid ${S.inkVeryFaint}`, borderRadius: 10,
              fontFamily: S.hand, fontSize: 12, color: btn.color,
              cursor: 'pointer', background: S.paper,
            }}>{btn.label}</div>
          ))}
        </div>

      </div>
      <TabBar active="dashboard" onNav={navigate} />
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 10. VOICE SETTINGS  (목소리 설정)
// ═══════════════════════════════════════════════════════════════════
function VoiceSettingsScreen({ navigate }) {
  const [tone, setTone] = useState('반말');
  const [style, setStyle] = useState('공감형');
  const [voice, setVoice] = useState('따뜻한');
  const [speed, setSpeed] = useState(1); // 0=느리게 1=보통 2=빠르게
  const [saved, setSaved] = useState(false);

  const voiceOptions = [
    { id: '따뜻한', emoji: '🌸', desc: '부드럽고 다정한 목소리' },
    { id: '차분한', emoji: '🌿', desc: '낮고 안정적인 목소리' },
    { id: '활발한', emoji: '⚡', desc: '밝고 에너지 넘치는 목소리' },
  ];

  const styleOptions = [
    { id: '공감형', emoji: '🫂', desc: '감정에 공감하며 들어줘요', color: S.peachFaint },
    { id: '현실형', emoji: '💡', desc: '현실적인 조언을 해줘요', color: S.sageSoft },
  ];

  const speedLabels = ['느리게', '보통', '빠르게'];

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${S.inkVeryFaint}` }}>
          <div onClick={() => navigate('dashboard')} style={{ fontFamily: S.hand, fontSize: 20, cursor: 'pointer', color: S.inkSoft }}>←</div>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 19 }}>목소리 설정</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', paddingBottom: 24 }}>

          {/* ── 말투 ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>🗣 말투</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['반말', '존댓말'].map(t => (
                <div key={t} onClick={() => { setTone(t); setSaved(false); }} style={{
                  flex: 1, padding: '14px 0', textAlign: 'center',
                  border: `1.5px solid ${tone === t ? S.ink : S.inkVeryFaint}`,
                  borderRadius: 14,
                  background: tone === t ? S.ink : '#fff',
                  color: tone === t ? S.paper : S.inkSoft,
                  fontFamily: S.hand, fontWeight: 700, fontSize: 17,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}>
                  <div style={{ fontSize: 22 }}>{t === '반말' ? '😊' : '🎩'}</div>
                  <div style={{ marginTop: 4 }}>{t}</div>
                  <div style={{ fontFamily: S.body, fontSize: 11, marginTop: 4, opacity: 0.7 }}>
                    {t === '반말' ? '"오늘 어떻게 지냈어?"' : '"오늘 어떻게 지내셨나요?"'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 답변 스타일 ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>💬 답변 스타일</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {styleOptions.map(s => (
                <div key={s.id} onClick={() => { setStyle(s.id); setSaved(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  border: `1.5px solid ${style === s.id ? S.ink : S.inkVeryFaint}`,
                  borderRadius: 14,
                  background: style === s.id ? s.color : '#fff',
                  cursor: 'pointer', transition: 'all 0.18s',
                  boxShadow: style === s.id ? '2px 2px 0 rgba(42,39,36,0.1)' : 'none',
                }}>
                  <span style={{ fontSize: 30 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16 }}>{s.id}</div>
                    <div style={{ fontFamily: S.body, fontSize: 12, color: S.inkSoft, marginTop: 3 }}>{s.desc}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `2px solid ${style === s.id ? S.ink : S.inkVeryFaint}`,
                    background: style === s.id ? S.ink : 'transparent',
                    flexShrink: 0,
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── 뭉이 목소리 ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🎙 뭉이 목소리</div>
            <div style={{ fontFamily: S.body, fontSize: 12, color: S.inkSoft, marginBottom: 10 }}>
              뭉이가 말할 때 어떤 톤이 좋아?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {voiceOptions.map(v => (
                <div key={v.id} onClick={() => { setVoice(v.id); setSaved(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  border: `1.5px solid ${voice === v.id ? S.ink : S.inkVeryFaint}`,
                  borderRadius: 14,
                  background: voice === v.id ? S.peachFaint : '#fff',
                  cursor: 'pointer', transition: 'all 0.18s',
                }}>
                  <span style={{ fontSize: 26 }}>{v.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 15 }}>{v.id} 목소리</div>
                    <div style={{ fontFamily: S.body, fontSize: 12, color: S.inkSoft, marginTop: 2 }}>{v.desc}</div>
                  </div>
                  {voice === v.id && (
                    <div style={{
                      fontFamily: S.hand, fontSize: 12, color: S.peach,
                      background: S.paper, border: `1px solid ${S.peachSoft}`,
                      borderRadius: 999, padding: '3px 10px',
                    }}>선택됨</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── 말하기 속도 ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>⏱ 말하기 속도</div>
            <div style={{ padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                {speedLabels.map((l, i) => (
                  <div key={i} style={{
                    fontFamily: S.hand, fontSize: 13,
                    color: speed === i ? S.ink : S.inkFaint,
                    fontWeight: speed === i ? 700 : 400,
                  }}>{l}</div>
                ))}
              </div>
              <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: S.inkVeryFaint, borderRadius: 2 }} />
                <div style={{
                  position: 'absolute', left: 0, height: 4,
                  width: `${(speed / 2) * 100}%`,
                  background: S.peach, borderRadius: 2, transition: 'width 0.2s',
                }} />
                {[0,1,2].map(i => (
                  <div key={i} onClick={() => { setSpeed(i); setSaved(false); }} style={{
                    position: 'absolute',
                    left: `calc(${(i/2)*100}% - 10px)`,
                    width: 20, height: 20, borderRadius: '50%',
                    background: speed === i ? S.ink : '#fff',
                    border: `2px solid ${speed === i ? S.ink : S.inkVeryFaint}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                    zIndex: 2,
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Preview bubble */}
          <div style={{
            padding: '14px 16px', marginBottom: 20,
            background: S.sageSoft, border: `1.5px dashed ${S.ink}`,
            borderRadius: 14,
          }}>
            <div style={{ fontFamily: S.hand, fontSize: 13, color: S.inkSoft, marginBottom: 8 }}>미리보기</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <Mascot size={36} mood="happy" />
              <div style={{
                background: '#fff', border: `1px solid ${S.inkVeryFaint}`,
                borderRadius: '12px 12px 12px 4px',
                padding: '10px 14px', fontFamily: S.pen, fontSize: 14, color: S.ink, lineHeight: 1.5,
              }}>
                {style === '공감형'
                  ? tone === '반말'
                    ? '많이 힘들었겠다, 그 마음 충분히 이해해 💛'
                    : '많이 힘드셨겠어요. 그 마음 충분히 이해해요 💛'
                  : tone === '반말'
                    ? '힘든 감정이 느껴져. 오늘 뭐가 제일 컸어?'
                    : '힘든 감정이 느껴지네요. 오늘 가장 힘든 부분이 뭐였나요?'
                }
              </div>
            </div>
          </div>

          {/* Save */}
          <Btn primary width="100%" height={46} onClick={() => setSaved(true)} style={{ width: '100%' }}>
            {saved ? '✓ 저장됐어!' : '설정 저장하기'}
          </Btn>
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 11. ARCHIVE  (일기 목록)
// ═══════════════════════════════════════════════════════════════════
function ArchiveScreen({ navigate }) {
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => { forceUpdate(n => n + 1); }, []);

  const mockEntries = [
    { date: '4.10 목', title: '과제 마감, 산책', emoji: '😊', type: 'voice', tags: ['#성취감', '#피곤'] },
    { date: '4.9 수',  title: '그냥 그런 하루', emoji: '😐', type: 'voice', tags: ['#무기력'] },
    { date: '4.8 화',  title: '친구와 싸웠다', emoji: '😔', type: 'voice', tags: ['#속상함', '#화남'] },
  ];
  const saved = window.__diaries || [];
  const entries = [...saved, ...mockEntries];

  return (
    <Phone>
      <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 16px 8px' }}>
          <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 24 }}>일기장 📔</div>
          <div style={{ fontFamily: S.hand, fontSize: 13, color: S.inkSoft, marginTop: 3 }}>목소리로 기록한 나의 하루들</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: 80 }}>
          {entries.map((e, i) => (
            <div key={i} onClick={() => navigate(e.type === 'chat' ? 'conv_diary' : 'diary')} style={{
              display: 'flex', alignItems: 'center', padding: '12px 0',
              borderBottom: `1px dashed ${S.inkVeryFaint}`, cursor: 'pointer',
              gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: e.type === 'chat' ? S.sageSoft : S.peachFaint,
                border: `1.5px solid ${S.inkVeryFaint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>{e.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: S.hand, fontWeight: 700, fontSize: 16 }}>{e.title}</div>
                  <div style={{ fontFamily: S.hand, fontSize: 12, color: S.inkSoft }}>{e.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                  {e.tags.map(t => (
                    <span key={t} style={{
                      fontFamily: S.hand, fontSize: 12, color: S.inkSoft,
                      background: S.inkVeryFaint, padding: '2px 8px', borderRadius: 999,
                    }}>{t}</span>
                  ))}
                  {e.type === 'chat' && (
                    <span style={{
                      fontFamily: S.hand, fontSize: 12, color: S.sage,
                      background: S.sageSoft, padding: '2px 8px', borderRadius: 999,
                    }}>대화일기</span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 14, color: S.inkFaint }}>›</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="archive" onNav={navigate} />
    </Phone>
  );
}

Object.assign(window, {
  LockScreen, SplashScreen, OnboardingScreen, HomeScreen, RecordingScreen,
  ProcessingScreen, DiaryScreen, ChatScreen, ConvDiaryScreen,
  DashboardScreen, VoiceSettingsScreen, ArchiveScreen,
});
