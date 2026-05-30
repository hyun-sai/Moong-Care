// app.jsx — navigation + entry point

const { useState, useCallback } = React;

const SCREEN_MAP = {
  lock:       LockScreen,
  splash:     SplashScreen,
  onboarding: OnboardingScreen,
  home:       HomeScreen,
  voice_chat:      VoiceChatScreen,
  conv_diary:      ConvDiaryScreen,
  dashboard:       DashboardScreen,
  voice_settings:  VoiceSettingsScreen,
  archive:         ArchiveScreen,
};

function App() {
  const [screen, setScreen] = useState('lock');
  const [history, setHistory] = useState(['splash']);

  const navigate = useCallback((to) => {
    setScreen(to);
    setHistory(h => [...h, to]);
  }, []);

  const Screen = SCREEN_MAP[screen] || HomeScreen;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
      <Screen navigate={navigate} />

      {/* Dev nav bar (outside phone) */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: 360,
      }}>
        {Object.keys(SCREEN_MAP).filter(s => s !== 'splash').map(s => (
          <div key={s} onClick={() => navigate(s)} style={{
            padding: '4px 10px',
            background: screen === s ? S.ink : '#fff',
            color: screen === s ? S.paper : S.inkSoft,
            border: `1px solid ${screen === s ? S.ink : S.inkVeryFaint}`,
            borderRadius: 999,
            fontFamily: S.hand, fontSize: 10, cursor: 'pointer',
            userSelect: 'none',
          }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
