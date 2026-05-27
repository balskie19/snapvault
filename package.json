import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const photos = [
  { id: 1, type: "photo", color: "#FBBF24", label: "IMG_0031", size: "4.2MB", date: "Today" },
  { id: 2, type: "video", color: "#60A5FA", label: "VID_0012", size: "82MB", date: "Today" },
  { id: 3, type: "photo", color: "#34D399", label: "IMG_0030", size: "3.8MB", date: "Yesterday" },
  { id: 4, type: "photo", color: "#F87171", label: "IMG_0029", size: "5.1MB", date: "Yesterday" },
  { id: 5, type: "video", color: "#A78BFA", label: "VID_0011", size: "120MB", date: "Yesterday" },
  { id: 6, type: "photo", color: "#FB923C", label: "IMG_0028", size: "3.2MB", date: "Mon" },
  { id: 7, type: "photo", color: "#2DD4BF", label: "IMG_0027", size: "4.7MB", date: "Mon" },
  { id: 8, type: "photo", color: "#E879F9", label: "IMG_0026", size: "2.9MB", date: "Sun" },
  { id: 9, type: "video", color: "#38BDF8", label: "VID_0010", size: "95MB", date: "Sun" },
  { id: 10, type: "photo", color: "#4ADE80", label: "IMG_0025", size: "3.6MB", date: "Sat" },
  { id: 11, type: "photo", color: "#FACC15", label: "IMG_0024", size: "4.1MB", date: "Sat" },
  { id: 12, type: "photo", color: "#FB7185", label: "IMG_0023", size: "3.3MB", date: "Fri" },
];

const initCloud = [
  { id: 1, type: "photo", color: "#FBBF24", label: "IMG_0020", size: "4.2MB", date: "May 20" },
  { id: 2, type: "video", color: "#60A5FA", label: "VID_0008", size: "78MB", date: "May 19" },
  { id: 3, type: "photo", color: "#34D399", label: "IMG_0019", size: "3.8MB", date: "May 18" },
  { id: 4, type: "photo", color: "#F87171", label: "IMG_0018", size: "5.1MB", date: "May 17" },
  { id: 5, type: "video", color: "#A78BFA", label: "VID_0007", size: "110MB", date: "May 16" },
  { id: 6, type: "photo", color: "#FB923C", label: "IMG_0017", size: "3.2MB", date: "May 15" },
  { id: 7, type: "photo", color: "#2DD4BF", label: "IMG_0016", size: "3.1MB", date: "May 14" },
  { id: 8, type: "photo", color: "#E879F9", label: "IMG_0015", size: "4.0MB", date: "May 13" },
  { id: 9, type: "video", color: "#38BDF8", label: "VID_0006", size: "88MB", date: "May 12" },
];

const TAB_FILTERS = ["All", "Photos", "Videos", "Screenshots"];

