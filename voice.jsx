// voice.jsx — 데모 모드: 실제 녹음 재생 + SER 말풍선

const { useState, useEffect, useRef, useCallback } = React;

// ─── 데모 스크립트 ────────────────────────────────────────────────────
const DEMO_SCRIPT = [
  {
    moong: '기분이 어때?',
    userAudio: 'user1.m4a',
    userText: '괜찮아,,',
    ser: { anxiety: 62, stability: 30, energy: 20, rate: '0.8',
      insights: [
        { text: '목소리가 많이 가라앉아 있어',   icon: '🌧', color: '#b3c5a3' },
        { text: '말이 느려지고 있어',             icon: '🌙', color: '#c5b8d8' },
        { text: '우울감이 느껴져',               icon: '💙', color: '#90b4d4' },
      ]
    },
  },
  {
    moong: '목소리는 괜찮아 보이지 않는데? 무슨 일이야. 오늘 하루 있었던 일을 말해줘.',
    userAudio: 'user2.m4a',
    userText: '아.. 내 기분 어떻게 알았어..?',
    ser: { anxiety: 55, stability: 38, energy: 28, rate: '0.85',
      insights: [
        { text: '목소리에 무거움이 느껴져',     icon: '🌧', color: '#b3c5a3' },
        { text: '말끝이 흐려지고 있어',          icon: '🌙', color: '#c5b8d8' },
        { text: '감정을 숨기려는 것 같아',       icon: '💙', color: '#90b4d4' },
      ]
    },
  },
  {
    moong: '그럼 나 뭉이는 너의 가장 가까운 친구잖아. 네 기분 다 느껴져, 편하게 이야기 해 봐.',
    userAudio: 'user3.m4a',
    userText: '오늘 사실.... 여자친구랑 헤어졌어.',
    ser: { anxiety: 88, stability: 14, energy: 22, rate: '0.65',
      insights: [
        { text: '목소리가 많이 떨리고 있어',     icon: '🌊', color: '#b3c5a3' },
        { text: '말이 끊기고 있어',              icon: '💔', color: '#f0a8a8' },
        { text: '깊은 슬픔이 느껴져',            icon: '😢', color: '#90b4d4' },
      ]
    },
  },
  {
    moong: '무척 속상한 일을 겪었구나. 그래도 현성이 너는 이성적인 사람이잖아. 기분은 일시적인 감정일 뿐이야. 잠시 밖에 나가서 10분만 산책하고 오는 게 어때?',
    userAudio: 'user4.m4a',
    userText: '웅 알았어... 오늘 여기까지만 말할게 안녕~',
    ser: { anxiety: 58, stability: 42, energy: 30, rate: '0.90',
      insights: [
        { text: '목소리가 조금 안정됐어',         icon: '🌱', color: '#a8c9a8' },
        { text: '마음을 내려놓으려는 것 같아',     icon: '🌙', color: '#c5b8d8' },
        { text: '오늘 잘 이야기해줬어',           icon: '🤍', color: '#b8c8d8' },
      ]
    },
  },
];

const FAREWELL = '오늘 힘든 마음 꺼내줘서 고마워. 산책하고 나서 기분이 조금 나아질 거야. 내일 또 얘기하자, 잘 자~';

// ─── TTS ─────────────────────────────────────────────────────────────
function speak(text, onEnd) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR'; u.rate = 0.88; u.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const ko = voices.find(v => v.lang.startsWith('ko'));
  if (ko) u.voice = ko;
  u.onend = onEnd || null;
  window.speechSynthesis.speak(u);
}

// ─── SER 말풍선 ───────────────────────────────────────────────────────
function SERBubble({ insights, visible }) {
  if (!insights || !visible) return null;
  return (
    <div className="slide-up" style={{
      position: 'absolute', top: 60, right: 8,
      background: S.ink, borderRadius: 14, padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      width: 148, zIndex: 30,
      boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
    }}>
      {/* 왼쪽 꼬리 — 마스코트 방향 */}
      <div style={{
        position: 'absolute', top: 20, left: -7,
        width: 0, height: 0,
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderRight: `7px solid ${S.ink}`,
      }} />
      <div style={{ fontFamily: S.hand, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
        🎙 목소리 분석
      </div>
      {insights.map((ins, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15 }}>{ins.icon}</span>
          <span style={{ fontFamily: S.hand, fontSize: 13, fontWeight: 700, color: ins.color }}>
            {ins.text}
          </span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VoiceChatScreen — 데모 모드
// ═══════════════════════════════════════════════════════════════════
function VoiceChatScreen({ navigate }) {
  // intro | moong_speaking | user_playing | ser_showing | saving | done
  const [phase, setPhase]           = useState('intro');
  const [turn, setTurn]             = useState(0);
  const [mouthOpen, setMouthOpen]   = useState(false);
  const [moongMood, setMoongMood]   = useState('happy');
  const [moongText, setMoongText]   = useState('');
  const [serVisible, setSerVisible] = useState(false);
  const [currentSer, setCurrentSer] = useState(null);
  const [userText, setUserText]     = useState('');

  const mouthRef  = useRef(null);
  const audioRef  = useRef(null);
  const savingRef = useRef(false);

  // 뻐끔뻐끔
  useEffect(() => {
    if (phase === 'moong_speaking') {
      mouthRef.current = setInterval(() => setMouthOpen(o => !o), 220);
    } else {
      clearInterval(mouthRef.current);
      setMouthOpen(false);
    }
    return () => clearInterval(mouthRef.current);
  }, [phase]);

  const mascotMood = phase === 'moong_speaking'
    ? (mouthOpen ? 'talking' : 'happy')
    : moongMood;

  // 뭉이가 말하고 → 유저 오디오 재생
  const moongSpeakThen = useCallback((text, nextAction, mood = 'talking') => {
    if (savingRef.current) return;
    setMoongMood(mood);
    setPhase('moong_speaking');
    setMoongText(text);
    speak(text, () => {
      if (savingRef.current) return;
      setMoongMood('happy');
      setMoongText('');
      nextAction();
    });
  }, []);

  // 유저 오디오 재생 → SER 말풍선
  const playUserAudio = useCallback((stepIdx) => {
    if (savingRef.current) return;
    const step = DEMO_SCRIPT[stepIdx];
    setPhase('user_playing');
    setUserText('');
    setSerVisible(false);

    const audio = new Audio(step.userAudio);
    audioRef.current = audio;

    // 오디오 재생되면서 텍스트 자막 표시
    audio.onplay = () => setUserText(step.userText);

    audio.onended = () => {
      if (savingRef.current) return;
      // SER 말풍선 표시
      setCurrentSer(step.ser);
      setSerVisible(true);
      setPhase('ser_showing');
      setMoongMood('worried');

      setTimeout(() => {
        if (savingRef.current) return;
        setSerVisible(false);
        setUserText('');
        setTurn(stepIdx + 1);

        // 다음 뭉이 응답
        if (stepIdx + 1 < DEMO_SCRIPT.length) {
          moongSpeakThen(
            DEMO_SCRIPT[stepIdx + 1].moong,
            () => playUserAudio(stepIdx + 1),
            step.ser.anxiety > 60 ? 'worried' : 'talking',
          );
        } else {
          // 마지막 — 작별 인사
          moongSpeakThen(FAREWELL, () => {
            setPhase('done');
            setMoongMood('happy');
          }, 'happy');
        }
      }, 2200);
    };

    audio.onerror = () => {
      // 오디오 로드 실패 시 텍스트만 보여주고 진행
      setUserText(step.userText);
      setTimeout(() => audio.onended && audio.onended(), 2000);
    };

    audio.play().catch(() => {
      setUserText(step.userText);
      setTimeout(() => {
        if (savingRef.current) return;
        setCurrentSer(step.ser);
        setSerVisible(true);
        setPhase('ser_showing');
        setTimeout(() => {
          if (savingRef.current) return;
          setSerVisible(false);
          setUserText('');
          setTurn(stepIdx + 1);
          if (stepIdx + 1 < DEMO_SCRIPT.length) {
            moongSpeakThen(
              DEMO_SCRIPT[stepIdx + 1].moong,
              () => playUserAudio(stepIdx + 1),
              step.ser.anxiety > 60 ? 'worried' : 'talking',
            );
          } else {
            moongSpeakThen(FAREWELL, () => { setPhase('done'); setMoongMood('happy'); }, 'happy');
          }
        }, 2200);
      }, 2000);
    });
  }, [moongSpeakThen]);

  // 대화 시작
  const handleStart = useCallback(() => {
    moongSpeakThen(DEMO_SCRIPT[0].moong, () => playUserAudio(0), 'happy');
  }, [moongSpeakThen, playUserAudio]);

  // 저장
  const handleSave = useCallback(() => {
    savingRef.current = true;
    window.speechSynthesis.cancel();
    audioRef.current?.pause();
    setPhase('saving');

    const now = new Date();
    const dateStr = `${now.getMonth()+1}.${now.getDate()} ${['일','월','화','수','목','금','토'][now.getDay()]}`;
    const completedTurns = DEMO_SCRIPT.slice(0, Math.max(turn, 1));
    const avgAnxiety  = Math.round(completedTurns.reduce((s,t) => s + t.ser.anxiety,  0) / completedTurns.length);
    const avgStability= Math.round(completedTurns.reduce((s,t) => s + t.ser.stability,0) / completedTurns.length);
    const firstAnxiety= completedTurns[0]?.ser.anxiety ?? 50;
    const lastAnxiety = completedTurns[completedTurns.length-1]?.ser.anxiety ?? 50;

    // 일기 생성에 필요한 모든 데이터 저장
    window.__lastDiary = {
      date: dateStr,
      turns: completedTurns.map(t => ({ userText: t.userText, ser: t.ser })),
      avgAnxiety, avgStability, firstAnxiety, lastAnxiety,
    };

    const hasBreakup = completedTurns.some(t => t.userText?.includes('헤어') || t.userText?.includes('이별'));
    const emoji = hasBreakup ? '💔' : avgAnxiety > 60 ? '😔' : avgAnxiety > 40 ? '😌' : '😊';
    const title = hasBreakup ? '여자친구랑 헤어진 날' : '뭉이와의 대화';
    const allInsights = completedTurns.flatMap(t => t.ser.insights.map(i => i.text));
    const baseTags = [...new Set(allInsights)].slice(0, 2).map(t => `#${t.replace(/ /g,'')}`);
    const tags = hasBreakup ? ['#이별', '#슬픔', ...baseTags].slice(0, 3) : baseTags;

    if (!window.__diaries) window.__diaries = [];
    window.__diaries.unshift({ date: dateStr, title, emoji, type: 'chat', tags });
    setTimeout(() => navigate('archive'), 2400);
  }, [navigate, turn]);

  // ── saving 화면 ──
  if (phase === 'saving') {
    return (
      <Phone>
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-16, borderRadius:'50%', background:`radial-gradient(circle, ${S.sageSoft} 0%, transparent 70%)`, filter:'blur(10px)' }} />
            <div className="bounce"><Mascot size={100} mood="happy" /></div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:S.hand, fontWeight:700, fontSize:18, marginBottom:8 }}>일기 저장하고 있어 💛</div>
            <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
              {[0,0.3,0.6].map((d,i) => (
                <div key={i} style={{ width:8, height:8, borderRadius:4, background:S.peach, animation:`waveBar 0.8s ${d}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        </div>
        <TabBar active={null} onNav={s => navigate(s)} />
      </Phone>
    );
  }

  return (
    <Phone>
      <div className="screen-enter" style={{ flex:1, display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ padding:'6px 16px 10px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px dashed ${S.inkVeryFaint}` }}>
          <div onClick={() => { window.speechSynthesis.cancel(); audioRef.current?.pause(); navigate('home'); }}
            style={{ fontFamily:S.hand, fontSize:18, cursor:'pointer' }}>←</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:S.hand, fontWeight:700, fontSize:15 }}>뭉이와 대화</div>
          </div>
          <div style={{ fontFamily:S.hand, fontSize:10, color:S.inkFaint }}>{turn}/{DEMO_SCRIPT.length} 턴</div>
        </div>

        {/* Main — 뭉이 중앙 */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px 8px', position:'relative' }}>

          {/* Mascot */}
          <div style={{ position:'relative', marginBottom: 16 }}>
            {/* Glow */}
            {(phase === 'moong_speaking' || phase === 'user_playing' || phase === 'ser_showing') && (
              <div style={{
                position:'absolute', inset:-20, borderRadius:'50%',
                background: phase === 'user_playing' || phase === 'ser_showing'
                  ? `radial-gradient(circle, ${S.peachSoft} 0%, transparent 70%)`
                  : `radial-gradient(circle, ${S.sageSoft} 0%, transparent 70%)`,
                filter:'blur(12px)', opacity:0.9,
                animation: phase === 'user_playing' ? 'pulse-ring 1.8s ease-out infinite' : 'none',
              }} />
            )}
            <div className={phase === 'intro' ? 'bounce' : ''}>
              <Mascot size={120} mood={mascotMood} />
            </div>
          </div>

          {/* SER 말풍선 — 폰 오른쪽 상단 고정 */}
          <SERBubble insights={currentSer?.insights} visible={serVisible} />

          {/* 뭉이 자막 */}
          {moongText ? (
            <div className="screen-enter" style={{
              background: S.sageSoft, border:`1.5px solid ${S.inkVeryFaint}`,
              borderRadius:16, padding:'12px 16px',
              fontFamily:S.pen, fontSize:15, lineHeight:1.55,
              color:S.ink, textAlign:'center', maxWidth:240, marginBottom:8,
            }}>{moongText}</div>
          ) : null}

          {/* 유저 자막 (오디오 재생 중) */}
          {(phase === 'user_playing' || phase === 'ser_showing') && userText && (
            <div className="screen-enter" style={{
              background:`${S.ink}11`, border:`1.5px dashed ${S.ink}`,
              borderRadius:16, padding:'10px 14px',
              fontFamily:S.pen, fontSize:14, lineHeight:1.5,
              color:S.ink, textAlign:'center', maxWidth:240,
            }}>{userText}</div>
          )}

          {/* Processing dots */}
          {phase === 'moong_speaking' && !moongText && (
            <div style={{ display:'flex', gap:6, marginTop:8 }}>
              {[0,0.2,0.4].map((d,i) => (
                <div key={i} style={{ width:8, height:8, borderRadius:4, background:S.inkSoft, animation:`waveBar 0.6s ${d}s infinite ease-in-out` }} />
              ))}
            </div>
          )}

          {/* Intro CTA */}
          {phase === 'intro' && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:S.hand, fontWeight:700, fontSize:18, marginBottom:6 }}>뭉이랑 대화해봐</div>
              <div style={{ fontFamily:S.pen, fontSize:13, color:S.inkSoft, lineHeight:1.6, marginBottom:20 }}>
                말하면 목소리로 감정을 읽어줄게<br/>대화 끝나면 일기로 저장돼
              </div>
              <Btn primary height={48} style={{ paddingLeft:28, paddingRight:28 }} onClick={handleStart}>
                🎙 대화 시작하기
              </Btn>
            </div>
          )}
        </div>

        {/* 저장 버튼 — 인트로 아닐 때 */}
        {phase !== 'intro' && phase !== 'saving' && (
          <div style={{ padding:'10px 20px 0', borderTop:`1px solid ${S.inkVeryFaint}`, paddingBottom:92 }}>
            {/* 웨이브폼 */}
            <div style={{ marginBottom:10 }}>
              {phase === 'user_playing'
                ? <LiveWaveform width={280} height={28} color={S.peach} />
                : <Waveform width={280} height={28} bars={36} seed={3.1} color={S.inkVeryFaint} />
              }
            </div>
            <div
              onClick={handleSave}
              style={{
                width:'100%', height:44,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:S.ink, borderRadius:999,
                fontFamily:S.hand, fontSize:14, fontWeight:700,
                color:S.paper, cursor:'pointer',
                WebkitTapHighlightColor:'transparent',
                boxShadow:'2px 2px 0 rgba(42,39,36,0.2)',
              }}>
              📔 뭉이와의 대화 저장하기
            </div>
          </div>
        )}

        <TabBar active={null} onNav={s => { window.speechSynthesis.cancel(); audioRef.current?.pause(); navigate(s); }} />
      </div>
    </Phone>
  );
}

Object.assign(window, { VoiceChatScreen });