// ─── THEME ────────────────────────────────────────────────────────────────────
function getTheme(dark) {
  return dark ? {
    bg: "#0A0F1E", bgCard: "#131929", bgMuted: "#1A2236", bgSubtle: "#1A2236",
    border: "#243047", text: "#F0F4FF", textSub: "#8896B3", textMuted: "#4E6080",
    statusBar: "#0A0F1E", bottomBar: "#0A0F1E", bottomBorder: "#1A2236",
    pill: "#1A2236", pillText: "#60A5FA", tabInactive: "#4E6080",
    inputBg: "#131929", inputBorder: "#243047",
  } : {
    bg: "#FFFFFF", bgCard: "#FFFFFF", bgMuted: "#F1F5F9", bgSubtle: "#F8FAFC",
    border: "#E2E8F0", text: "#0F172A", textSub: "#64748B", textMuted: "#94A3B8",
    statusBar: "#FFFFFF", bottomBar: "#FFFFFF", bottomBorder: "#F1F5F9",
    pill: "#EFF6FF", pillText: "#3B82F6", tabInactive: "#94A3B8",
    inputBg: "#F8FAFC", inputBorder: "#E2E8F0",
  };
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  .card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
  .card-hover:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px #3B82F620 !important; }
  .card-hover:active { transform: scale(0.97) !important; }
  .btn-press:active { transform: scale(0.96) !important; opacity: 0.9; }
  .tab-bounce { transition: transform 0.15s cubic-bezier(.34,1.56,.64,1); }
  .tab-bounce:active { transform: scale(1.25); }
  .fade-in { animation: fadeSlideUp 0.35s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d1 { animation: fadeSlideUp 0.35s 0.05s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d2 { animation: fadeSlideUp 0.35s 0.10s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d3 { animation: fadeSlideUp 0.35s 0.15s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d4 { animation: fadeSlideUp 0.35s 0.20s cubic-bezier(.4,0,.2,1) both; }
  .slide-in { animation: slideIn 0.3s cubic-bezier(.4,0,.2,1) both; }
  .thumb-in { animation: thumbPop 0.25s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes thumbPop { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
  input::placeholder { color: #94A3B8; }
  ::-webkit-scrollbar { width: 0; }
`;

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
function Logo({ size = 40, dark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="url(#lg)" />
      <path d="M14 28c0-3.5 2.5-6 5.5-6.3C20.2 19 22.8 17 26 17c3.8 0 6.8 2.8 7 6.5.1 0 .3 0 .5 0C35.5 23.5 37 25 37 27s-1.5 3.5-3.5 3.5H15.5C13.5 30.5 12 29.5 14 28z" fill="white" opacity="0.95"/>
      <rect x="20" y="26" width="8" height="10" rx="2" fill="url(#lg2)"/>
      <path d="M21.5 31h5M24 28.5v5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6"/>
          <stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="lg2" x1="20" y1="26" x2="28" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1"/>
          <stop offset="1" stopColor="#3B82F6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function StorageMeter({ percent, t, animate }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(() => setW(percent), 300); return () => clearTimeout(id); }, [animate]);
  const color = percent > 85 ? "#EF4444" : percent > 60 ? "#F59E0B" : "#3B82F6";
  return (
    <div style={{ background: t.bgMuted, borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontFamily: "'Nunito Sans'", color: t.textSub, fontWeight: 500 }}>iPhone Storage</span>
        <span style={{ fontSize: 13, fontFamily: "'Nunito Sans'", color, fontWeight: 700 }}>{percent}% used</span>
      </div>
      <div style={{ background: t.border, borderRadius: 999, height: 10, overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg,${color}99,${color})`, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Nunito Sans'" }}>118.4 GB used</span>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Nunito Sans'" }}>128 GB total</span>
      </div>
    </div>
  );
}

function Thumbnail({ item, selected, onToggle, showCheck = true, delay = 0 }) {
  return (
    <div onClick={() => onToggle && onToggle(item.id)} className="thumb-in"
      style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer", aspectRatio: "1",
        border: selected ? "2.5px solid #3B82F6" : "2.5px solid transparent",
        transition: "border 0.15s, transform 0.15s", animationDelay: `${delay}s`,
        boxShadow: selected ? "0 0 0 3px #3B82F625" : "none" }}>
      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${item.color}88,${item.color})`,
        display: "flex", alignItems: "flex-end", padding: 5 }}>
        {item.type === "video" && (
          <div style={{ background: "#00000060", borderRadius: 4, padding: "2px 5px", fontSize: 9, color: "white", fontFamily: "'Nunito Sans'", fontWeight: 600 }}>▶ VID</div>
        )}
      </div>
      {showCheck && (
        <div style={{ position: "absolute", top: 5, right: 5, width: 20, height: 20, borderRadius: "50%",
          background: selected ? "#3B82F6" : "#ffffff80", border: selected ? "none" : "1.5px solid #ffffff80",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          {selected && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
        </div>
      )}
    </div>
  );
}

function FilterTabs({ active, onChange, t }) {
  return (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
      {TAB_FILTERS.map(tab => (
        <button key={tab} onClick={() => onChange(tab)} className="btn-press"
          style={{ padding: "6px 14px", borderRadius: 999, border: "none",
            background: active === tab ? "#3B82F6" : t.bgMuted,
            color: active === tab ? "white" : t.textSub,
            fontFamily: "'Nunito Sans'", fontSize: 12, fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}>{tab}</button>
      ))}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, style = {}, t, cls = "" }) {
  const base = { width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
    fontFamily: "'Nunito Sans'", fontSize: 15, fontWeight: 700, cursor: "pointer",
    transition: "all 0.15s", letterSpacing: 0.1, ...style };
  const v = {
    primary: { background: "linear-gradient(135deg,#3B82F6,#6366F1)", color: "white", boxShadow: "0 4px 16px #3B82F640" },
    secondary: { background: t ? t.bgMuted : "#F1F5F9", color: t ? t.text : "#334155" },
    danger: { background: t?.bg === "#0A0F1E" ? "#3B0A0A" : "#FEF2F2", color: "#EF4444" },
    ghost: { background: "transparent", color: "#3B82F6", padding: "10px 0" },
    outline: { background: "transparent", color: "#3B82F6", border: "1.5px solid #3B82F6", padding: "12px 0" },
  };
  return <button style={{ ...base, ...v[variant] }} onClick={onClick} className={`btn-press ${cls}`}>{children}</button>;
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 26, borderRadius: 999, cursor: "pointer",
      background: value ? "#3B82F6" : "#CBD5E1", transition: "background 0.2s", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 21 : 3, width: 20, height: 20, borderRadius: "50%",
        background: "white", boxShadow: "0 1px 4px #0000002A", transition: "left 0.2s" }} />
    </div>
  );
}

function DarkToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(d => !d)} className="btn-press"
      style={{ background: dark ? "#1A2236" : "#F1F5F9", border: "none", borderRadius: 999, cursor: "pointer",
        width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, transition: "background 0.2s", flexShrink: 0 }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

function BackBtn({ onClick, t }) {
  return (
    <button onClick={onClick} className="btn-press"
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: "#3B82F6", display: "flex", alignItems: "center", gap: 4 }}>
      ←
    </button>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ONBOARD = [
  { icon: "📱", emoji: "😩", title: "Your iPhone is full.", sub: "Can't take photos? Apps crashing? You're not alone — storage maxed is the #1 iPhone pain.", color: "#EF4444" },
  { icon: "🗂️", emoji: "🎯", title: "Pick exactly what to save.", sub: "Browse your photos and videos, select only what you want, and back them up in seconds.", color: "#3B82F6" },
  { icon: "☁️", emoji: "✨", title: "Access anything, anywhere.", sub: "Your files live safely in the cloud. Tap to view, share, or download back anytime.", color: "#6366F1" },
];

function OnboardingScreen({ nav, t }) {
  const [slide, setSlide] = useState(0);
  const s = ONBOARD[slide];
  return (
    <div style={{ padding: "32px 24px 40px", background: t.bg, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => nav("login")} className="btn-press"
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, fontWeight: 600 }}>Skip</button>
      </div>

      <div key={slide} className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
        <div style={{ width: 110, height: 110, borderRadius: 32, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 8 }}>
          {s.icon}
        </div>
        <div style={{ fontSize: 26, fontFamily: "'Nunito'", color: t.text, lineHeight: 1.2 }}>{s.title}</div>
        <div style={{ fontSize: 14, fontFamily: "'Nunito Sans'", color: t.textSub, lineHeight: 1.6, maxWidth: 280 }}>{s.sub}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        {ONBOARD.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 999,
            background: i === slide ? "#3B82F6" : t.border, transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>

      {slide < ONBOARD.length - 1 ? (
        <Btn t={t} onClick={() => setSlide(s => s + 1)}>Next →</Btn>
      ) : (
        <Btn t={t} onClick={() => nav("login")}>Get Started 🚀</Btn>
      )}
    </div>
  );
}

// ─── LOGIN / SIGNUP ───────────────────────────────────────────────────────────
function AuthScreen({ nav, t }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${t.inputBorder}`,
    background: t.inputBg, color: t.text, fontFamily: "'Nunito Sans'", fontSize: 14, outline: "none",
    transition: "border 0.15s", marginBottom: 10 };
  return (
    <div style={{ padding: "28px 24px 40px", background: t.bg, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        <Logo size={52} dark={t.bg === "#0A0F1E"} />
        <div style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text, marginTop: 12 }}>SnapVault</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, marginTop: 4 }}>Your photos, safe forever.</div>
      </div>

      <div style={{ display: "flex", background: t.bgMuted, borderRadius: 12, padding: 4, marginBottom: 22 }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => setMode(m)} className="btn-press"
            style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
              background: mode === m ? (t.bg === "#0A0F1E" ? "#243047" : "white") : "transparent",
              color: mode === m ? t.text : t.textMuted,
              fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: 700,
              boxShadow: mode === m ? "0 1px 6px #00000018" : "none", transition: "all 0.2s" }}>
            {m === "login" ? "Log In" : "Sign Up"}
          </button>
        ))}
      </div>

      <div key={mode} className="fade-in">
        {mode === "signup" && <input style={inp} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />}
        <input style={inp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={{ ...inp, marginBottom: 18 }} type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <Btn t={t} onClick={() => nav("home")}>{mode === "login" ? "Log In" : "Create Account"}</Btn>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>or</span>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>

      <button onClick={() => nav("home")} className="btn-press card-hover"
        style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: `1.5px solid ${t.border}`,
          background: t.bgCard, color: t.text, fontFamily: "'Nunito Sans'", fontSize: 14, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🍎</span> Continue with Apple
      </button>

      {mode === "login" && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>Don't have an account? </span>
          <button onClick={() => setMode("signup")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans'", fontSize: 12, color: "#3B82F6", fontWeight: 700 }}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ nav, t }) {
  return (
    <div style={{ padding: "0 20px 32px", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ paddingTop: 20, paddingBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Logo size={24} />
            <span style={{ fontSize: 11, fontFamily: "'Nunito Sans'", color: t.textMuted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>SNAPVAULT</span>
          </div>
          <div style={{ fontSize: 24, fontFamily: "'Nunito'", color: t.text, lineHeight: 1.2 }}>
            Storage is<br /><span style={{ color: "#EF4444" }}>almost full.</span>
          </div>
        </div>
      </div>

      <div className="fade-in-d1"><StorageMeter percent={92} t={t} animate /></div>

      <div className="fade-in-d2" style={{ marginTop: 18, marginBottom: 8, fontSize: 11, fontFamily: "'Nunito Sans'", color: t.textMuted, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>What would you like to do?</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { sc: "browse", icon: "🗂️", bg: t.bg === "#0A0F1E" ? "#1A2E4A" : "#EFF6FF", label: "Browse & Select Files", sub: "Pick exactly what to back up", cls: "fade-in-d2" },
          { sc: "gallery", icon: "☁️", bg: t.bg === "#0A0F1E" ? "#0F2A1E" : "#F0FDF4", label: "My Cloud Gallery", sub: "View & manage backed-up files", cls: "fade-in-d3" },
          { sc: "plans", icon: "⚡", bg: t.bg === "#0A0F1E" ? "#1E1A2E" : "#F5F3FF", label: "Storage Plans", sub: "Free, Plus & Pro options", cls: "fade-in-d3" },
          { sc: "settings", icon: "⚙️", bg: t.bg === "#0A0F1E" ? "#2A1A0A" : "#FFF7ED", label: "Settings & Auto-Backup", sub: "Set rules for automatic backups", cls: "fade-in-d4" },
        ].map(opt => (
          <button key={opt.sc} onClick={() => nav(opt.sc)} className={`card-hover ${opt.cls}`}
            style={{ background: t.bgCard, borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${t.border}`,
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left",
              boxShadow: t.bg === "#0A0F1E" ? "none" : "0 2px 8px #0000000A" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: opt.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{opt.icon}</div>
            <div>
              <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 14, color: t.text }}>{opt.label}</div>
              <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginTop: 1 }}>{opt.sub}</div>
            </div>
            <span style={{ marginLeft: "auto", color: t.textMuted, fontSize: 16 }}>›</span>
          </button>
        ))}
      </div>

      <div className="fade-in-d4" style={{ marginTop: 14, background: t.bg === "#0A0F1E" ? "#2A1A00" : "#FFF7ED", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10 }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.bg === "#0A0F1E" ? "#FCD34D" : "#92400E", lineHeight: 1.5 }}>
          <strong>847 photos & 34 videos</strong> are using 14.2 GB. Back them up and free your space.
        </div>
      </div>
    </div>
  );
}

// ─── BROWSE & SELECT ──────────────────────────────────────────────────────────
function BrowseScreen({ nav, t }) {
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("All");
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === photos.length ? [] : photos.map(p => p.id));
  const filtered = photos.filter(p => filter === "Photos" ? p.type === "photo" : filter === "Videos" ? p.type === "video" : true);
  const selSize = selected.reduce((a, id) => { const it = photos.find(p => p.id === id); return a + (it ? parseFloat(it.size) : 0); }, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "16px 20px 10px", borderBottom: `1px solid ${t.border}` }}>
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <BackBtn onClick={() => nav("home")} t={t} />
          <div style={{ fontFamily: "'Nunito'", fontSize: 19, color: t.text }}>Select Files</div>
          <button onClick={toggleAll} className="btn-press"
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans'", fontSize: 12, fontWeight: 700, color: "#3B82F6" }}>
            {selected.length === photos.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <FilterTabs active={filter} onChange={setFilter} t={t} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
          {filtered.map((item, i) => <Thumbnail key={item.id} item={item} selected={selected.includes(item.id)} onToggle={toggle} delay={i * 0.03} />)}
        </div>
      </div>
      <div style={{ padding: "10px 20px 22px", borderTop: `1px solid ${t.border}`, background: t.bg }}>
        {selected.length > 0 ? (
          <>
            <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub, marginBottom: 8 }}>
              <strong style={{ color: t.text }}>{selected.length} items</strong> · {selSize.toFixed(0)} MB selected
            </div>
            <Btn t={t} onClick={() => nav("backup-confirm")}>☁️ Back Up {selected.length} Files</Btn>
          </>
        ) : (
          <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, padding: "6px 0" }}>Tap files above to select them</div>
        )}
      </div>
    </div>
  );
}

// ─── BACKUP CONFIRM ───────────────────────────────────────────────────────────
function BackupConfirmScreen({ nav, t }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const start = () => {
    setLoading(true);
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) { p = 100; clearInterval(id); setTimeout(() => nav("backup-done"), 500); }
      setProgress(Math.min(p, 100));
    }, 200);
  };
  const dark = t.bg === "#0A0F1E";
  return (
    <div style={{ padding: "24px 20px 32px", background: t.bg, minHeight: "100%" }}>
      <BackBtn onClick={() => nav("browse")} t={t} />
      <div className="fade-in" style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text, marginBottom: 6 }}>Ready to back up?</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 22, lineHeight: 1.5 }}>
          <strong style={{ color: t.text }}>12 files (312 MB)</strong> selected. Choose your destination.
        </div>
      </div>
      {!loading ? (
        <>
          <div style={{ fontSize: 11, fontFamily: "'Nunito Sans'", color: t.textMuted, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Back up to:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {[
              { icon: "☁️", label: "SnapVault Cloud", sub: "Secure & private. 5GB free.", cls: "fade-in-d1" },
              { icon: "📁", label: "iCloud Drive", sub: "Your existing Apple storage.", cls: "fade-in-d2" },
              { icon: "🔗", label: "Google Drive", sub: "Connect your Google account.", cls: "fade-in-d3" },
            ].map(opt => (
              <button key={opt.label} onClick={start} className={`card-hover ${opt.cls}`}
                style={{ background: t.bgMuted, border: `1.5px solid ${t.border}`, borderRadius: 14,
                  padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 14, color: t.text }}>{opt.label}</div>
                  <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted, marginTop: 1 }}>{opt.sub}</div>
                </div>
                <span style={{ marginLeft: "auto", color: t.textMuted }}>›</span>
              </button>
            ))}
          </div>
          <Btn variant="ghost" t={t} onClick={() => nav("browse")}>← Change selection</Btn>
        </>
      ) : (
        <div className="fade-in" style={{ textAlign: "center", paddingTop: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }} className="pulse">☁️</div>
          <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 18 }}>Backing up your files…</div>
          <div style={{ background: t.border, borderRadius: 999, height: 10, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999,
              background: "linear-gradient(90deg,#60A5FA,#6366F1)", transition: "width 0.2s ease" }} />
          </div>
          <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>{Math.round(progress)}% complete</div>
        </div>
      )}
    </div>
  );
}

// ─── BACKUP DONE ──────────────────────────────────────────────────────────────
function BackupDoneScreen({ nav, t }) {
  const dark = t.bg === "#0A0F1E";
  return (
    <div style={{ padding: "32px 20px", textAlign: "center", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <div className="fade-in-d1" style={{ fontFamily: "'Nunito'", fontSize: 24, color: t.text, marginBottom: 8 }}>Backup complete!</div>
      <div className="fade-in-d2" style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 28, lineHeight: 1.6 }}>
        12 files (312 MB) safely stored in SnapVault Cloud.
      </div>
      <div className="fade-in-d3" style={{ background: t.bgSubtle, borderRadius: 16, padding: "16px", marginBottom: 20, textAlign: "left" }}>
        <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 12 }}>What would you like to do with the originals?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "🗑️", label: "Delete from iPhone", sub: "Free up 312 MB now", color: "#EF4444", bg: dark ? "#3B0A0A" : "#FEF2F2", border: dark ? "#7F1D1D" : "#FECACA" },
            { icon: "📱", label: "Keep on iPhone", sub: "Files stay on device too", color: "#16A34A", bg: dark ? "#0A2E1A" : "#F0FDF4", border: dark ? "#14532D" : "#BBF7D0" },
          ].map(opt => (
            <button key={opt.label} onClick={() => nav("home")} className="card-hover"
              style={{ background: opt.bg, border: `1.5px solid ${opt.border}`, borderRadius: 12,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 18 }}>{opt.icon}</span>
              <div>
                <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 13, color: opt.color }}>{opt.label}</div>
                <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted, marginTop: 1 }}>{opt.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="fade-in-d4">
        <Btn t={t} onClick={() => nav("gallery")}>☁️ View My Cloud Gallery</Btn>
      </div>
    </div>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function GalleryScreen({ nav, t, cloudFiles, setCloudFiles }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const filtered = cloudFiles.filter(p => {
    const matchFilter = filter === "Photos" ? p.type === "photo" : filter === "Videos" ? p.type === "video" : true;
    const matchSearch = search === "" || p.label.toLowerCase().includes(search.toLowerCase()) || p.date.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const doDelete = () => {
    setCloudFiles(cf => cf.filter(f => !selected.includes(f.id)));
    setSelected([]); setSelectMode(false); setConfirmDelete(false);
  };

  if (detail) {
    const item = cloudFiles.find(f => f.id === detail);
    if (!item) { setDetail(null); return null; }
    return (
      <div style={{ padding: "20px 20px 32px", background: t.bg, minHeight: "100%" }}>
        <BackBtn onClick={() => setDetail(null)} t={t} />
        <div className="fade-in" style={{ marginTop: 14, borderRadius: 20, overflow: "hidden", aspectRatio: "1", background: item.color, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 52 }}>{item.type === "video" ? "🎬" : "🖼️"}</span>
        </div>
        <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 16, color: t.text }}>{item.label}</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginBottom: 18 }}>{item.size} · {item.date}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "👁️", label: "View Full Size", v: "primary" },
            { icon: "⬇️", label: "Download to iPhone", v: "secondary" },
            { icon: "📤", label: "Share", v: "secondary" },
            { icon: "🗑️", label: "Delete from Cloud", v: "danger" },
          ].map(opt => <Btn key={opt.label} variant={opt.v} t={t} onClick={() => { if(opt.v==="danger"){setCloudFiles(cf=>cf.filter(f=>f.id!==detail));setDetail(null);}else{setDetail(null);} }}>{opt.icon} {opt.label}</Btn>)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ padding: "16px 20px 10px", borderBottom: `1px solid ${t.border}` }}>
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <BackBtn onClick={() => nav("home")} t={t} />
          <div style={{ fontFamily: "'Nunito'", fontSize: 19, color: t.text }}>Cloud Gallery</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button onClick={() => { setSelectMode(s => !s); setSelected([]); }} className="btn-press"
              style={{ background: selectMode ? "#3B82F6" : t.bgMuted, border: "none", borderRadius: 8, padding: "5px 10px",
                fontFamily: "'Nunito Sans'", fontSize: 11, fontWeight: 700, color: selectMode ? "white" : t.textSub, cursor: "pointer" }}>
              {selectMode ? "Cancel" : "Select"}
            </button>
            <div style={{ background: t.pill, borderRadius: 8, padding: "4px 10px", fontFamily: "'Nunito Sans'", fontSize: 11, fontWeight: 700, color: t.pillText }}>{cloudFiles.length} files</div>
          </div>
        </div>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or date…"
            style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: `1.5px solid ${t.inputBorder}`,
              background: t.inputBg, color: t.text, fontFamily: "'Nunito Sans'", fontSize: 13, outline: "none" }} />
        </div>
        <FilterTabs active={filter} onChange={setFilter} t={t} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 40, fontFamily: "'Nunito Sans'", color: t.textMuted, fontSize: 14 }}>No files found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {filtered.map((item, i) => (
              <Thumbnail key={item.id} item={item}
                selected={selectMode && selected.includes(item.id)}
                showCheck={selectMode}
                onToggle={id => selectMode ? toggle(id) : setDetail(id)}
                delay={i * 0.025} />
            ))}
          </div>
        )}
      </div>

      {selectMode && (
        <div style={{ padding: "10px 20px 22px", borderTop: `1px solid ${t.border}`, background: t.bg }}>
          {selected.length > 0 ? (
            <>
              <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub, marginBottom: 8 }}>
                <strong style={{ color: t.text }}>{selected.length} selected</strong>
              </div>
              <Btn variant="danger" t={t} onClick={() => setConfirmDelete(true)}>🗑️ Delete {selected.length} Files from Cloud</Btn>
            </>
          ) : (
            <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, padding: "6px 0" }}>Tap files to select</div>
          )}
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "absolute", inset: 0, background: "#00000070", display: "flex", alignItems: "flex-end", zIndex: 99 }}>
          <div className="slide-in" style={{ width: "100%", background: t.bgCard, borderRadius: "24px 24px 0 0", padding: "24px 20px 36px" }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 20, color: t.text, marginBottom: 8 }}>Delete {selected.length} files?</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 20, lineHeight: 1.5 }}>This will permanently remove them from your cloud. This cannot be undone.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn variant="danger" t={t} onClick={doDelete}>Yes, Delete Permanently</Btn>
              <Btn variant="secondary" t={t} onClick={() => setConfirmDelete(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLANS ────────────────────────────────────────────────────────────────────
const PLANS = [
  { name: "Free", price: "$0", period: "", storage: "5 GB", color: "#64748B", features: ["5 GB storage", "Manual backup only", "Basic gallery", "Single device"], recommended: false },
  { name: "Plus", price: "$1.99", period: "/mo", storage: "50 GB", color: "#3B82F6", features: ["50 GB storage", "Auto-backup", "Multi-device", "Search & filters", "Priority support"], recommended: true },
  { name: "Pro", price: "$4.99", period: "/mo", storage: "200 GB", color: "#6366F1", features: ["200 GB storage", "Auto-backup", "Unlimited devices", "Advanced search", "Shared albums", "24/7 support"], recommended: false },
];

function PlansScreen({ nav, t }) {
  const [active, setActive] = useState("Plus");
  return (
    <div style={{ padding: "20px 20px 32px", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <BackBtn onClick={() => nav("home")} t={t} />
        <div style={{ fontFamily: "'Nunito'", fontSize: 20, color: t.text }}>Storage Plans</div>
      </div>
      <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 20, lineHeight: 1.5 }}>
        Choose the plan that fits your needs.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PLANS.map((plan, i) => (
          <button key={plan.name} onClick={() => setActive(plan.name)} className={`card-hover fade-in-d${i+1}`}
            style={{ background: active === plan.name ? `${plan.color}12` : t.bgCard,
              border: `2px solid ${active === plan.name ? plan.color : t.border}`,
              borderRadius: 18, padding: "16px", cursor: "pointer", textAlign: "left",
              position: "relative", transition: "all 0.2s" }}>
            {plan.recommended && (
              <div style={{ position: "absolute", top: -10, right: 16, background: "#3B82F6", color: "white",
                fontFamily: "'Nunito Sans'", fontSize: 10, fontWeight: 800, padding: "3px 10px",
                borderRadius: 999, letterSpacing: 0.5 }}>RECOMMENDED</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 18, color: plan.color }}>{plan.name}</div>
                <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>{plan.storage} storage</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text }}>{plan.price}</span>
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted }}>{plan.period}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: plan.color, fontSize: 12 }}>✓</span>
                  <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub }}>{f}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <Btn t={t} onClick={() => nav("home")}>Continue with {active}</Btn>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsScreen({ nav, t, dark, setDark }) {
  const [toggles, setToggles] = useState({ photos: true, videos: false, wifi: true, notify: true });
  const set = k => setToggles(p => ({ ...p, [k]: !p[k] }));
  const rows = [
    { key: "photos", icon: "📸", label: "Auto-backup new photos", sub: "When added to library" },
    { key: "videos", icon: "🎥", label: "Auto-backup new videos", sub: "May use more storage" },
    { key: "wifi", icon: "📶", label: "Only backup on WiFi", sub: "Saves mobile data" },
    { key: "notify", icon: "🔔", label: "Storage alerts", sub: "Notify when > 80% full" },
  ];
  return (
    <div style={{ padding: "20px 20px 32px", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <BackBtn onClick={() => nav("home")} t={t} />
        <div style={{ fontFamily: "'Nunito'", fontSize: 20, color: t.text }}>Settings</div>
      </div>

      <div className="fade-in-d1" style={{ background: t.bgSubtle, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        {rows.map((row, i) => (
          <div key={row.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : "none" }}>
            <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{row.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 600, fontSize: 13, color: t.text }}>{row.label}</div>
              <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted }}>{row.sub}</div>
            </div>
            <Toggle value={toggles[row.key]} onChange={() => set(row.key)} />
          </div>
        ))}
      </div>

      <div className="fade-in-d2" style={{ background: t.bgSubtle, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px" }}>
          <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{dark ? "🌙" : "☀️"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 600, fontSize: 13, color: t.text }}>Dark Mode</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted }}>Switch app appearance</div>
          </div>
          <Toggle value={dark} onChange={() => setDark(d => !d)} />
        </div>
      </div>

      <div className="fade-in-d3" style={{ background: t.bgSubtle, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 10 }}>Storage Plan</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub }}>Free Plan · 5 GB</span>
          <span style={{ fontFamily: "'Nunito Sans'", fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>2.1 GB used</span>
        </div>
        <div style={{ background: t.border, borderRadius: 999, height: 7, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ width: "42%", height: "100%", background: "linear-gradient(90deg,#3B82F6,#6366F1)", borderRadius: 999 }} />
        </div>
        <Btn t={t} onClick={() => nav("plans")} style={{ padding: "11px 0", fontSize: 13 }}>⚡ Upgrade Plan</Btn>
      </div>

      <div className="fade-in-d4">
        <Btn variant="danger" t={t} onClick={() => nav("onboarding")} style={{ fontSize: 13 }}>Sign Out</Btn>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const SCREENS = { onboarding: OnboardingScreen, login: AuthScreen, home: HomeScreen, browse: BrowseScreen, "backup-confirm": BackupConfirmScreen, "backup-done": BackupDoneScreen, gallery: GalleryScreen, plans: PlansScreen, settings: SettingsScreen };
const BOTTOM_TABS = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "browse", icon: "🗂️", label: "Select" },
  { key: "gallery", icon: "☁️", label: "Cloud" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];
const SHOW_TAB = ["home","browse","gallery","settings"];

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [dark, setDark] = useState(false);
  const [cloudFiles, setCloudFiles] = useState(initCloud);
  const t = getTheme(dark);
  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: dark ? "#020617" : "#CBD5E1", padding: 20, transition: "background 0.4s", fontFamily: "'Nunito Sans'" }}>
      <style>{css}</style>
      <div style={{ width: 375, background: t.bg, borderRadius: 44, overflow: "hidden", display: "flex", flexDirection: "column", height: 740, position: "relative",
        boxShadow: dark ? "0 32px 80px #000000A0, 0 8px 32px #00000060, inset 0 1px 0 #ffffff10" : "0 24px 60px #00000025, 0 4px 16px #00000015, inset 0 1px 0 #ffffff80",
        border: dark ? "1px solid #1A2236" : "1px solid #E2E8F0", transition: "all 0.4s" }}>

        {/* Status bar */}
        <div style={{ background: t.statusBar, padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, transition: "background 0.3s" }}>
          <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, fontWeight: 700, color: t.text }}>9:41</span>
          <div style={{ width: 90, height: 16, background: t.text, borderRadius: 999, opacity: 0.85 }} />
          <DarkToggle dark={dark} setDark={setDark} />
        </div>

        {/* Content */}
        <div key={screen} className="slide-in" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <Screen nav={setScreen} t={t} dark={dark} setDark={setDark} cloudFiles={cloudFiles} setCloudFiles={setCloudFiles} />
        </div>

        {/* Bottom nav */}
        {SHOW_TAB.includes(screen) && (
          <div style={{ borderTop: `1px solid ${t.bottomBorder}`, background: t.bottomBar, display: "flex", padding: "10px 0 18px", flexShrink: 0, transition: "all 0.3s" }}>
            {BOTTOM_TABS.map(tab => (
              <button key={tab.key} onClick={() => setScreen(tab.key)} className="tab-bounce"
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  opacity: screen === tab.key ? 1 : 0.4, transition: "opacity 0.15s" }}>
                <span style={{ fontSize: 20 }}>{tab.icon}</span>
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 10, fontWeight: 700, color: screen === tab.key ? "#3B82F6" : t.tabInactive }}>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
